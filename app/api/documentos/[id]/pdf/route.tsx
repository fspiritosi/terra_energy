import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { InformeInspeccionPDF, type InformeData } from "@/components/inspecciones/pdf/informe-inspeccion-pdf";
import { generateDocumentQR } from "@/lib/pdf/qr-generator";
import moment from "moment-timezone";
import "moment/locale/es";

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentoId } = await params;
    const supabase = await createClient();

    // Obtener el documento
    const { data: documento, error: docError } = await supabase
      .from("documentos_inspeccion")
      .select("*")
      .eq("id", documentoId)
      .single();

    if (docError || !documento) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    // Obtener la inspección con todos los datos
    const { data: inspeccion, error: inspError } = await supabase
      .from("inspecciones")
      .select(`
        *,
        solicitud:solicitudes_inspeccion (
          *,
          cliente:clientes (
            id,
            nombre,
            logo
          ),
          imagenes:solicitud_imagenes (
            imagen_url,
            orden
          ),
          items:solicitud_items (
            id,
            descripcion,
            cantidad,
            orden,
            inspections:solicitud_item_inspections (
              inspection_type:item_inspection_types (
                id,
                codigo,
                nombre
              )
            )
          ),
          trabajos:solicitud_trabajos (
            tipo_inspeccion:tipos_inspeccion_checklist (
              id,
              codigo,
              nombre
            )
          )
        )
      `)
      .eq("id", documento.inspeccion_id)
      .single();

    if (inspError || !inspeccion) {
      return NextResponse.json(
        { error: "Inspección no encontrada" },
        { status: 404 }
      );
    }

    // Obtener respuestas del checklist
    const { data: respuestas } = await supabase
      .from("inspeccion_respuestas")
      .select(`
        *,
        requisito:checklist_requisitos (
          id,
          descripcion,
          seccion:checklist_secciones (
            id,
            nombre
          ),
          subcategoria:checklist_subcategorias (
            id,
            nombre,
            seccion:checklist_secciones (
              id,
              nombre
            )
          )
        ),
        tipo_respuesta:tipos_respuesta (
          codigo,
          nombre,
          tipo_dato
        )
      `)
      .eq("inspeccion_id", documento.inspeccion_id);

    // Agrupar respuestas por sección
    const seccionesMap = new Map<string, {
      nombre: string;
      requisitos: Map<string, {
        descripcion: string;
        respuestas: Array<{ tipo: string; valor: string | number | boolean | null }>;
      }>;
    }>();

    for (const resp of respuestas || []) {
      const requisito = resp.requisito as any;
      if (!requisito) continue;

      let seccionNombre = "Sin sección";
      if (requisito.subcategoria?.seccion?.nombre) {
        seccionNombre = requisito.subcategoria.seccion.nombre;
      } else if (requisito.seccion?.nombre) {
        seccionNombre = requisito.seccion.nombre;
      }

      if (!seccionesMap.has(seccionNombre)) {
        seccionesMap.set(seccionNombre, {
          nombre: seccionNombre,
          requisitos: new Map(),
        });
      }

      const seccion = seccionesMap.get(seccionNombre)!;
      const requisitoId = requisito.id;

      if (!seccion.requisitos.has(requisitoId)) {
        seccion.requisitos.set(requisitoId, {
          descripcion: requisito.descripcion,
          respuestas: [],
        });
      }

      const tipoResp = resp.tipo_respuesta as any;
      let valor: string | number | boolean | null = null;

      switch (tipoResp?.tipo_dato) {
        case "booleano":
          valor = resp.valor_booleano;
          break;
        case "numero":
          valor = resp.valor_numero;
          break;
        case "texto":
        case "lista":
          valor = resp.valor_texto;
          break;
        case "fecha":
          valor = resp.valor_fecha;
          break;
        case "tiempo":
          valor = resp.valor_tiempo as string | null;
          break;
        default:
          valor = resp.valor_texto || resp.valor_numero || resp.valor_booleano || null;
      }

      seccion.requisitos.get(requisitoId)!.respuestas.push({
        tipo: tipoResp?.nombre || "Respuesta",
        valor,
      });
    }

    const secciones = Array.from(seccionesMap.values()).map((s) => ({
      nombre: s.nombre,
      requisitos: Array.from(s.requisitos.values()),
    }));

    // Generar QR
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://terra-energy.vercel.app";
    const { qrDataUrl } = await generateDocumentQR(documentoId, baseUrl);

    // Preparar datos para el PDF
    const solicitud = inspeccion.solicitud as any;
    const tipoInspeccion = solicitud?.trabajos?.[0]?.tipo_inspeccion?.nombre || "Inspección General";
    const imagenes = solicitud?.imagenes?.map((img: any) => img.imagen_url) || [];
    const items = solicitud?.items || [];

    const fechaInspeccion = inspeccion.fecha_completada
      ? moment.tz(inspeccion.fecha_completada, TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')
      : moment.tz(TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY');

    const fechaVencimiento = inspeccion.fecha_completada
      ? moment.tz(inspeccion.fecha_completada, TIMEZONE_ARGENTINA).add(1, 'year').locale('es').format('DD/MM/YYYY')
      : undefined;

    // Construir tabla resumen simplificada desde los items
    const resultadoGeneral = (documento.resultado === "aprobado" ? "APROBADO" :
      documento.resultado === "rechazado" ? "RECHAZADO" : "APROBADO") as "APROBADO" | "RECHAZADO";

    // Obtener todos los tipos de ensayo únicos de los items
    const tiposEnsayoSet = new Set<string>();
    items.forEach((item: any) => {
      item.inspections?.forEach((insp: any) => {
        if (insp.inspection_type?.codigo) {
          tiposEnsayoSet.add(insp.inspection_type.codigo);
        }
      });
    });
    const tiposEnsayo = Array.from(tiposEnsayoSet).sort();

    // Construir items para la tabla resumen
    const itemsResumen = items.map((item: any, index: number) => {
      // Obtener tipos de inspección del item
      const resultadoPorTipo: Record<string, string> = {};

      item.inspections?.forEach((insp: any) => {
        if (insp.inspection_type?.codigo) {
          // Por ahora, todos tienen el mismo resultado general
          // En el futuro se puede determinar por tipo específico
          resultadoPorTipo[insp.inspection_type.codigo] = resultadoGeneral;
        }
      });

      // Distribuir imágenes: si hay múltiples imágenes, asignar una por item (circular)
      const imagen = imagenes.length > 0 ? imagenes[index % imagenes.length] : undefined;

      return {
        hoja: index + 1,
        identificacion: item.descripcion || inspeccion.equipo || "N/A",
        precinto: undefined, // Pendiente de implementar
        numeroSerie: undefined, // Pendiente de implementar
        resultadoPorTipo,
        resultadoGeneral,
        imagen,
      };
    });

    // Si no hay items, crear un item único con la info general para forzar el formato nuevo
    if (itemsResumen.length === 0) {
      itemsResumen.push({
        hoja: 1,
        identificacion: inspeccion.equipo || "Sin identificación",
        precinto: undefined,
        numeroSerie: undefined,
        resultadoPorTipo: { "GENERAL": resultadoGeneral },
        resultadoGeneral,
        imagen: imagenes[0],
      });
    }

    const informeData: InformeData = {
      numeroDocumento: documento.numero_documento,
      revision: documento.revision || "00",
      fechaDocumento: moment.tz(documento.fecha_documento, TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY'),
      fechaVencimiento,
      codigoDocumento: "MKG-R09-00 rev.00",
      clienteNombre: solicitud?.cliente?.nombre || inspeccion.cliente_nombre || "Cliente",
      clienteLogo: solicitud?.cliente?.logo,
      lugar: inspeccion.lugar || "",
      numeroInspeccion: inspeccion.numero_inspeccion || "",
      equipo: inspeccion.equipo || "",
      fechaInspeccion,
      tipoInspeccion,
      qrDataUrl,
      resultado: (documento.resultado as "aprobado" | "rechazado" | "con_observaciones") || "aprobado",
      observaciones: documento.observaciones_generales || undefined,
      secciones, // Mantener para compatibilidad con formato antiguo
      imagenes, // Mantener para compatibilidad
      operadorNombre: documento.operador_nombre || undefined,
      supervisorNombre: documento.supervisor_nombre || undefined,
      terraLogoUrl: `${baseUrl}/terra-logo-light.jpg`,
      // Nuevos campos para tabla resumen
      itemsResumen: itemsResumen.length > 0 ? itemsResumen : undefined,
      tiposEnsayo: tiposEnsayo.length > 0 ? tiposEnsayo : undefined,
    };

    // Generar PDF
    const pdfBuffer = await renderToBuffer(
      <InformeInspeccionPDF data={informeData} />
    );

    // Convertir Buffer a Uint8Array para NextResponse
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    // Retornar el PDF
    return new NextResponse(pdfUint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="informe-${documento.numero_documento}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Error al generar el PDF" },
      { status: 500 }
    );
  }
}
