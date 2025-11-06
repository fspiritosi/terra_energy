"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EquipoRowActions } from "./equipo-row-actions"
import { Equipo } from "./actions"

interface EquiposTableProps {
    data: Equipo[]
    onEdit: (equipo: Equipo) => void
    onDelete: (id: string) => void
}

export function EquiposTable({ data, onEdit, onDelete }: EquiposTableProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-muted-foreground">No hay equipos registrados</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha de Creación</TableHead>
                        <TableHead className="w-[70px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((equipo) => (
                        <TableRow key={equipo.id}>
                            <TableCell className="font-medium">
                                {equipo.name}
                            </TableCell>
                            <TableCell>
                                {equipo.description || "-"}
                            </TableCell>
                            <TableCell>
                                <Badge variant={(equipo.is_active ?? true) ? "default" : "secondary"}>
                                    {(equipo.is_active ?? true) ? "Activo" : "Inactivo"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {equipo.created_at ? new Date(equipo.created_at).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell>
                                <EquipoRowActions
                                    equipo={equipo}
                                    onEdit={() => onEdit(equipo)}
                                    onDelete={() => onDelete(equipo.id)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}