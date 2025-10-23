"use client"

import { UsuariosTable } from "./usuarios-table"
import { AddUsuarioButton } from "./add-usuario-button"
import { Usuario } from "./actions"

interface UsuariosTableWrapperProps {
    data: Usuario[]
}

export function UsuariosTableWrapper({ data }: UsuariosTableWrapperProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
                    <p className="text-muted-foreground">
                        Gestiona los usuarios del sistema y sus asignaciones a clientes
                    </p>
                </div>
                <AddUsuarioButton />
            </div>
            <UsuariosTable data={data} />
        </div>
    )
}