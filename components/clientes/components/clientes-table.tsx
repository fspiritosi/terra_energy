"use client"

import { DataTable } from "@/components/tables/data-table"
import { columns } from "./columns"
import { Cliente } from "./actions"

// Opciones para filtros
const monedaOptions = [
    { value: "ARS", label: "Pesos Argentinos (ARS)" },
    { value: "USD", label: "Dólares (USD)" },
]

const estadoOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
]

// Filtros por rango de fechas (últimos períodos)
const fechaOptions = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year", label: "Este año" },
]

// Filtros por tipo de contacto y dominio de email - REMOVIDOS

interface ClientesTableProps {
    data: Cliente[]
}

export function ClientesTable({ data }: ClientesTableProps) {
    // Función de filtro personalizada para buscar por nombre, CUIT o email
    const customSearchFilter = (cliente: Cliente, searchValue: string): boolean => {
        if (!searchValue) return true

        const searchLower = searchValue.toLowerCase()
        const nombre = cliente.nombre?.toLowerCase() || ""
        const cuit = cliente.cuit?.toLowerCase() || ""
        const email = cliente.email?.toLowerCase() || ""

        return nombre.includes(searchLower) ||
            cuit.includes(searchLower) ||
            email.includes(searchLower)
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchKey="nombre"
            searchPlaceholder="Buscar por nombre, CUIT o email..."
            customSearchFilter={customSearchFilter}
            filters={[
                {
                    columnKey: "moneda",
                    title: "Moneda",
                    options: monedaOptions,
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