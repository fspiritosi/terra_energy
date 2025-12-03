"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Tipo para el checklist completo
export type ChecklistCompleto = {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  secciones: Array<{
    id: string;
    nombre: string;
    orden: number;
    subcategorias: Array<{
      id: string;
      nombre: string;
      norma_aplicable: string | null;
      orden: number;
      requisitos: Array<{
        id: string;
        descripcion: string;
        norma_aplicable: string | null;
        orden: number;
        tipos_respuesta: Array<{
          id: string;
          codigo: string;
          nombre: string;
          tipo_dato: string;
          orden: number;
        }>;
      }>;
    }>;
    requisitos: Array<{
      id: string;
      descripcion: string;
      norma_aplicable: string | null;
      orden: number;
      tipos_respuesta: Array<{
        id: string;
        codigo: string;
        nombre: string;
        tipo_dato: string;
        orden: number;
      }>;
    }>;
  }>;
};

// Obtener el checklist completo de un tipo de inspección
export async function getChecklistCompleto(tipoInspeccionId: string): Promise<ChecklistCompleto | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_tipo_inspeccion_checklist_completo', {
    tipo_id: tipoInspeccionId
  });

  if (error) {
    console.error("Error fetching checklist completo:", error);
    throw new Error("Error al obtener el checklist");
  }

  // La función devuelve un JSON directamente
  return (data as any) as ChecklistCompleto | null;
}

// Obtener los tipos de inspección de una solicitud
export async function getTiposInspeccionDeSolicitud(solicitudId: string) {
  const supabase = await createClient();

  // Primero obtener los IDs de los trabajos
  const { data: trabajos, error: trabajosError } = await supabase
    .from("solicitud_trabajos")
    .select("id, tipo_inspeccion_id")
    .eq("solicitud_id", solicitudId);

  if (trabajosError) {
    console.error("Error fetching trabajos:", trabajosError);
    throw new Error("Error al obtener los trabajos");
  }

  if (!trabajos || trabajos.length === 0) {
    return [];
  }

  // Obtener los tipos de inspección
  const tipoIds = trabajos.map((t) => t.tipo_inspeccion_id);
  const { data: tipos, error: tiposError } = await supabase
    .from("tipos_inspeccion_checklist")
    .select("id, codigo, nombre, descripcion, orden")
    .in("id", tipoIds);

  if (tiposError) {
    console.error("Error fetching tipos de inspección:", tiposError);
    throw new Error("Error al obtener los tipos de inspección");
  }

  // Combinar trabajos con tipos
  return trabajos.map((trabajo) => ({
    id: trabajo.id,
    tipo_inspeccion: tipos?.find((t) => t.id === trabajo.tipo_inspeccion_id) || null,
  }));
}

// Obtener la solicitud de una inspección
export async function getSolicitudDeInspeccion(inspeccionId: string) {
  const supabase = await createClient();

  const { data: inspeccion, error: inspeccionError } = await supabase
    .from("inspecciones")
    .select("solicitud_id")
    .eq("id", inspeccionId)
    .single();

  if (inspeccionError || !inspeccion) {
    throw new Error("Error al obtener la inspección");
  }

  return inspeccion.solicitud_id;
}

// Tipo para las respuestas del checklist
export type RespuestaChecklist = {
  requisito_id: string;
  tipo_respuesta_id: string;
  valor_texto?: string | null;
  valor_numero?: number | null;
  valor_booleano?: boolean | null;
  valor_fecha?: string | null;
  valor_tiempo?: string | null;
};

// Guardar respuestas del checklist
export async function guardarRespuestasChecklist(
  inspeccionId: string,
  respuestas: RespuestaChecklist[]
): Promise<void> {
  const supabase = await createClient();

  // Eliminar respuestas existentes para esta inspección
  const { error: deleteError } = await supabase
    .from("inspeccion_respuestas")
    .delete()
    .eq("inspeccion_id", inspeccionId);

  if (deleteError) {
    console.error("Error deleting existing responses:", deleteError);
    throw new Error("Error al eliminar respuestas existentes");
  }

  // Insertar nuevas respuestas
  if (respuestas.length > 0) {
    const respuestasParaInsertar = respuestas.map((respuesta) => ({
      inspeccion_id: inspeccionId,
      requisito_id: respuesta.requisito_id,
      tipo_respuesta_id: respuesta.tipo_respuesta_id,
      valor_texto: respuesta.valor_texto || null,
      valor_numero: respuesta.valor_numero || null,
      valor_booleano: respuesta.valor_booleano ?? null,
      valor_fecha: respuesta.valor_fecha || null,
      valor_tiempo: respuesta.valor_tiempo || null,
    }));

    const { error: insertError } = await supabase
      .from("inspeccion_respuestas")
      .insert(respuestasParaInsertar);

    if (insertError) {
      console.error("Error inserting responses:", insertError);
      throw new Error("Error al guardar las respuestas");
    }
  }

  revalidatePath("/dashboard/inspecciones");
}

// Obtener respuestas guardadas de una inspección
export async function getRespuestasChecklist(inspeccionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inspeccion_respuestas")
    .select(
      `
      id,
      requisito_id,
      tipo_respuesta_id,
      valor_texto,
      valor_numero,
      valor_booleano,
      valor_fecha,
      valor_tiempo,
      tipo_respuesta:tipos_respuesta (
        codigo,
        tipo_dato
      )
    `
    )
    .eq("inspeccion_id", inspeccionId);

  if (error) {
    console.error("Error fetching respuestas:", error);
    throw new Error("Error al obtener las respuestas");
  }

  return data || [];
}

