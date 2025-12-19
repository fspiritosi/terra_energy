"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header"
import { VerificacionCompleta } from "./actions"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import moment from "moment"
import "moment/locale/es"

const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
        case "aprobado":
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Aprobado</Badge>
        case "rechazado":
            return <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">Rechazado</Badge>
        case "con_observaciones":
            return <Badge variant="outline" className="text-amber-700 border-amber-600 dark:text-amber-400 dark:border-amber-500">Con Observaciones</Badge>
        case "pendiente":
            return <Badge variant="outline" className="text-gray-700 border-gray-400 dark:text-gray-300 dark:border-gray-600">Pendiente</Badge>
        default:
            return <Badge variant="outline">{resultado}</Badge>
    }
}

export const columns: ColumnDef<VerificacionCompleta>[] = [
    {
        accessorKey: "numero_documento",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nº Documento" />
        ),
        cell: ({ row }) => {
            const numero = row.getValue("numero_documento") as string
            return (
                <div className="font-mono text-sm font-medium">
                    {numero}
                </div>
            )
        },
    },
    {
        accessorKey: "inspeccion.numero_inspeccion",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nº Inspección" />
        ),
        cell: ({ row }) => {
            const inspeccion = row.original.inspeccion
            return (
                <div className="font-mono text-sm">
                    {inspeccion?.numero_inspeccion || "N/A"}
                </div>
            )
        },
    },
    {
        accessorKey: "cliente",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Cliente" />
        ),
        accessorFn: (row) => row.inspeccion?.cliente_nombre || "N/A",
        cell: ({ row }) => {
            const inspeccion = row.original.inspeccion
            return (
                <div className="font-medium">
                    {inspeccion?.cliente_nombre || "N/A"}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const inspeccion = row.original.inspeccion
            const clienteNombre = inspeccion?.cliente_nombre || "N/A"
            if (Array.isArray(value)) {
                return value.includes(clienteNombre)
            }
            return clienteNombre.toLowerCase().includes(String(value).toLowerCase())
        },
    },
    {
        accessorKey: "inspeccion.lugar",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lugar" />
        ),
        cell: ({ row }) => {
            const inspeccion = row.original.inspeccion
            return (
                <div className="max-w-[200px] truncate">
                    {inspeccion?.lugar || "N/A"}
                </div>
            )
        },
    },
    {
        accessorKey: "inspeccion.equipo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Equipo" />
        ),
        cell: ({ row }) => {
            const inspeccion = row.original.inspeccion
            return (
                <div className="max-w-[150px] truncate">
                    {inspeccion?.equipo || "N/A"}
                </div>
            )
        },
    },
    {
        accessorKey: "resultado",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Resultado" />
        ),
        cell: ({ row }) => {
            const resultado = row.getValue("resultado") as string
            return getResultadoBadge(resultado)
        },
        filterFn: (row, id, value) => {
            const resultado = row.getValue(id) as string
            return value.includes(resultado)
        },
    },
    {
        accessorKey: "fecha_documento",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha Emisión" />
        ),
        cell: ({ row }) => {
            const fecha = row.getValue("fecha_documento") as string
            if (!fecha) return <div className="text-sm">N/A</div>
            return (
                <div className="text-sm">
                    {moment(fecha).locale('es').format('DD/MM/YYYY')}
                </div>
            )
        },
    },
    {
        accessorKey: "inspeccion.fecha_completada",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha Inspección" />
        ),
        cell: ({ row }) => {
            const inspeccion = row.original.inspeccion
            const fecha = inspeccion?.fecha_completada
            if (!fecha) return <div className="text-sm">N/A</div>
            return (
                <div className="text-sm">
                    {moment(fecha).locale('es').format('DD/MM/YYYY')}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const verificacion = row.original
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                >
                    <Link 
                        href={`/verificar/${verificacion.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Ver verificación</span>
                    </Link>
                </Button>
            )
        },
    },
]

