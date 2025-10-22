"use client"

import { DataTable } from "@/components/tables/data-table"
import { columns } from "./columns"
import { Usuario } from "./actions"

// Opciones para filtros
const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
]

// Filtros por rango de fechas
const fechaOptions = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year", label: "Este año" },
]

interface UsuariosTableProps {
    data: Usuario[]
}

export function UsuariosTable({ data }: UsuariosTableProps) {
    // Función de filtro personalizada para buscar por nombre, email o clientes
    const customSearchFilter = (usuario: Usuario, searchValue: string): boolean => {
        if (!searchValue) return true

        const searchLower = searchValue.toLowerCase()
        const nombre = usuario.nombre?.toLowerCase() || ""
        const email = usuario.email?.toLowerCase() || ""
        const clientesNombres = usuario.clientes?.map(c => c.nombre.toLowerCase()).join(" ") || ""

        return nombre.includes(searchLower) ||
            email.includes(searchLower) ||
            clientesNombres.includes(searchLower)
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchKey="nombre"
            searchPlaceholder="Buscar por nombre, email o cliente..."
            customSearchFilter={customSearchFilter}
            filters={[
                {
                    columnKey: "is_active",
                    title: "Estado",
                    options: estadoOptions,
                },
                {
                    columnKey: "created_at",
                    title: "Fecha de Creación",
                    options: fechaOptions,
                },
            ]}
        />
    )
}