"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import moment from "moment";

export type CreateClienteData =
  Database["public"]["Tables"]["clientes"]["Insert"];

export type UpdateClienteData = CreateClienteData & {
  id: string;
};

export async function createCliente(data: CreateClienteData) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("clientes").insert({
      nombre: data.nombre,
      cuit: data.cuit,
      email: data.email || null,
      telefono: data.telefono || null,
      direccion: data.direccion || null,
      moneda: data.moneda,
      is_active: data.is_active,
    });

    if (error) {
      console.error("Error creating cliente:", error);
      throw new Error("Error al crear el cliente");
    }

    revalidatePath("/dashboard/clientes");
    return { success: true };
  } catch (error) {
    console.error("Error in createCliente:", error);
    throw error;
  }
}

export async function updateCliente(data: UpdateClienteData) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: data.nombre,
        cuit: data.cuit,
        email: data.email || null,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        moneda: data.moneda,
        is_active: data.is_active,
        updated_at: moment().toISOString(),
      })
      .eq("id", data.id);

    if (error) {
      console.error("Error updating cliente:", error);
      throw new Error("Error al actualizar el cliente");
    }

    revalidatePath("/dashboard/clientes");
    return { success: true };
  } catch (error) {
    console.error("Error in updateCliente:", error);
    throw error;
  }
}

export async function deleteCliente(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("clientes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting cliente:", error);
      throw new Error("Error al eliminar el cliente");
    }

    revalidatePath("/dashboard/clientes");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteCliente:", error);
    throw error;
  }
}
