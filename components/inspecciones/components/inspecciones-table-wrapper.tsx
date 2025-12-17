"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getInspeccionesType, reprogramarInspeccion, updateInspeccion } from "./actions"
import { toast } from "sonner"
import { InspeccionesTable } from "./inspecciones-table"
import { ReprogramarDialog } from "./reprogramar-dialog"
import { Database } from "@/database.types"

interface DocumentoInfo {
    id: string;
    numero_documento: string;
    resultado: string;
    inspeccion_id: string;
}

interface InspeccionesTableWrapperProps {
    data: getInspeccionesType
    documentos?: DocumentoInfo[]
}

export function InspeccionesTableWrapper({ data, documentos }: InspeccionesTableWrapperProps) {
    const [selectedInspeccion, setSelectedInspeccion] = useState<getInspeccionesType[number] | null>(null)
    const [isReprogramarOpen, setIsReprogramarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Crear un Map de documentos por inspeccion_id para búsqueda rápida
    const documentosMap = new Map(
        (documentos || []).map(doc => [doc.inspeccion_id, {
            id: doc.id,
            numero_documento: doc.numero_documento,
            resultado: doc.resultado
        }])
    )

    const handleReprogramar = (inspeccion: getInspeccionesType[number]) => {
        setSelectedInspeccion(inspeccion)
        setIsReprogramarOpen(true)
    }

    const handleReprogramarSubmit = async (nuevaFecha: string) => {
        if (!selectedInspeccion) return

        setIsLoading(true)
        try {
            await reprogramarInspeccion(selectedInspeccion.id, nuevaFecha)
            toast.success("Inspección reprogramada exitosamente")
            setIsReprogramarOpen(false)
            setSelectedInspeccion(null)
        } catch (error) {
            console.error("Error reprogramming inspeccion:", error)
            toast.error("Error al reprogramar la inspección")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEstadoChange = async (inspeccionId: string, nuevoEstado: Database['public']['Enums']['estado_inspeccion']) => {
        try {
            await updateInspeccion({
                id: inspeccionId,
                estado: nuevoEstado
            })
            toast.success("Estado actualizado exitosamente")
        } catch (error) {
            console.error("Error updating estado:", error)
            toast.error("Error al actualizar el estado")
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Listado de Inspecciones</CardTitle>
                            <CardDescription>
                                Gestiona las inspecciones programadas y su estado
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <InspeccionesTable
                        data={data}
                        documentos={documentosMap}
                        onReprogramar={handleReprogramar}
                        onEstadoChange={handleEstadoChange}
                    />
                </CardContent>
            </Card>

            <ReprogramarDialog
                open={isReprogramarOpen}
                onOpenChange={setIsReprogramarOpen}
                inspeccion={selectedInspeccion}
                onSubmit={handleReprogramarSubmit}
                isLoading={isLoading}
            />
        </>
    )
}