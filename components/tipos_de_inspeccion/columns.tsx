'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header"
import { TipoDeInspeccionType } from "./actions"
import { TipoDeInspeccionRowActions } from "./TipoDeInspeccionRowActions "

export const columns: ColumnDef<TipoDeInspeccionType>[] = [
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
            const tipo_inspeccion = row.original
            return <div className="flex items-center gap-2">{tipo_inspeccion.nombre}</div>
        },
    },
    {
        accessorKey: "codigo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Código" />
        ),
    },
    {
        accessorKey: "descripcion",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Descripción" />
        ),
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
               const tipo_inspeccion = row.original
            return (
                <Badge
                    variant={tipo_inspeccion.is_active ? "default" : "destructive"}
                >
                    {tipo_inspeccion.is_active ? "Activo" : "Inactivo"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <TipoDeInspeccionRowActions tipoDeInspeccion={row.original} />,
    },
]