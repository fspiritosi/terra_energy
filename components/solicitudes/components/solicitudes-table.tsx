"use client"

import * as React from "react"
import { DataTable } from "@/components/tables/data-table"
import { Solicitud } from "./actions"
import { columns } from "./columns"

// Opciones para filtros
const estadoOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "aprobada", label: "Aprobada" },
    { value: "rechazada", label: "Rechazada" },
]

// Filtros por rango de fechas
const fechaOptions = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Esta semana" },
    { value: "month", label: "Este mes" },
    { value: "quarter", label: "Este trimestre" },
    { value: "year", label: "Este año" },
]

interface SolicitudesTableProps {
    data: Solicitud[]
    userType: "cliente" | "operacion"
}

export function SolicitudesTable({ data, userType }: SolicitudesTableProps) {
    // Generar opciones de clientes únicos (solo para operadores)
    const clientesOptions = React.useMemo(() => {
        if (userType !== "operacion") return [];

        const clientesSet = new Set<string>()
        data.forEach(solicitud => {
            if (solicitud.cliente?.nombre) {
                clientesSet.add(solicitud.cliente.nombre)
            }
        })
        return Array.from(clientesSet).sort().map(nombre => ({
            value: nombre,
            label: nombre
        }))
    }, [data, userType])

    // Función de filtro personalizada
    const customSearchFilter = (solicitud: Solicitud, searchValue: string): boolean => {
        if (!searchValue) return true

        const searchLower = searchValue.toLowerCase()
        const numero = solicitud.numero_solicitud?.toLowerCase() || ""
        const lugar = solicitud.lugar?.toLowerCase() || ""
        const responsable = solicitud.responsable?.toLowerCase() || ""
        const equipo = solicitud.equipo?.toLowerCase() || ""
        const clienteNombre = solicitud.cliente?.nombre?.toLowerCase() || ""

        return numero.includes(searchLower) ||
            lugar.includes(searchLower) ||
            responsable.includes(searchLower) ||
            equipo.includes(searchLower) ||
            clienteNombre.includes(searchLower)
    }

    // Filtros según tipo de usuario
    const filters = [
        {
            columnKey: "estado",
            title: "Estado",
            options: estadoOptions,
        },
        {
            columnKey: "fecha_solicitud",
            title: "Fecha de Solicitud",
            options: fechaOptions,
        },
    ]

    // Agregar filtro de cliente solo para operadores
    if (userType === "operacion" && clientesOptions.length > 0) {
        filters.unshift({
            columnKey: "cliente",
            title: "Cliente",
            options: clientesOptions,
        })
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchKey="numero_solicitud"
            searchPlaceholder="Buscar por número, lugar, responsable..."
            customSearchFilter={customSearchFilter}
            filters={filters}
        />
    )
}