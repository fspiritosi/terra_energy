import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Tipo de Inspección no encontrado</h2>
      <p className="text-muted-foreground mb-6">
        El tipo de inspección que buscas no existe o ha sido eliminado.
      </p>
      <Button asChild>
        <Link href="/dashboard/inspecciones/tipos_de_inspeccion">
          Volver a Tipos de Inspección
        </Link>
      </Button>
    </div>
  );
}



