"use client"

import React from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns } from "./columns"
import { VerificacionCompleta } from "./actions"

interface ReportesTableProps {
    data: VerificacionCompleta[]
}

// Opciones para filtros
const resultadoOptions = [
    { value: "aprobado", label: "Aprobado" },
    { value: "rechazado", label: "Rechazado" },
    { value: "con_observaciones", label: "Con Observaciones" },
    { value: "pendiente", label: "Pendiente" },
]

export function ReportesTable({ data }: ReportesTableProps) {
    // Función de filtro personalizada
    const customSearchFilter = (verificacion: VerificacionCompleta, searchValue: string): boolean => {
        if (!searchValue) return true

        const searchLower = searchValue.toLowerCase()
        const numeroDocumento = verificacion.numero_documento?.toLowerCase() || ""
        const numeroInspeccion = verificacion.inspeccion?.numero_inspeccion?.toLowerCase() || ""
        const clienteNombre = verificacion.inspeccion?.cliente_nombre?.toLowerCase() || ""
        const lugar = verificacion.inspeccion?.lugar?.toLowerCase() || ""
        const equipo = verificacion.inspeccion?.equipo?.toLowerCase() || ""

        return numeroDocumento.includes(searchLower) ||
            numeroInspeccion.includes(searchLower) ||
            clienteNombre.includes(searchLower) ||
            lugar.includes(searchLower) ||
            equipo.includes(searchLower)
    }

    // Generar opciones de clientes únicos
    const clientesOptions = React.useMemo(() => {
        const clientesSet = new Set<string>()
        data.forEach(verificacion => {
            if (verificacion.inspeccion?.cliente_nombre) {
                clientesSet.add(verificacion.inspeccion.cliente_nombre)
            }
        })
        return Array.from(clientesSet).sort().map(nombre => ({
            value: nombre,
            label: nombre
        }))
    }, [data])

    const filters = [
        {
            columnKey: "cliente",
            title: "Cliente",
            options: clientesOptions,
        },
        {
            columnKey: "resultado",
            title: "Resultado",
            options: resultadoOptions,
        },
    ]

    return (
        <DataTable
            data={data}
            columns={columns}
            searchKey="numero_documento"
            searchPlaceholder="Buscar por documento, inspección, cliente, lugar o equipo..."
            customSearchFilter={customSearchFilter}
            filters={filters}
        />
    )
}

