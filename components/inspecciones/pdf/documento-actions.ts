"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateDocumentQR } from "@/lib/pdf/qr-generator";
import type { InformeData } from "./informe-inspeccion-pdf";
import moment from "moment";
import "moment/locale/es";

// Tipo para el documento
export type DocumentoInspeccion = {
  id: string;
  inspeccion_id: string;
  numero_documento: string;
  tipo_documento: string;
  pdf_url: string | null;
  pdf_storage_path: string | null;
  qr_payload: string;
  qr_imagen_url: string | null;
  revision: string | null;
  fecha_documento: string;
  fecha_vencimiento: string | null;
  resultado: string;
  observaciones_generales: string | null;
  operador_id: string | null;
  operador_nombre: string | null;
  supervisor_id: string | null;
  supervisor_nombre: string | null;
  cliente_acepto: boolean | null;
  cliente_acepto_fecha: string | null;
  hash_documento: string | null;
  created_at: string | null;
  updated_at: string | null;
};

/**
 * Obtiene los datos completos para generar el informe PDF
 */
export async function getDatosParaInforme(inspeccionId: string): Promise<InformeData | null> {
  const supabase = await createClient();

  // Obtener datos de la inspección
  const { data: inspeccion, error: inspeccionError } = await supabase
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
            nombre,
            descripcion
          )
        )
      )
    `)
    .eq("id", inspeccionId)
    .single();

  if (inspeccionError || !inspeccion) {
    console.error("Error fetching inspeccion:", inspeccionError);
    return null;
  }

  // Obtener respuestas del checklist
  const { data: respuestas, error: respuestasError } = await supabase
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
    .eq("inspeccion_id", inspeccionId);

  if (respuestasError) {
    console.error("Error fetching respuestas:", respuestasError);
    return null;
  }

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

    // Determinar la sección (puede venir de subcategoria o directo)
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

  // Convertir Map a array
  const secciones = Array.from(seccionesMap.values()).map((s) => ({
    nombre: s.nombre,
    requisitos: Array.from(s.requisitos.values()),
  }));

  // Determinar resultado general basado en respuestas booleanas
  let resultado: "aprobado" | "rechazado" | "con_observaciones" = "aprobado";
  const todasRespuestasBooleanas = (respuestas || [])
    .filter((r) => (r.tipo_respuesta as any)?.tipo_dato === "booleano")
    .map((r) => r.valor_booleano);

  if (todasRespuestasBooleanas.some((v) => v === false)) {
    resultado = "rechazado";
  }

  // Obtener el tipo de inspección principal
  const solicitud = inspeccion.solicitud as any;
  const tipoInspeccion = solicitud?.trabajos?.[0]?.tipo_inspeccion?.nombre || "Inspección General";

  // Generar QR provisional (se actualizará con el ID real del documento)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://terra-energy.vercel.app";
  const qrPlaceholder = await generateDocumentQR(inspeccionId, baseUrl);

  // Obtener imágenes de la solicitud
  const imagenes = solicitud?.imagenes?.map((img: any) => img.imagen_url) || [];

  // Formatear fecha
  const fechaInspeccion = inspeccion.fecha_completada
    ? moment(inspeccion.fecha_completada).locale('es').format('DD/MM/YYYY')
    : moment().locale('es').format('DD/MM/YYYY');

  const fechaVencimiento = inspeccion.fecha_completada
    ? moment(inspeccion.fecha_completada).add(1, 'year').locale('es').format('DD/MM/YYYY')
    : undefined;

  return {
    numeroDocumento: "", // Se asignará al crear el documento
    revision: "00",
    fechaDocumento: moment().locale('es').format('DD/MM/YYYY'),
    fechaVencimiento,
    codigoDocumento: "MKG-R09-00 rev.00",
    clienteNombre: solicitud?.cliente?.nombre || inspeccion.cliente_nombre || "Cliente",
    clienteLogo: solicitud?.cliente?.logo,
    lugar: inspeccion.lugar || solicitud?.lugar || "",
    numeroInspeccion: inspeccion.numero_inspeccion || "",
    equipo: inspeccion.equipo || solicitud?.equipo || "",
    fechaInspeccion,
    tipoInspeccion,
    qrDataUrl: qrPlaceholder.qrDataUrl,
    resultado,
    observaciones: inspeccion.observaciones || undefined,
    secciones,
    imagenes,
  };
}

/**
 * Crea un registro de documento en la base de datos
 */
export async function crearDocumentoInspeccion(
  inspeccionId: string,
  resultado: string,
  observaciones?: string
): Promise<DocumentoInspeccion | null> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://terra-energy.vercel.app";

  // Crear el documento primero para obtener el ID
  const { data: documento, error } = await supabase
    .from("documentos_inspeccion")
    .insert({
      inspeccion_id: inspeccionId,
      numero_documento: "", // Se generará automáticamente
      resultado,
      observaciones_generales: observaciones || null,
      qr_payload: "", // Se actualizará después
    })
    .select()
    .single();

  if (error || !documento) {
    console.error("Error creating documento:", error);
    throw new Error("Error al crear el documento de inspección");
  }

  // Generar QR con el ID real del documento
  const { qrPayload, qrDataUrl } = await generateDocumentQR(documento.id, baseUrl);

  // Actualizar con el QR correcto
  const { data: documentoActualizado, error: updateError } = await supabase
    .from("documentos_inspeccion")
    .update({
      qr_payload: qrPayload,
      qr_imagen_url: qrDataUrl,
    })
    .eq("id", documento.id)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating documento with QR:", updateError);
  }

  revalidatePath("/dashboard/inspecciones");
  revalidatePath("/dashboard/documentos");

  return documentoActualizado || documento;
}

/**
 * Obtiene el documento de una inspección
 */
export async function getDocumentoDeInspeccion(
  inspeccionId: string
): Promise<DocumentoInspeccion | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos_inspeccion")
    .select("*")
    .eq("inspeccion_id", inspeccionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No se encontró documento
      return null;
    }
    console.error("Error fetching documento:", error);
    return null;
  }

  return data;
}

/**
 * Obtiene un documento por su ID (para verificación pública)
 */
export async function getDocumentoPorId(
  documentoId: string
): Promise<DocumentoInspeccion | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos_inspeccion")
    .select("*")
    .eq("id", documentoId)
    .single();

  if (error) {
    console.error("Error fetching documento by id:", error);
    return null;
  }

  return data;
}

/**
 * Obtiene todos los documentos con información de la inspección
 */
export async function getDocumentos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos_inspeccion")
    .select(`
      *,
      inspeccion:inspecciones (
        id,
        numero_inspeccion,
        cliente_nombre,
        lugar,
        equipo,
        fecha_completada
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documentos:", error);
    throw new Error("Error al obtener los documentos");
  }

  return data || [];
}

/**
 * Actualiza la URL del PDF después de subirlo a storage
 */
export async function actualizarPdfUrl(
  documentoId: string,
  pdfUrl: string,
  storagePath: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("documentos_inspeccion")
    .update({
      pdf_url: pdfUrl,
      pdf_storage_path: storagePath,
    })
    .eq("id", documentoId);

  if (error) {
    console.error("Error updating PDF URL:", error);
    throw new Error("Error al actualizar la URL del PDF");
  }

  revalidatePath("/dashboard/documentos");
}

