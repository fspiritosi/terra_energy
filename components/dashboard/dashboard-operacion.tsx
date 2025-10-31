import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCardsOperacion } from "./stats-cards-operacion";
import { SolicitudesSinAsignar } from "./solicitudes-sin-asignar";
import { ActividadRecienteOperacion } from "./actividad-reciente-operacion";
import { AccionesRapidasOperacion } from "./acciones-rapidas-operacion";

export function DashboardOperacion() {
    return (
        <>
            {/* Estadísticas */}
            <Suspense fallback={
                <div className="grid gap-4 md:grid-cols-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            }>
                <StatsCardsOperacion />
            </Suspense>

            {/* Widgets principales */}
            <div className="grid gap-4 md:grid-cols-2">
                <Suspense fallback={
                    <Skeleton className="h-96" />
                }>
                    <SolicitudesSinAsignar />
                </Suspense>

                <Suspense fallback={
                    <Skeleton className="h-96" />
                }>
                    <ActividadRecienteOperacion />
                </Suspense>
            </div>

            {/* Acciones rápidas */}
            <AccionesRapidasOperacion />
        </>
    );
}
