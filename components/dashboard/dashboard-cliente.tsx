import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "./stats-cards";
import { CrearSolicitudWidget } from "./crear-solicitud-widget";
import { SolicitudesRecientes } from "./solicitudes-recientes";

export function DashboardCliente() {
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
                <StatsCards />
            </Suspense>

            {/* Widget para crear solicitud */}
            <CrearSolicitudWidget />

            {/* Solicitudes recientes */}
            <Suspense fallback={
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-64" />
                </div>
            }>
                <SolicitudesRecientes />
            </Suspense>
        </>
    );
}