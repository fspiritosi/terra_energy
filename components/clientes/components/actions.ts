"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClientes() {
  const supabase = await createClient();

  const { data: clientes, error } = await supabase.from("clientes").select("*");

  if (error) {
    console.error("Error fetching clientes:", error);
    throw new Error("Failed to fetch clientes");
  }

  if (!clientes) return [];

  // Ordenamiento personalizado: activos primero (alfabéticamente), luego inactivos (alfabéticamente)
  const clientesOrdenados = clientes.sort((a, b) => {
    // Si uno es activo y el otro no, el activo va primero
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;

    // Si ambos tienen el mismo estado (ambos activos o ambos inactivos), ordenar alfabéticamente por nombre
    return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
  });

  return clientesOrdenados;
}

// Exportamos el tipo de retorno de la función
export type Cliente = Awaited<ReturnType<typeof getClientes>>[0];
