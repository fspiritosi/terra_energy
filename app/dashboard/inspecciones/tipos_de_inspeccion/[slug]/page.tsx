import { redirect, notFound } from "next/navigation";
import { getChecklistCompleto } from "@/components/inspecciones/components/checklist-actions";
import { getTipoDeInspeccionBySlug } from "@/components/tipos_de_inspeccion/actions";
import { TipoInspeccionDetailsPage } from "@/components/tipos_de_inspeccion/tipo-inspeccion-details-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TipoInspeccionDetailsPageRoute({ params }: PageProps) {
  try {
    const { slug } = await params;
    
    // Decodificar el slug por si viene codificado
    const decodedSlug = decodeURIComponent(slug);

    // Obtener el tipo de inspección por slug
    const tipoInspeccion = await getTipoDeInspeccionBySlug(decodedSlug);

    if (!tipoInspeccion) {
      console.error("Tipo de inspección no encontrado para slug:", decodedSlug);
      notFound();
    }

    // Obtener el checklist completo
    const checklist = await getChecklistCompleto(tipoInspeccion.id);

    return (
      <TipoInspeccionDetailsPage
        tipoInspeccion={tipoInspeccion}
        checklist={checklist}
      />
    );
  } catch (error) {
    console.error("Error en TipoInspeccionDetailsPageRoute:", error);
    notFound();
  }
}

