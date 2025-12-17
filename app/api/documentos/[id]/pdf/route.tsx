import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { InformeInspeccionPDF, type InformeData } from "@/components/inspecciones/pdf/informe-inspeccion-pdf";
import { generateDocumentQR } from "@/lib/pdf/qr-generator";

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
            imagen_url
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

    const fechaInspeccion = inspeccion.fecha_completada
      ? new Date(inspeccion.fecha_completada).toLocaleDateString("es-AR")
      : new Date().toLocaleDateString("es-AR");

    const fechaVencimiento = inspeccion.fecha_completada
      ? new Date(
          new Date(inspeccion.fecha_completada).setFullYear(
            new Date(inspeccion.fecha_completada).getFullYear() + 1
          )
        ).toLocaleDateString("es-AR")
      : undefined;

    const informeData: InformeData = {
      numeroDocumento: documento.numero_documento,
      revision: documento.revision || "00",
      fechaDocumento: new Date(documento.fecha_documento).toLocaleDateString("es-AR"),
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
      secciones,
      imagenes,
      operadorNombre: documento.operador_nombre || undefined,
      supervisorNombre: documento.supervisor_nombre || undefined,
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

