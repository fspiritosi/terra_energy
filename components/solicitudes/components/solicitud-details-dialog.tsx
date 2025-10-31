"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle } from "lucide-react"
import { Solicitud } from "./actions"
import { SolicitudApproveDialog } from "./solicitud-approve-dialog"
import { SolicitudRejectDialog } from "./solicitud-reject-dialog"
import { aprobarSolicitud, rechazarSolicitud } from "./solicitud-actions"
import { useUserType } from "@/hooks/use-user-type"
import { toast } from "sonner"
import moment from "moment"
import "moment/locale/es"

interface SolicitudDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    solicitud: Solicitud | null
}

const estadoColors = {
    pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
    aprobada: "bg-green-100 text-green-800 border-green-300",
    rechazada: "bg-red-100 text-red-800 border-red-300",
    en_proceso: "bg-blue-100 text-blue-800 border-blue-300",
    completada: "bg-gray-100 text-gray-800 border-gray-300",
}

const estadoLabels = {
    pendiente: "Pendiente",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
    en_proceso: "En Proceso",
    completada: "Completada",
}

export function SolicitudDetailsDialog({
    open,
    onOpenChange,
    solicitud,
}: SolicitudDetailsDialogProps) {
    const [showApproveDialog, setShowApproveDialog] = React.useState(false)
    const [showRejectDialog, setShowRejectDialog] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const { userProfile } = useUserType()

    if (!solicitud) return null

    // Solo usuarios que NO son clientes pueden aprobar/rechazar
    const canApproveReject = userProfile?.user_type !== "cliente"

    const handleApprove = async (solicitudId: string, comentarios?: string) => {
        setIsLoading(true)
        try {
            await aprobarSolicitud(solicitudId, comentarios)
            toast.success("Solicitud aprobada exitosamente")
            setShowApproveDialog(false)
            // Opcional: cerrar el modal de detalles también
            // onOpenChange(false)
        } catch (error) {
            console.error("Error approving solicitud:", error)
            toast.error("Error al aprobar la solicitud")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleReject = async (solicitudId: string, comentarios: string) => {
        setIsLoading(true)
        try {
            await rechazarSolicitud(solicitudId, comentarios)
            toast.success("Solicitud rechazada")
            setShowRejectDialog(false)
            // Opcional: cerrar el modal de detalles también
            // onOpenChange(false)
        } catch (error) {
            console.error("Error rejecting solicitud:", error)
            toast.error("Error al rechazar la solicitud")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        moment.locale('es')
        return moment(dateString).format("DD [de] MMMM [de] YYYY")
    }

    const formatDateTime = (dateString: string) => {
        moment.locale('es')
        return moment(dateString).format("DD/MM/YYYY [a las] HH:mm")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Detalles de Solicitud - {solicitud.numero_solicitud}
                        <Badge
                            variant="outline"
                            className={estadoColors[solicitud.estado as keyof typeof estadoColors]}
                        >
                            {estadoLabels[solicitud.estado as keyof typeof estadoLabels]}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Información completa de la solicitud de inspección
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="space-y-6">
                        {/* Información General */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Información General</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                                        <p className="text-sm">{solicitud.cliente?.nombre}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Lugar</label>
                                        <p className="text-sm">{solicitud.lugar}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Responsable</label>
                                        <p className="text-sm">{solicitud.responsable}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Equipo</label>
                                        <p className="text-sm">{solicitud.equipo}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Fecha de Entrega Deseada</label>
                                        <p className="text-sm">{formatDate(solicitud.fecha_entrega_deseada)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                                        <p className="text-sm">{formatDateTime(solicitud.created_at)}</p>
                                    </div>
                                </div>

                                {solicitud.requisitos_adicionales && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Requisitos Adicionales</label>
                                        <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                                            {solicitud.requisitos_adicionales}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Items a Inspeccionar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {solicitud.items?.map((item, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.descripcion}</p>
                                                    <Badge variant="secondary" className="mt-1">
                                                        Cantidad: {item.cantidad}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Inspecciones del item */}
                                            {item.inspections && item.inspections.length > 0 && (
                                                <div>
                                                    <label className="text-xs font-medium text-muted-foreground">
                                                        Tipos de Inspección:
                                                    </label>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.inspections.map((inspection) => (
                                                            <Badge
                                                                key={inspection.id}
                                                                variant="outline"
                                                                className="text-xs"
                                                                title={`${inspection.inspection_type?.nombre}: ${inspection.inspection_type?.descripcion}`}
                                                            >
                                                                {inspection.inspection_type?.codigo}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Leyenda de inspecciones seleccionadas */}
                                {solicitud.items?.some(item => item.inspections && item.inspections.length > 0) && (
                                    <div className="mt-4 p-3 bg-muted/30 rounded-md">
                                        <h4 className="text-xs font-medium text-muted-foreground mb-2">Leyenda de Inspecciones:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                                            {/* Obtener tipos únicos de inspección seleccionados */}
                                            {Array.from(
                                                new Set(
                                                    solicitud.items
                                                        ?.flatMap(item => item.inspections || [])
                                                        .map(insp => insp.inspection_type?.codigo)
                                                        .filter(Boolean)
                                                )
                                            ).sort().map(codigo => {
                                                // Encontrar la primera inspección con este código para obtener los detalles
                                                const inspeccion = solicitud.items
                                                    ?.flatMap(item => item.inspections || [])
                                                    .find(insp => insp.inspection_type?.codigo === codigo)

                                                return inspeccion?.inspection_type ? (
                                                    <div key={codigo} className="flex items-center gap-1">
                                                        <Badge variant="outline" className="text-xs px-1 py-0">
                                                            {inspeccion.inspection_type.codigo}
                                                        </Badge>
                                                        <span>{inspeccion.inspection_type.descripcion || inspeccion.inspection_type.nombre}</span>
                                                    </div>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Trabajos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Trabajos a Realizar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {solicitud.trabajos?.map((trabajo, index) => (
                                        <div key={index} className="p-3 bg-muted rounded-md">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm">{trabajo.tipo_inspeccion?.nombre}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Código: {trabajo.tipo_inspeccion?.codigo}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estado y Aprobación */}
                        {(solicitud.estado === "aprobada" || solicitud.estado === "rechazada") && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {solicitud.estado === "aprobada" ? "Información de Aprobación" : "Información de Rechazo"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {solicitud.fecha_aprobacion && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Fecha de {solicitud.estado === "aprobada" ? "Aprobación" : "Rechazo"}
                                            </label>
                                            <p className="text-sm">{formatDateTime(solicitud.fecha_aprobacion)}</p>
                                        </div>
                                    )}
                                    {solicitud.comentarios_aprobacion && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Comentarios</label>
                                            <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                                                {solicitud.comentarios_aprobacion}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer con botones de acción - Solo mostrar si está pendiente y el usuario puede aprobar/rechazar */}
                {solicitud.estado === "pendiente" && canApproveReject && (
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setShowRejectDialog(true)}
                            disabled={isLoading}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Rechazar
                        </Button>
                        <Button
                            onClick={() => setShowApproveDialog(true)}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprobar
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>

            {/* Diálogos de aprobación y rechazo */}
            <SolicitudApproveDialog
                open={showApproveDialog}
                onOpenChange={setShowApproveDialog}
                solicitud={solicitud}
                onApprove={handleApprove}
                isLoading={isLoading}
            />

            <SolicitudRejectDialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
                solicitud={solicitud}
                onReject={handleReject}
                isLoading={isLoading}
            />
        </Dialog>
    )
}