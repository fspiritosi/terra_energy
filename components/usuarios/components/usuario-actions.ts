"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Cliente admin para crear usuarios
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export interface CreateUsuarioData {
  nombre?: string;
  email?: string;
  avatar_url?: string;
  clienteIds: string[];
  id?: string;
  is_active: boolean;
}

export interface UpdateUsuarioData {
  id: string;
  clienteIds: string[];
  is_active: boolean;
}

export async function createUsuario(data: CreateUsuarioData) {
  try {
    // 1. Crear usuario en auth con Supabase Admin
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        email_confirm: true, // Auto-confirmar email
        password: "terra123",
        user_metadata: {
          full_name: data.nombre,
          avatar_url: data.avatar_url || "",
          user_type: "cliente", // Metadata para identificar tipo de usuario
        },
      });

    if (authError) {
      console.error("Error creating auth user:", authError);
      throw new Error(`Error al crear usuario: ${authError.message}`);
    }

    if (!authUser.user) {
      throw new Error("No se pudo crear el usuario");
    }

    // 2. Crear relaciones con clientes
    const supabase = await createServerClient();

    const relaciones = data.clienteIds.map((clienteId) => ({
      user_id: authUser.user.id, // Usar el mismo ID del usuario de auth
      cliente_id: clienteId,
      is_active: data.is_active,
    }));

    const { error: relationError } = await supabase
      .from("usuarios_clientes")
      .insert(relaciones);

    if (relationError) {
      // Si falla la creación de relaciones, eliminar el usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      console.error("Error creating user relations:", relationError);
      throw new Error(`Error al crear relaciones: ${relationError.message}`);
    }

    revalidatePath("/dashboard/usuarios");
    return { success: true, userId: authUser.user.id };
  } catch (error) {
    console.error("Error in createUsuario:", error);
    throw error;
  }
}

export async function updateUsuario(data: UpdateUsuarioData) {
  try {
    // 1. Actualizar estado del usuario en auth (bloquear/desbloquear)
    if (data.is_active) {
      // Desbloquear usuario
      const { error: unbanError } =
        await supabaseAdmin.auth.admin.updateUserById(data.id, {
          ban_duration: "none",
        });
      if (unbanError) {
        console.error("Error unblocking user:", unbanError);
        throw new Error(`Error al desbloquear usuario: ${unbanError.message}`);
      }
    } else {
      // Bloquear usuario indefinidamente
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
        data.id,
        { ban_duration: "876000h" } // ~100 años
      );
      if (banError) {
        console.error("Error blocking user:", banError);
        throw new Error(`Error al bloquear usuario: ${banError.message}`);
      }
    }

    // 2. Actualizar relaciones con clientes
    const supabase = await createServerClient();

    // Eliminar relaciones existentes
    const { error: deleteError } = await supabase
      .from("usuarios_clientes")
      .delete()
      .eq("user_id", data.id);

    if (deleteError) {
      console.error("Error deleting existing relations:", deleteError);
      throw new Error(`Error al actualizar relaciones: ${deleteError.message}`);
    }

    // Crear nuevas relaciones
    const relaciones = data.clienteIds.map((clienteId) => ({
      user_id: data.id,
      cliente_id: clienteId,
      is_active: data.is_active,
    }));

    const { error: insertError } = await supabase
      .from("usuarios_clientes")
      .insert(relaciones);

    if (insertError) {
      console.error("Error creating new relations:", insertError);
      throw new Error(
        `Error al crear nuevas relaciones: ${insertError.message}`
      );
    }

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error in updateUsuario:", error);
    throw error;
  }
}

export async function deleteUsuario(userId: string) {
  try {
    // 1. Eliminar relaciones
    const supabase = await createServerClient();
    const { error: relationError } = await supabase
      .from("usuarios_clientes")
      .delete()
      .eq("user_id", userId);

    if (relationError) {
      console.error("Error deleting user relations:", relationError);
      throw new Error(`Error al eliminar relaciones: ${relationError.message}`);
    }

    // 2. Eliminar usuario de auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      console.error("Error deleting auth user:", authError);
      throw new Error(`Error al eliminar usuario: ${authError.message}`);
    }

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteUsuario:", error);
    throw error;
  }
}
