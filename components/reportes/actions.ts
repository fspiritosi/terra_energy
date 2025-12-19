"use server";

import { createClient } from "@/lib/supabase/server";

export type VerificacionCompleta = {
  id: string;
  numero_documento: string;
  revision: string | null;
  fecha_documento: string;
  fecha_vencimiento: string | null;
  resultado: string;
  observaciones_generales: string | null;
  created_at: string | null;
  inspeccion: {
    id: string;
    numero_inspeccion: string;
    cliente_nombre: string | null;
    lugar: string | null;
    equipo: string | null;
    fecha_completada: string | null;
  } | null;
};

export async function getVerificaciones(): Promise<VerificacionCompleta[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documentos_inspeccion")
    .select(`
      *,
      inspeccion:inspecciones (
        id,
        numero_inspeccion,
        cliente_nombre,
        lugar,
        equipo,
        fecha_completada
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching verificaciones:", error);
    throw new Error("Error al obtener las verificaciones");
  }

  return (data || []) as VerificacionCompleta[];
}


