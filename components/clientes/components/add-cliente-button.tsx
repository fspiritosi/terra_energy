"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClienteForm } from "./cliente-form"
import { createCliente, CreateClienteData } from "./cliente-actions"
import { toast } from "sonner"
import { useState } from "react"

export function AddClienteButton() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: CreateClienteData) => {
        setIsLoading(true)
        try {
            await createCliente(data)
            toast.success("Cliente creado exitosamente")
        } catch (error) {
            toast.error("Error al crear el cliente")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
            </Button>
            <ClienteForm
                open={open}
                onOpenChange={setOpen}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </>
    )
}