"use server";

import { createClient } from "@/lib/supabase/server";
import moment from "moment";

export interface DashboardOperacionStats {
  solicitudesPendientes: number;
  solicitudesAprobadas: number;
  solicitudesRechazadas: number;
  totalClientes: number;
}

export interface SolicitudSinAsignar {
  id: string;
  numero_solicitud: string;
  lugar: string;
  responsable: string;
  estado: string;
  fecha_solicitud: string;
  cliente: {
    nombre: string;
  } | null;
  urgente: boolean;
}

export async function getDashboardOperacionStats(): Promise<DashboardOperacionStats> {
  const supabase = await createClient();

  // Obtener estadísticas de solicitudes
  const { data: solicitudes, error: solicitudesError } = await supabase
    .from("solicitudes_inspeccion")
    .select("estado");

  // Obtener total de clientes
  const { count: totalClientes, error: clientesError } = await supabase
    .from("clientes")
    .select("*", { count: "exact", head: true });

  if (solicitudesError || clientesError) {
    console.error(
      "Error fetching operacion stats:",
      solicitudesError || clientesError
    );
    return {
      solicitudesPendientes: 0,
      solicitudesAprobadas: 0,
      solicitudesRechazadas: 0,
      totalClientes: 0,
    };
  }

  const stats = solicitudes?.reduce(
    (acc, solicitud) => {
      switch (solicitud.estado) {
        case "pendiente":
          acc.solicitudesPendientes++;
          break;
        case "aprobada":
          acc.solicitudesAprobadas++;
          break;
        case "rechazada":
          acc.solicitudesRechazadas++;
          break;
      }
      return acc;
    },
    {
      solicitudesPendientes: 0,
      solicitudesAprobadas: 0,
      solicitudesRechazadas: 0,
      totalClientes: totalClientes || 0,
    }
  ) || {
    solicitudesPendientes: 0,
    solicitudesAprobadas: 0,
    solicitudesRechazadas: 0,
    totalClientes: totalClientes || 0,
  };

  return stats;
}

export async function getSolicitudesSinAsignar(
  limit: number = 5
): Promise<SolicitudSinAsignar[]> {
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
    .eq("estado", "pendiente")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching solicitudes sin asignar:", error);
    return [];
  }

  // Marcar como urgentes las solicitudes de más de 3 días
  const solicitudesConUrgencia =
    solicitudes?.map((solicitud) => ({
      ...solicitud,
      urgente:
        moment().diff(moment(solicitud.fecha_solicitud), 'days') > 3,
    })) || [];

  return solicitudesConUrgencia;
}

export async function getSolicitudesRecientesOperacion(
  limit: number = 5
): Promise<SolicitudSinAsignar[]> {
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
    console.error("Error fetching recent solicitudes operacion:", error);
    return [];
  }

  const solicitudesConUrgencia =
    solicitudes?.map((solicitud) => ({
      ...solicitud,
      urgente:
        solicitud.estado === "pendiente" &&
        moment().diff(moment(solicitud.fecha_solicitud), 'days') > 3,
    })) || [];

  return solicitudesConUrgencia;
}
