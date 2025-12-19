"use server";

import { createClient } from "@/lib/supabase/server";
import moment from "moment";

// Tipos inferidos de las consultas
type UsuarioRelacion = {
  user_id: string | null;
  created_at: string;
  is_active: boolean;
  cliente_id: string;
  clientes: {
    id: string;
    nombre: string;
  } | null;
};

type UsuarioAuth = {
  avatar_url: string | null;
  created_at: string | null;
  email: string | null;
  email_confirmed: boolean | null;
  id: string | null;
  nombre: string | null;
  updated_at: string | null;
  user_type: string | null;
};

// Tipo del usuario final procesado
type UsuarioProcesado = {
  id: string;
  nombre: string;
  email: string;
  avatar_url: string;
  created_at: string;
  is_active: boolean;
  clientes: Array<{
    id: string;
    nombre: string;
  }>;
};

export async function getUsuarios(): Promise<UsuarioProcesado[]> {
  const supabase = await createClient();

  // Obtener usuarios con sus relaciones usando la vista
  const { data: usuariosData, error } = await supabase.from("usuarios_clientes")
    .select(`
      user_id,
      created_at,
      is_active,
      cliente_id,
      clientes (
        id,
        nombre
      )
    `);

  if (error) {
    console.error("Error fetching usuarios:", error);
    throw new Error("Failed to fetch usuarios");
  }

  if (!usuariosData) return [];

  // Obtener datos de usuarios únicos desde la vista
  const userIds = [
    ...new Set(usuariosData.map((rel) => rel.user_id).filter(Boolean)),
  ] as string[];

  const { data: usuariosAuth, error: authError } = await supabase
    .from("usuarios_auth")
    .select("*")
    .in("id", userIds);

  if (authError) {
    console.error("Error fetching usuarios auth:", authError);
    throw new Error("Failed to fetch usuarios auth");
  }

  // Crear mapa de usuarios para fácil acceso con tipos explícitos
  const usuariosAuthMap = new Map<string, UsuarioAuth>();
  usuariosAuth?.forEach((user) => {
    if (user.id) {
      usuariosAuthMap.set(user.id, user);
    }
  });

  // Agrupar por usuario con tipos explícitos
  const usuariosMap = new Map<string, UsuarioProcesado>();

  usuariosData.forEach((rel: UsuarioRelacion) => {
    if (!rel.user_id) return;

    const userId = rel.user_id;
    const userAuth = usuariosAuthMap.get(userId);

    if (!usuariosMap.has(userId)) {
      usuariosMap.set(userId, {
        id: userId,
        nombre: userAuth?.nombre || "Usuario",
        email: userAuth?.email || "",
        avatar_url: userAuth?.avatar_url || "",
        created_at: rel.created_at,
        is_active: rel.is_active,
        clientes: [],
      });
    }

    if (rel.clientes) {
      usuariosMap.get(userId)!.clientes.push(rel.clientes);
    }
  });

  // Convertir Map a Array y ordenar con tipos explícitos
  const usuariosArray: UsuarioProcesado[] = Array.from(
    usuariosMap.values()
  ).sort((a, b) => {
    // Activos primero, luego por fecha de creación
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;
    return moment(b.created_at).valueOf() - moment(a.created_at).valueOf();
  });

  return usuariosArray;
}

export async function getClientesActivos() {
  const supabase = await createClient();

  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nombre")
    .eq("is_active", true)
    .order("nombre");

  if (error) {
    console.error("Error fetching clientes activos:", error);
    throw new Error("Failed to fetch clientes activos");
  }

  return clientes || [];
}

// Exportamos los tipos inferidos
export type Usuario = UsuarioProcesado;
export type ClienteOption = Awaited<ReturnType<typeof getClientesActivos>>[0];
