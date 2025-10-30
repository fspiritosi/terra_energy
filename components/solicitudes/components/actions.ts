"use server";

import { createClient } from "@/lib/supabase/server";

// Tipos inferidos de las consultas
type SolicitudCompleta = {
  id: string;
  numero_solicitud: string;
  cliente_id: string;
  user_id: string | null;
  lugar: string;
  responsable: string;
  equipo: string;
  fecha_solicitud: string;
  fecha_entrega_deseada: string;
  requisitos_adicionales: string | null;
  estado: string;
  aprobada_por: string | null;
  fecha_aprobacion: string | null;
  comentarios_aprobacion: string | null;
  created_at: string;
  updated_at: string | null;
  cliente: {
    id: string;
    nombre: string;
  } | null;
  items: Array<{
    id: string;
    descripcion: string;
    cantidad: number;
    orden: number;
    inspections?: Array<{
      id: string;
      observaciones: string | null;
      inspection_type: {
        id: string;
        codigo: string;
        nombre: string;
        descripcion: string | null;
      } | null;
    }>;
  }>;
  trabajos: Array<{
    id: string;
    tipo_inspeccion: {
      id: string;
      nombre: string;
      codigo: string;
    } | null;
  }>;
  aprobador: {
    id: string | null;
    nombre: string | null;
  } | null;
};

export async function getSolicitudes(): Promise<SolicitudCompleta[]> {
  const supabase = await createClient();

  // Obtener solicitudes con todas las relaciones
  const { data: solicitudes, error } = await supabase
    .from("solicitudes_inspeccion")
    .select(
      `
      *,
      cliente:clientes (
        id,
        nombre
      ),
      items:solicitud_items (
        id,
        descripcion,
        cantidad,
        orden,
        inspections:solicitud_item_inspections (
          id,
          observaciones,
          inspection_type:item_inspection_types (
            id,
            codigo,
            nombre,
            descripcion
          )
        )
      ),
      trabajos:solicitud_trabajos (
        id,
        tipo_inspeccion:tipo_de_inspeccion (
          id,
          nombre,
          codigo
        )
      ),
      aprobador:usuarios_auth!solicitudes_inspeccion_aprobada_por_fkey (
        id,
        nombre
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching solicitudes:", error);
    throw new Error("Failed to fetch solicitudes");
  }

  if (!solicitudes) return [];

  // Procesar y ordenar los datos
  const solicitudesProcesadas: SolicitudCompleta[] = solicitudes.map(
    (solicitud) => ({
      ...solicitud,
      items: (solicitud.items || []).sort((a, b) => a.orden - b.orden),
      trabajos: solicitud.trabajos || [],
      aprobador: solicitud.aprobador || null,
    })
  );

  return solicitudesProcesadas;
}

export async function getTiposInspeccion() {
  const supabase = await createClient();

  const { data: tipos, error } = await supabase
    .from("tipo_de_inspeccion")
    .select("id, nombre, codigo, descripcion")
    .eq("is_active", true)
    .order("nombre");

  if (error) {
    console.error("Error fetching tipos de inspección:", error);
    throw new Error("Failed to fetch tipos de inspección");
  }

  return tipos || [];
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

export async function getItemInspectionTypes() {
  const supabase = await createClient();

  const { data: types, error } = await supabase
    .from("item_inspection_types")
    .select("id, codigo, nombre, descripcion, orden")
    .eq("is_active", true)
    .order("orden");

  if (error) {
    console.error("Error fetching item inspection types:", error);
    throw new Error("Failed to fetch item inspection types");
  }

  return types || [];
}

export async function getClienteIdFromUser(): Promise<string | null> {
  const supabase = await createClient();

  // Obtener el usuario actual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user:", userError);
    return null;
  }

  // Buscar la relación usuario-cliente
  const { data: usuarioCliente, error } = await supabase
    .from("usuarios_clientes")
    .select("cliente_id, clientes(id, nombre)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching cliente for user:", error);
    return null;
  }

  return usuarioCliente?.cliente_id || null;
}

export async function getClienteInfoFromUser(): Promise<{
  id: string;
  nombre: string;
} | null> {
  const supabase = await createClient();

  // Obtener el usuario actual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user:", userError);
    return null;
  }

  // Buscar la relación usuario-cliente con información completa
  const { data: usuarioCliente, error } = await supabase
    .from("usuarios_clientes")
    .select(
      `
      cliente_id,
      clientes!inner(
        id,
        nombre
      )
    `
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching cliente info for user:", error);
    return null;
  }

  if (!usuarioCliente?.clientes) {
    return null;
  }

  return {
    id: usuarioCliente.clientes.id,
    nombre: usuarioCliente.clientes.nombre,
  };
}

// Exportar tipos
export type Solicitud = SolicitudCompleta;
export type TipoInspeccion = Awaited<ReturnType<typeof getTiposInspeccion>>[0];
export type ClienteOption = Awaited<ReturnType<typeof getClientesActivos>>[0];
export interface ItemInspectionType {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
}
