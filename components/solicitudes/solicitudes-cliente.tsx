"use client";

import { useEffect, useState } from "react";
import { getSolicitudes, SolicitudesTableWrapper, Solicitud } from "./components";
import { Skeleton } from "@/components/ui/skeleton";

export function SolicitudesCliente() {
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSolicitudes() {
            try {
                const data = await getSolicitudes();
                setSolicitudes(data);
            } catch (error) {
                console.error("Error loading solicitudes:", error);
            } finally {
                setLoading(false);
            }
        }

        loadSolicitudes();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <SolicitudesTableWrapper
            data={solicitudes}
            userType="cliente"
        />
    );
}