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
import { Calendar, MoreHorizontal, ClipboardCheck, FileText, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInspeccionesType } from "./actions"
import { Database } from "@/database.types"
import moment from "moment-timezone"
import "moment/locale/es"
import { parseDateArgentina } from "@/lib/utils"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'

interface DocumentoInfo {
    id: string;
    numero_documento: string;
    resultado: string;
}

interface InspeccionesTableProps {
    data: getInspeccionesType
    documentos?: Map<string, DocumentoInfo> // Map de inspeccion_id a documento
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

export function InspeccionesTable({ data, documentos, onReprogramar, onEstadoChange }: InspeccionesTableProps) {
    const router = useRouter()

    const handleDownloadPdf = (documentoId: string) => {
        window.open(`/api/documentos/${documentoId}/pdf`, '_blank')
    }

    const handleVerificarDocumento = (documentoId: string) => {
        window.open(`/verificar/${documentoId}`, '_blank')
    }

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
                                {parseDateArgentina(inspeccion.fecha_programada).locale('es').format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell>
                                <Badge variant={estadoColors[inspeccion.estado!]}>
                                    {estadoLabels[inspeccion.estado!]}
                                </Badge>
                            </TableCell>
                         {
                            inspeccion.estado !== 'cancelada' && (
                                <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menú</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {(inspeccion.estado === 'programada') && (
                                            <>
                                                <DropdownMenuItem onClick={() => onReprogramar(inspeccion)}>
                                                <Calendar className="mr-2 h-4 w-4" />
                                                Reprogramar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {onEstadoChange(inspeccion.id, 'en_progreso')
router.push(`/dashboard/inspecciones/${inspeccion.id}/completar`)

                                            }}>
                                                Iniciar Inspección
                                            </DropdownMenuItem>
                                            </>
                                        )}
                                            {inspeccion.estado === 'en_progreso' && (
                                            <>
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/inspecciones/${inspeccion.id}/completar`)}>
                                                    <ClipboardCheck className="mr-2 h-4 w-4" />
                                                    Completar Checklist
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
                                        {inspeccion.estado === 'completada' && documentos?.has(inspeccion.id) && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDownloadPdf(documentos.get(inspeccion.id)!.id)}>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Descargar PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleVerificarDocumento(documentos.get(inspeccion.id)!.id)}>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Ver Verificación
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            )
                         }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}