"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import moment from "moment-timezone";

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires';

export async function getInspecciones() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inspecciones")
    .select("*")
    .order("fecha_programada", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inspecciones:", error);
    throw new Error("Error al obtener las inspecciones");
  }

  return data || [];
}
export type getInspeccionesType = Awaited<ReturnType<typeof getInspecciones>>;

export async function updateInspeccion(
  inspeccionData: Database["public"]["Tables"]["inspecciones"]["Update"]
): Promise<void> {
  const supabase = await createClient();

  const updateData: Record<string, string | null> = {};

  if (inspeccionData.fecha_programada) {
    updateData.fecha_programada = inspeccionData.fecha_programada;
  }

  if (inspeccionData.estado) {
    updateData.estado = inspeccionData.estado;

    // Si se marca como completada, agregar fecha de completado
    if (inspeccionData.estado === "completada") {
      updateData.fecha_completada = moment.tz(TIMEZONE_ARGENTINA).format('YYYY-MM-DD');
    }
  }

  if (inspeccionData.observaciones !== undefined) {
    updateData.observaciones = inspeccionData.observaciones;
  }

  if (inspeccionData.inspector_asignado_id !== undefined) {
    updateData.inspector_asignado_id = inspeccionData.inspector_asignado_id;
  }

  const { error } = await supabase
    .from("inspecciones")
    .update(updateData)
    .eq("id", inspeccionData.id!);

  if (error) {
    console.error("Error updating inspeccion:", error);
    throw new Error("Error al actualizar la inspección");
  }

  revalidatePath("/dashboard/inspecciones");
}

export async function reprogramarInspeccion(
  id: string,
  nuevaFecha: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("inspecciones")
    .update({
      fecha_programada: nuevaFecha,
    })
    .eq("id", id);

  if (error) {
    console.error("Error reprogramming inspeccion:", error);
    throw new Error("Error al reprogramar la inspección");
  }

  revalidatePath("/dashboard/inspecciones");
}
