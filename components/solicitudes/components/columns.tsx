"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header"
import { Solicitud } from "./actions"
import { SolicitudRowActions } from "./solicitud-row-actions"

const getEstadoBadge = (estado: string) => {
    switch (estado) {
        case "pendiente":
            return <Badge variant="outline" className="text-yellow-700 border-yellow-600 dark:text-yellow-400 dark:border-yellow-500">Pendiente</Badge>
        case "aprobada":
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white">Aprobada</Badge>
        case "rechazada":
            return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white">Rechazada</Badge>
        default:
            return <Badge variant="outline" className="text-gray-700 border-gray-400 dark:text-gray-300 dark:border-gray-600">{estado}</Badge>
    }
}

export const columns: ColumnDef<Solicitud>[] = [
    {
        accessorKey: "numero_solicitud",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Número" />
        ),
        cell: ({ row }) => {
            const numero = row.getValue("numero_solicitud") as string
            return (
                <div className="font-mono text-sm">
                    {numero}
                </div>
            )
        },
    },
    {
        accessorKey: "cliente",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cliente" />
        ),
        cell: ({ row }) => {
            const cliente = row.original.cliente
            return (
                <div className="font-medium">
                    {cliente?.nombre || "Sin cliente"}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const cliente = row.original.cliente
            return cliente?.nombre?.toLowerCase().includes(value.toLowerCase()) || false
        },
    },
    {
        accessorKey: "lugar",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lugar" />
        ),
        cell: ({ row }) => {
            const lugar = row.getValue("lugar") as string
            return (
                <div className="max-w-[200px] truncate">
                    {lugar}
                </div>
            )
        },
    },
    {
        accessorKey: "responsable",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Responsable" />
        ),
        cell: ({ row }) => {
            const responsable = row.getValue("responsable") as string
            return (
                <div className="max-w-[150px] truncate">
                    {responsable}
                </div>
            )
        },
    },
    {
        accessorKey: "fecha_entrega_deseada",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha Entrega" />
        ),
        cell: ({ row }) => {
            const fecha = new Date(row.getValue("fecha_entrega_deseada"))
            return (
                <div className="text-sm">
                    {fecha.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "estado",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const estado = row.getValue("estado") as string
            return getEstadoBadge(estado)
        },
        filterFn: (row, id, value) => {
            const estado = row.getValue(id) as string
            return value.includes(estado)
        },
    },
    {
        accessorKey: "fecha_solicitud",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha Solicitud" />
        ),
        cell: ({ row }) => {
            const fecha = new Date(row.getValue("fecha_solicitud"))
            return (
                <div className="text-sm">
                    {fecha.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <SolicitudRowActions solicitud={row.original} />,
    },
]