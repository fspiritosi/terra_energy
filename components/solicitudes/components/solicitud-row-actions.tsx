"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Solicitud, getClientesActivos, getTiposInspeccion } from "./actions"
import { aprobarSolicitud, rechazarSolicitud } from "./solicitud-actions"
import { SolicitudForm } from "./solicitud-form"
import { SolicitudDetailsDialog } from "./solicitud-details-dialog"
import { SolicitudApproveDialog } from "./solicitud-approve-dialog"
import { SolicitudRejectDialog } from "./solicitud-reject-dialog"
import { Pencil, Eye, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { useUserType } from "@/hooks/use-user-type"

interface SolicitudRowActionsProps {
    solicitud: Solicitud
}

export function SolicitudRowActions({ solicitud }: SolicitudRowActionsProps) {
    const [detailsOpen, setDetailsOpen] = React.useState(false)
    const [editOpen, setEditOpen] = React.useState(false)
    const [approveOpen, setApproveOpen] = React.useState(false)
    const [rejectOpen, setRejectOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [clientes, setClientes] = React.useState<Awaited<ReturnType<typeof getClientesActivos>>>([])
    const [tiposInspeccion, setTiposInspeccion] = React.useState<Awaited<ReturnType<typeof getTiposInspeccion>>>([])

    const { userProfile } = useUserType()
    const isPendiente = solicitud.estado === "pendiente"
    const canEdit = isPendiente && userProfile?.user_type === "cliente"
    const canApproveReject = isPendiente && (userProfile?.user_type === "operacion" || userProfile?.user_type === "inspector" || !userProfile?.user_type)

    // Cargar datos cuando se abre el modal de edición
    React.useEffect(() => {
        if (editOpen) {
            Promise.all([
                getClientesActivos(),
                getTiposInspeccion()
            ]).then(([clientesData, tiposData]) => {
                setClientes(clientesData)
                setTiposInspeccion(tiposData)
            })
        }
    }, [editOpen])

    const handleEdit = async (data: {
        cliente_id: string;
        lugar: string;
        responsable: string;
        equipo: string;
        fecha_entrega_deseada: string;
        requisitos_adicionales?: string;
        items: Array<{ descripcion: string; cantidad: number }>;
        trabajos_ids: string[];
    }) => {
        setIsLoading(true)
        try {
            // TODO: Implementar lógica de actualización con updateSolicitud
            console.log("Datos para actualizar:", data)
            toast.success("Solicitud actualizada exitosamente")
            window.location.reload()
        } catch (error) {
            toast.error("Error al actualizar la solicitud")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async (solicitudId: string, comentarios?: string) => {
        setIsLoading(true)
        try {
            await aprobarSolicitud(solicitudId, comentarios)
            toast.success("Solicitud aprobada exitosamente")
            window.location.reload()
        } catch (error) {
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
            window.location.reload()
        } catch (error) {
            toast.error("Error al rechazar la solicitud")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                    </DropdownMenuItem>

                    {canEdit && (
                        <>
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                        </>
                    )}

                    {canApproveReject && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => setApproveOpen(true)}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Aprobar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setRejectOpen(true)}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Rechazar
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Diálogo de detalles */}
            <SolicitudDetailsDialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                solicitud={solicitud}
            />

            {/* Diálogo de edición */}
            <SolicitudForm
                open={editOpen}
                onOpenChange={setEditOpen}
                solicitud={solicitud}
                clientes={clientes}
                trabajos={tiposInspeccion}
                onSubmit={handleEdit}
                isLoading={isLoading}
            />

            {/* Diálogo de aprobación */}
            <SolicitudApproveDialog
                open={approveOpen}
                onOpenChange={setApproveOpen}
                solicitud={solicitud}
                onApprove={handleApprove}
                isLoading={isLoading}
            />

            {/* Diálogo de rechazo */}
            <SolicitudRejectDialog
                open={rejectOpen}
                onOpenChange={setRejectOpen}
                solicitud={solicitud}
                onReject={handleReject}
                isLoading={isLoading}
            />
        </>
    )
}