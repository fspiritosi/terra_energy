"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UsuarioForm } from "./usuario-form"
import { createUsuario, CreateUsuarioData } from "./usuario-actions"
import { getClientesActivos } from "./actions"
import { toast } from "sonner"

export function AddUsuarioButton() {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [clientes, setClientes] = React.useState<Awaited<ReturnType<typeof getClientesActivos>>>([])

    // Cargar clientes cuando se abre el modal
    React.useEffect(() => {
        if (open) {
            getClientesActivos().then(setClientes)
        }
    }, [open])

    const handleSubmit = async (data: CreateUsuarioData) => {
        setIsLoading(true)
        try {
            await createUsuario(data)
            toast.success("Usuario creado exitosamente")
        } catch (error) {
            toast.error("Error al crear el usuario")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Usuario
            </Button>
            <UsuarioForm
                open={open}
                onOpenChange={setOpen}
                clientes={clientes}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </>
    )
}