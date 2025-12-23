"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header"
import { ClienteRowActions } from "./cliente-row-actions"
import { Cliente } from "./actions"
import moment from "moment-timezone"
import "moment/locale/es"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'

export const columns: ColumnDef<Cliente>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todo"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nombre",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("nombre")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "cuit",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="CUIT" />
        ),
        cell: ({ row }) => {
            const cuit = row.getValue("cuit") as string
            return (
                <div className="font-mono text-sm">
                    {cuit}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const cuit = row.getValue(id) as string

            return value.some((filterValue: string) => {
                switch (filterValue) {
                    case "persona_fisica":
                        return cuit.startsWith("20")
                    case "persona_juridica":
                        return cuit.startsWith("30")
                    case "monotributo":
                        return cuit.startsWith("27")
                    case "otros":
                        return !cuit.startsWith("20") && !cuit.startsWith("30") && !cuit.startsWith("27")
                    default:
                        return true
                }
            })
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
            const email = row.getValue("email") as string | null
            return (
                <div className="text-sm text-muted-foreground">
                    {email || "Sin email"}
                </div>
            )
        },
    },
    {
        accessorKey: "telefono",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Teléfono" />
        ),
        cell: ({ row }) => {
            const telefono = row.getValue("telefono") as string | null
            return (
                <div className="text-sm">
                    {telefono || "Sin teléfono"}
                </div>
            )
        },
    },
    {
        accessorKey: "moneda",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Moneda" />
        ),
        cell: ({ row }) => {
            const moneda = row.getValue("moneda") as "ARS" | "USD"
            return (
                <Badge variant={moneda === "USD" ? "default" : "secondary"}>
                    {moneda}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: "is_active",
        accessorFn: (row) => String(row.is_active),
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const isActive = row.original.is_active
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha de Creación" />
        ),
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string
            // created_at es TIMESTAMP, usar parseo directo con timezone
            return (
                <div className="text-sm text-muted-foreground">
                    {moment.tz(date, TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            const date = moment.tz(row.getValue(id) as string, TIMEZONE_ARGENTINA)
            const now = moment.tz(TIMEZONE_ARGENTINA)

            return value.some((filterValue: string) => {
                switch (filterValue) {
                    case "today":
                        return date.isSame(now, 'day')
                    case "week":
                        const weekAgo = moment.tz(TIMEZONE_ARGENTINA).subtract(7, 'days')
                        return date.isSameOrAfter(weekAgo)
                    case "month":
                        const monthAgo = moment.tz(TIMEZONE_ARGENTINA).subtract(1, 'month')
                        return date.isSameOrAfter(monthAgo)
                    case "quarter":
                        const quarterAgo = moment.tz(TIMEZONE_ARGENTINA).subtract(3, 'months')
                        return date.isSameOrAfter(quarterAgo)
                    case "year":
                        const yearAgo = moment.tz(TIMEZONE_ARGENTINA).subtract(1, 'year')
                        return date.isSameOrAfter(yearAgo)
                    default:
                        return true
                }
            })
        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            return <ClienteRowActions cliente={row.original} />
        },
    },
]