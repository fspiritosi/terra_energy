"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddSolicitudButton } from "@/components/solicitudes/components/add-solicitud-button";

export function CrearSolicitudWidget() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Nueva Solicitud de Inspección</CardTitle>
                <CardDescription>
                    Crea una nueva solicitud para programar una inspección
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AddSolicitudButton />
            </CardContent>
        </Card>
    );
}