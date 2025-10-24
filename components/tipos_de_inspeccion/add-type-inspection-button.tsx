"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TipoDeInspeccionForm } from "./tipe-inspection-form"
import { createTipoDeInspeccion, CreateTipoDeInspeccionData } from "./actions"
import { toast } from "sonner"

export function AddTypeInspectionButton() {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (data: CreateTipoDeInspeccionData) => {
        setIsLoading(true)
        try {
            await createTipoDeInspeccion({
                nombre: data.nombre,
                codigo: data.codigo,
                descripcion: data.descripcion,
                is_active: data.is_active
            })
            toast.success("Tipo de inspección creado exitosamente")
        } catch (error) {
            toast.error("Error al crear el tipo de inspección")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} data-testid="add-type-inspeccion">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Tipo de Inspección
            </Button>
            <TipoDeInspeccionForm
                open={open}
                onOpenChange={setOpen}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </>
    )
}