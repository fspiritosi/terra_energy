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
import { Button } from "@/components/ui/button"
import { Calendar, MoreHorizontal, ClipboardCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInspeccionesType } from "./actions"
import { Database } from "@/database.types"
// import { Inspeccion } from "./actions"

interface InspeccionesTableProps {
    data: getInspeccionesType
    onReprogramar: (inspeccion: getInspeccionesType[number]) => void
    onEstadoChange: (inspeccionId: string, nuevoEstado: Database['public']['Enums']['estado_inspeccion']) => void
}

const estadoColors = {
    programada: "default",
    en_progreso: "secondary",
    completada: "success",
    cancelada: "destructive"
} as const

const estadoLabels = {
    programada: "Programada",
    en_progreso: "En Progreso",
    completada: "Completada",
    cancelada: "Cancelada"
}

export function InspeccionesTable({ data, onReprogramar, onEstadoChange }: InspeccionesTableProps) {
    const router = useRouter()

    if (data.length === 0) {
        return (
            <div className="text-center py-6">
                <p className="text-muted-foreground">No hay inspecciones programadas</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Lugar</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Fecha Programada</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-[70px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((inspeccion) => (
                        <TableRow key={inspeccion.id}>
                            <TableCell className="font-medium">
                                {inspeccion.numero_inspeccion}
                            </TableCell>
                            <TableCell>
                                {inspeccion.cliente_nombre}
                            </TableCell>
                            <TableCell>
                                {inspeccion.lugar}
                            </TableCell>
                            <TableCell>
                                {inspeccion.equipo}
                            </TableCell>
                            <TableCell>
                                {new Date(inspeccion.fecha_programada).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Badge variant={estadoColors[inspeccion.estado!]}>
                                    {estadoLabels[inspeccion.estado!]}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onReprogramar(inspeccion)}>
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Reprogramar
                                        </DropdownMenuItem>
                                        {inspeccion.estado === 'programada' && (
                                            <DropdownMenuItem onClick={() => onEstadoChange(inspeccion.id, 'en_progreso')}>
                                                Iniciar Inspección
                                            </DropdownMenuItem>
                                        )}
                                        {inspeccion.estado === 'en_progreso' && (
                                            <>
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/inspecciones/${inspeccion.id}/completar`)}>
                                                    <ClipboardCheck className="mr-2 h-4 w-4" />
                                                    Completar Checklist
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEstadoChange(inspeccion.id, 'completada')}>
                                                    Marcar Completada
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {(inspeccion.estado === 'programada' || inspeccion.estado === 'en_progreso') && (
                                            <DropdownMenuItem
                                                onClick={() => onEstadoChange(inspeccion.id, 'cancelada')}
                                                className="text-destructive"
                                            >
                                                Cancelar
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}