import { redirect } from "next/navigation";
import { getInspecciones } from "@/components/inspecciones/components/actions";
import { getSolicitudDeInspeccion, getTiposInspeccionDeSolicitud } from "@/components/inspecciones/components/checklist-actions";
import { CompletarChecklistClient } from "@/components/inspecciones/components/completar-checklist-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompletarChecklistPage({ params }: PageProps) {
  try {
    const { id } = await params;

    // Verificar que la inspección existe
    const inspecciones = await getInspecciones();
    const inspeccion = inspecciones.find((i) => i.id === id);

    if (!inspeccion) {
      console.error("Inspección no encontrada:", id);
      redirect("/dashboard/inspecciones");
    }

    // Solo permitir completar si está en progreso
    if (inspeccion.estado !== "en_progreso") {
      console.error("Inspección no está en progreso. Estado actual:", inspeccion.estado);
      redirect("/dashboard/inspecciones");
    }

    // Obtener los tipos de inspección de la solicitud
    let solicitudId: string;
    try {
      solicitudId = await getSolicitudDeInspeccion(id);
    } catch (error) {
      console.error("Error obteniendo solicitud de inspección:", error);
      redirect("/dashboard/inspecciones");
    }

    let tiposInspeccion;
    try {
      tiposInspeccion = await getTiposInspeccionDeSolicitud(solicitudId);
    } catch (error) {
      console.error("Error obteniendo tipos de inspección:", error);
      redirect("/dashboard/inspecciones");
    }

    // Si no hay tipos de inspección, mostrar mensaje pero permitir acceso
    if (!tiposInspeccion || tiposInspeccion.length === 0) {
      console.warn("No se encontraron tipos de inspección para la solicitud:", solicitudId);
      // No redirigir, permitir que el componente muestre un mensaje
    }

    return (
      <CompletarChecklistClient
        inspeccionId={id}
        inspeccion={inspeccion}
        tiposInspeccion={tiposInspeccion}
      />
    );
  } catch (error) {
    console.error("Error en CompletarChecklistPage:", error);
    redirect("/dashboard/inspecciones");
  }
}

