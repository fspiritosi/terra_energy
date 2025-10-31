"use server";

import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
}

export interface SolicitudReciente {
  id: string;
  numero_solicitud: string;
  lugar: string;
  responsable: string;
  estado: string;
  fecha_solicitud: string;
  cliente: {
    nombre: string;
  } | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Obtener estadísticas de solicitudes
  const { data: solicitudes, error } = await supabase
    .from("solicitudes_inspeccion")
    .select("estado");

  if (error) {
    console.error("Error fetching dashboard stats:", error);
    return { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 };
  }

  const stats = solicitudes?.reduce(
    (acc, solicitud) => {
      acc.total++;
      switch (solicitud.estado) {
        case "pendiente":
          acc.pendientes++;
          break;
        case "aprobada":
          acc.aprobadas++;
          break;
        case "rechazada":
          acc.rechazadas++;
          break;
      }
      return acc;
    },
    { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 }
  ) || { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 };

  return stats;
}

export async function getSolicitudesRecientes(
  limit: number = 5
): Promise<SolicitudReciente[]> {
  const supabase = await createClient();

  const { data: solicitudes, error } = await supabase
    .from("solicitudes_inspeccion")
    .select(
      `
      id,
      numero_solicitud,
      lugar,
      responsable,
      estado,
      fecha_solicitud,
      cliente:clientes(nombre)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent solicitudes:", error);
    return [];
  }

  return solicitudes || [];
}
