"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EquiposTable } from "./equipos-table"
import { AddEquipoButton } from "./add-equipo-button"
import { EquipoForm } from "./equipo-form"
import { Equipo, updateEquipo, deleteEquipo, createEquipo, CreateEquipoData, UpdateEquipoData } from "./actions"
import { toast } from "sonner"

interface EquiposTableWrapperProps {
    data: Equipo[]
}

export function EquiposTableWrapper({ data }: EquiposTableWrapperProps) {
    const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = async (equipoData: CreateEquipoData) => {
        setIsLoading(true)
        try {
            await createEquipo(equipoData)
            toast.success("Equipo creado exitosamente")
            setIsFormOpen(false)
        } catch (error) {
            console.error("Error creating equipo:", error)
            toast.error("Error al crear el equipo")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (equipo: Equipo) => {
        setSelectedEquipo(equipo)
        setIsFormOpen(true)
    }

    const handleUpdate = async (equipoData: UpdateEquipoData) => {
        setIsLoading(true)
        try {
            await updateEquipo(equipoData)
            toast.success("Equipo actualizado exitosamente")
            setIsFormOpen(false)
            setSelectedEquipo(null)
        } catch (error) {
            console.error("Error updating equipo:", error)
            toast.error("Error al actualizar el equipo")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteEquipo(id)
            toast.success("Equipo eliminado exitosamente")
        } catch (error) {
            console.error("Error deleting equipo:", error)
            toast.error("Error al eliminar el equipo")
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setSelectedEquipo(null)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Equipos de Inspección</CardTitle>
                            <CardDescription>
                                Gestiona los equipos disponibles para las inspecciones
                            </CardDescription>
                        </div>
                        <AddEquipoButton onClick={() => setIsFormOpen(true)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <EquiposTable
                        data={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <EquipoForm
                open={isFormOpen}
                onOpenChange={handleFormClose}
                equipo={selectedEquipo}
                onSubmit={selectedEquipo ?
                    (data) => handleUpdate(data as UpdateEquipoData) :
                    (data) => handleCreate(data as CreateEquipoData)
                }
                isLoading={isLoading}
            />
        </>
    )
}