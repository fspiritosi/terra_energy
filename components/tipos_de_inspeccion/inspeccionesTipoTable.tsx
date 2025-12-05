'use client'

import * as React from "react"
import Link from "next/link"
import { DataTable } from "@/components/tables/data-table"
import {columns} from './columns'
import { TipoDeInspeccionType } from "./actions"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { TipoDeInspeccionRowActions } from "./TipoDeInspeccionRowActions "

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

    // Crear columnas con la función de callback
    const columnsWithCallback = React.useMemo(() => {
        return columns.map((col) => {
            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: any) => {
                        const tipoDeInspeccion = row.original;
                        return (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={`/dashboard/inspecciones/tipos_de_inspeccion/${tipoDeInspeccion.slug || tipoDeInspeccion.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <TipoDeInspeccionRowActions tipoDeInspeccion={tipoDeInspeccion} />
                            </div>
                        );
                    },
                };
            }
            return col;
        });
    }, []);

    return (
        <DataTable
            columns={columnsWithCallback}
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