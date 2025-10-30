"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SolicitudesTable } from "./solicitudes-table"
import { AddSolicitudButton } from "./add-solicitud-button"
import { Solicitud } from "./actions"

interface SolicitudesTableWrapperProps {
    data: Solicitud[]
    userType: "cliente" | "operacion"
}

export function SolicitudesTableWrapper({ data, userType }: SolicitudesTableWrapperProps) {
    const title = userType === "cliente" ? "Mis Solicitudes" : "Solicitudes de Inspección";
    const description = userType === "cliente"
        ? "Gestiona tus solicitudes de inspección y su estado"
        : "Gestiona todas las solicitudes de inspección de los clientes";

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </div>
                    {userType === "cliente" && <AddSolicitudButton />}
                </div>
            </CardHeader>
            <CardContent>
                <SolicitudesTable data={data} userType={userType} />
            </CardContent>
        </Card>
    )
}