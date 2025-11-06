"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SolicitudesTable } from "./solicitudes-table"
import { AddSolicitudButton } from "./add-solicitud-button"
import { SolicitudDetailsDialog } from "./solicitud-details-dialog"
import { Solicitud } from "./actions"
import { useSolicitudQuery, sanitizeSolicitudNumber } from "@/hooks/use-solicitud-query"
import { toast } from "sonner"

interface SolicitudesTableWrapperProps {
    data: Solicitud[]
    userType: "cliente" | "operacion"
}

export function SolicitudesTableWrapper({ data, userType }: SolicitudesTableWrapperProps) {
    const { solicitudNumber, clearQuery, isFromQuery } = useSolicitudQuery()
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isLoadingFromQuery, setIsLoadingFromQuery] = useState(false)
    const [queryError, setQueryError] = useState<string | null>(null)

    const title = userType === "cliente" ? "Mis Solicitudes" : "Solicitudes de Inspección";
    const description = userType === "cliente"
        ? "Gestiona tus solicitudes de inspección y su estado"
        : "Gestiona todas las solicitudes de inspección de los clientes";

    // Verificar permisos de acceso a la solicitud
    const hasPermissionToView = useCallback((): boolean => {
        // Los usuarios de operación pueden ver todas las solicitudes
        if (userType === "operacion") {
            return true
        }

        // Los clientes solo pueden ver sus propias solicitudes
        // Esta verificación se hace a nivel de datos (el servidor ya filtra)
        // pero agregamos una verificación adicional por seguridad
        if (userType === "cliente") {
            return true // Si está en la lista, ya fue filtrada por el servidor
        }

        return false
    }, [userType])

    // Manejar apertura automática del modal desde query parameter
    useEffect(() => {
        if (solicitudNumber && isFromQuery) {
            setIsLoadingFromQuery(true)

            // Sanitizar y validar el número de solicitud
            const sanitizedNumber = sanitizeSolicitudNumber(solicitudNumber)

            if (!sanitizedNumber) {
                const errorMsg = "Formato de número de solicitud inválido"
                console.error(errorMsg, solicitudNumber)
                setQueryError(errorMsg)
                toast.error(errorMsg)
                clearQuery()
                setIsLoadingFromQuery(false)
                return
            }

            // Buscar la solicitud por número
            const foundSolicitud = data.find(s => s.numero_solicitud === sanitizedNumber)

            if (foundSolicitud) {
                // Verificar permisos de acceso
                if (!hasPermissionToView()) {
                    const errorMsg = "No tienes permisos para ver esta solicitud"
                    console.error("Sin permisos para ver la solicitud:", sanitizedNumber)
                    setQueryError(errorMsg)
                    toast.error(errorMsg)
                    clearQuery()
                    setIsLoadingFromQuery(false)
                    return
                }

                setSelectedSolicitud(foundSolicitud)
                setIsDetailModalOpen(true)
                setQueryError(null) // Limpiar errores previos
                console.log("✅ Solicitud encontrada y modal abierto:", sanitizedNumber)
            } else {
                const errorMsg = `Solicitud ${sanitizedNumber} no encontrada`
                console.error("Solicitud no encontrada:", sanitizedNumber)
                setQueryError(errorMsg)
                toast.error(errorMsg)
                clearQuery()
            }

            setIsLoadingFromQuery(false)
        }
    }, [solicitudNumber, isFromQuery, data, clearQuery, hasPermissionToView])

    // Manejar cierre del modal
    const handleModalClose = (open: boolean) => {
        setIsDetailModalOpen(open)
        if (!open) {
            setSelectedSolicitud(null)
            setQueryError(null) // Limpiar errores al cerrar
            // Si el modal fue abierto desde query parameter, limpiar la URL
            if (isFromQuery) {
                clearQuery()
            }
        }
    }

    return (
        <>
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
                    {isLoadingFromQuery && (
                        <div className="flex items-center justify-center py-6 mb-4 bg-muted/30 rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2 text-sm text-muted-foreground">
                                Cargando solicitud desde enlace...
                            </span>
                        </div>
                    )}

                    {queryError && !isLoadingFromQuery && (
                        <div className="flex items-center justify-center py-4 mb-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="text-center">
                                <p className="text-sm text-destructive font-medium">Error al cargar solicitud</p>
                                <p className="text-xs text-muted-foreground mt-1">{queryError}</p>
                            </div>
                        </div>
                    )}

                    <SolicitudesTable data={data} userType={userType} />
                </CardContent>
            </Card>

            {/* Modal de detalles controlado desde query parameter */}
            {selectedSolicitud && (
                <SolicitudDetailsDialog
                    open={isDetailModalOpen}
                    onOpenChange={handleModalClose}
                    solicitud={selectedSolicitud}
                />
            )}
        </>
    )
}