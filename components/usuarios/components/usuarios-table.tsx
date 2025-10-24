"use client"

import * as React from "react"
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
    // Generar opciones de clientes únicos de los datos
    const clientesOptions = React.useMemo(() => {
        const clientesSet = new Set<string>()
        data.forEach(usuario => {
            usuario.clientes?.forEach(cliente => {
                clientesSet.add(cliente.nombre)
            })
        })
        return Array.from(clientesSet).sort().map(nombre => ({
            value: nombre,
            label: nombre
        }))
    }, [data])

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
                    columnKey: "clientes",
                    title: "Cliente",
                    options: clientesOptions,
                },
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