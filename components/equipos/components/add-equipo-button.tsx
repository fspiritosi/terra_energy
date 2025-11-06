"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddEquipoButtonProps {
    onClick: () => void
}

export function AddEquipoButton({ onClick }: AddEquipoButtonProps) {
    return (
        <Button onClick={onClick}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Equipo
        </Button>
    )
}