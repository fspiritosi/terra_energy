'use client'

import { DataTable } from "@/components/tables/data-table"
import {columns} from './columns'
import { TipoDeInspeccionType } from "./actions"

// Opciones para filtros


interface InspeccionesTipoTableProps {
    data: TipoDeInspeccionType[]
}

export function InspeccionesTipoTable({ data }: InspeccionesTipoTableProps) {

    const customSearchFilter = (tipoDeInspeccion: TipoDeInspeccionType, searchValue: string): boolean => {
        if (!searchValue) return true

        const searchLower = searchValue.toLowerCase()
        const nombre = tipoDeInspeccion.nombre?.toLowerCase() || ""
        const codigo = tipoDeInspeccion.codigo?.toLowerCase() || ""
        const descripcion = tipoDeInspeccion.descripcion?.toLowerCase() || ""

        return nombre.includes(searchLower) ||
            codigo.includes(searchLower) ||
            descripcion.includes(searchLower)
    }


    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="nombre"
            searchPlaceholder="Buscar por nombre, codigo o descripcion..."
            customSearchFilter={customSearchFilter}
            filters={[
                {
                    columnKey: "is_active",
                    title: "Estado",
                    options: [
                        { value: "true", label: "Activo" },
                        { value: "false", label: "Inactivo" },
                    ],
                },
            ]}
        />
    )
}