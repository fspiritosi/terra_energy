"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Equipo {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateEquipoData {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateEquipoData extends CreateEquipoData {
  id: string;
}

export async function getEquipos(): Promise<Equipo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("equipos_inspeccion")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching equipos:", error);
    throw new Error("Error al obtener los equipos");
  }

  return data || [];
}

export async function getEquiposActivos(): Promise<Equipo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("equipos_inspeccion")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching equipos activos:", error);
    throw new Error("Error al obtener los equipos activos");
  }

  return data || [];
}

export async function createEquipo(
  equipoData: CreateEquipoData
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("equipos_inspeccion").insert({
    name: equipoData.name,
    description: equipoData.description,
    is_active: equipoData.is_active ?? true,
  });

  if (error) {
    console.error("Error creating equipo:", error);
    throw new Error("Error al crear el equipo");
  }

  revalidatePath("/dashboard/equipos");
}

export async function updateEquipo(
  equipoData: UpdateEquipoData
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("equipos_inspeccion")
    .update({
      name: equipoData.name,
      description: equipoData.description,
      is_active: equipoData.is_active,
    })
    .eq("id", equipoData.id);

  if (error) {
    console.error("Error updating equipo:", error);
    throw new Error("Error al actualizar el equipo");
  }

  revalidatePath("/dashboard/equipos");
}

export async function deleteEquipo(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("equipos_inspeccion")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting equipo:", error);
    throw new Error("Error al eliminar el equipo");
  }

  revalidatePath("/dashboard/equipos");
}
