"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SolicitudForm } from "./solicitud-form"
import { createSolicitud, CreateSolicitudData } from "./solicitud-actions"
import { getClientesActivos, getTiposInspeccion } from "./actions"
import { toast } from "sonner"

export function AddSolicitudButton() {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [clientes, setClientes] = React.useState<Awaited<ReturnType<typeof getClientesActivos>>>([])
    const [trabajos, setTrabajos] = React.useState<Awaited<ReturnType<typeof getTiposInspeccion>>>([])

    // Cargar datos necesarios cuando se abre el modal
    React.useEffect(() => {
        if (open) {
            const loadData = async () => {
                try {
                    const [clientesData, trabajosData] = await Promise.all([
                        getClientesActivos(),
                        getTiposInspeccion()
                    ])
                    setClientes(clientesData)
                    setTrabajos(trabajosData)
                } catch (error) {
                    console.error("Error loading data:", error)
                    toast.error("Error al cargar los datos")
                }
            }
            loadData()
        }
    }, [open])

    const handleSubmit = async (data: CreateSolicitudData) => {
        setIsLoading(true)
        try {
            await createSolicitud(data)
            toast.success("Solicitud creada exitosamente")
            setOpen(false)
        } catch (error) {
            console.error("Error creating solicitud:", error)
            toast.error("Error al crear la solicitud")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Solicitud
            </Button>
            <SolicitudForm
                open={open}
                onOpenChange={setOpen}
                clientes={clientes}
                trabajos={trabajos}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </>
    )
}