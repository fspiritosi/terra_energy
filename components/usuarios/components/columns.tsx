"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header"
import { Usuario } from "./actions"
import { UsuarioRowActions } from "./usuario-row-actions"
import moment from "moment-timezone"
import "moment/locale/es"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'

export const columns: ColumnDef<Usuario>[] = [
    {
        accessorKey: "avatar_url",
        header: "",
        cell: ({ row }) => {
            const usuario = row.original
            const initials = usuario.nombre
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase() || "U"

            return (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={usuario.avatar_url} />
                    <AvatarFallback className="text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nombre",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre" />
        ),
        cell: ({ row }) => {
            const usuario = row.original
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{usuario.nombre}</span>
                    <span className="text-sm text-muted-foreground">{usuario.email}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "clientes",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Clientes Asignados" />
        ),
        cell: ({ row }) => {
            const clientes = row.original.clientes || []

            if (clientes.length === 0) {
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        Sin asignar
                    </Badge>
                )
            }

            if (clientes.length === 1) {
                return (
                    <Badge variant="secondary">
                        {clientes[0].nombre}
                    </Badge>
                )
            }

            const clientesAdicionales = clientes.slice(1)
            const tooltipContent = clientesAdicionales.map(c => c.nombre).join(", ")

            return (
                <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">
                        {clientes[0].nombre}
                    </Badge>
                    {clientes.length > 1 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className="text-xs cursor-help">
                                        +{clientes.length - 1} más
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">{tooltipContent}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            )
        },
        enableSorting: false,
        filterFn: (row, id, value) => {
            const clientes = row.original.clientes || []
            return clientes.some((cliente: { nombre: string }) =>
                cliente.nombre.toLowerCase().includes(value.toLowerCase())
            )
        },
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue("is_active") as boolean
            return (
                <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            const isActive = row.getValue(id) as boolean
            return value.includes(isActive.toString())
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
                <div className="text-sm">
                    {moment.tz(date, TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')}
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <UsuarioRowActions usuario={row.original} />,
    },
]