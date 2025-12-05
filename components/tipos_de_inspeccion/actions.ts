'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getChecklistCompleto } from "@/components/inspecciones/components/checklist-actions";

export async function getTipoDeInspeccion() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from("tipos_inspeccion_checklist")
            .select("*")
            .order("orden, nombre");
        if (error) {
            console.log(error);
            return [];
        }
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export type TipoDeInspeccionType = Awaited<ReturnType<typeof getTipoDeInspeccion>>[0];

export async function createTipoDeInspeccion(tipoDeInspeccion: {
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  orden?: number;
  is_active?: boolean;
}) {
  const supabase = await createClient();
  try {
    const response = await supabase
      .from("tipos_inspeccion_checklist")
      .insert(tipoDeInspeccion);
    revalidatePath("/dashboard/inspecciones/tipos_de_inspeccion");
    return response;
  } catch (error) {
    console.log(error);
    return { error } as any;
  }
}

export type CreateTipoDeInspeccionData = Omit<Awaited<ReturnType<typeof createTipoDeInspeccion>>[0], "id">;

export async function updateTipoDeInspeccion(
  id: string,
  tipoDeInspeccion: {
    nombre?: string;
    codigo?: string;
    descripcion?: string | null;
    orden?: number;
    is_active?: boolean;
  }
) {
  const supabase = await createClient();
  try {
    const response = await supabase
      .from("tipos_inspeccion_checklist")
      .update(tipoDeInspeccion)
      .eq("id", id);
    revalidatePath("/dashboard/inspecciones/tipos_de_inspeccion");
    return response;
  } catch (error) {
    console.log(error);
    return { error } as any;
  }
}

export type UpdateTipoDeInspeccionData = Omit<Awaited<ReturnType<typeof updateTipoDeInspeccion>>[0], "id">;

export async function deleteTipoDeInspeccion(id: string) {
  const supabase = await createClient();
  try {
    const response = await supabase
      .from("tipos_inspeccion_checklist")
      .delete()
      .eq("id", id);
    revalidatePath("/dashboard/inspecciones/tipos_de_inspeccion");
    return response;
  } catch (error) {
    console.log(error);
    return { error } as any;
  }
}

export async function getTipoDeInspeccionBySlug(slug: string) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from("tipos_inspeccion_checklist")
            .select("*")
            .eq("slug", slug)
            .single();
        if (error) {
            console.log(error);
            return null;
        }
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getInspeccionesByTipoInspeccion(tipoInspeccionId: string) {
    const supabase = await createClient();
    try {
        // Obtener todas las solicitudes que tienen este tipo de inspección
        const { data: solicitudTrabajos, error: trabajosError } = await supabase
            .from("solicitud_trabajos")
            .select("solicitud_id")
            .eq("tipo_inspeccion_id", tipoInspeccionId);

        if (trabajosError || !solicitudTrabajos || solicitudTrabajos.length === 0) {
            return [];
        }

        const solicitudIds = solicitudTrabajos.map((st) => st.solicitud_id);

        // Obtener las inspecciones asociadas a esas solicitudes
        const { data: inspecciones, error: inspeccionesError } = await supabase
            .from("inspecciones")
            .select(`
                id,
                numero_inspeccion,
                estado,
                fecha_programada,
                fecha_completada,
                solicitud:solicitudes_inspeccion (
                    id,
                    numero_solicitud,
                    cliente:clientes (
                        id,
                        nombre
                    )
                )
            `)
            .in("solicitud_id", solicitudIds)
            .order("fecha_programada", { ascending: false });

        if (inspeccionesError) {
            console.error("Error fetching inspecciones:", inspeccionesError);
            return [];
        }

        return inspecciones || [];
    } catch (error) {
        console.error("Error in getInspeccionesByTipoInspeccion:", error);
        return [];
    }
}