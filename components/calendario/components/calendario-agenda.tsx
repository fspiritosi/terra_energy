"use client"

import { Badge } from "@/components/ui/badge"
import { getInspeccionesType } from "@/components/inspecciones/components"
import moment from "moment-timezone"
import "moment/locale/es"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'

interface CalendarioAgendaProps {
    fecha: Date
    inspecciones: getInspeccionesType
}

export function CalendarioAgenda({ fecha, inspecciones }: CalendarioAgendaProps) {
    const fechaMoment = moment.tz(fecha, TIMEZONE_ARGENTINA)
    const año = fechaMoment.year()
    const mes = fechaMoment.month()

    // Agrupar inspecciones por fecha
    const inspeccionesPorFecha = inspecciones.reduce((acc, inspeccion) => {
        const fechaKey = inspeccion.fecha_programada
        if (!acc[fechaKey]) {
            acc[fechaKey] = []
        }
        acc[fechaKey].push(inspeccion)
        return acc
    }, {} as Record<string, typeof inspecciones>)

    // Obtener todas las fechas del mes que tienen inspecciones, ordenadas
    const fechasConInspecciones = Object.keys(inspeccionesPorFecha)
        .filter(fechaKey => {
            const fechaInspeccion = moment.tz(fechaKey, TIMEZONE_ARGENTINA)
            return fechaInspeccion.month() === mes && fechaInspeccion.year() === año
        })
        .sort()

    if (fechasConInspecciones.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No hay inspecciones programadas para este mes</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {fechasConInspecciones.map(fechaKey => {
                const fecha = moment(fechaKey)
                const inspeccionesDelDia = inspeccionesPorFecha[fechaKey]

                return (
                    <div key={fechaKey} className="space-y-3">
                        {/* Header del día */}
                        <div className="flex items-center gap-3">
                            <div className="text-lg font-semibold">
                                {fecha.locale('es').format('dddd, D [de] MMMM')}
                            </div>
                            <div className="h-px bg-border flex-1"></div>
                            <Badge variant="secondary">
                                {inspeccionesDelDia.length} {inspeccionesDelDia.length === 1 ? 'inspección' : 'inspecciones'}
                            </Badge>
                        </div>

                        {/* Lista de inspecciones del día */}
                        <div className="space-y-2 ml-4">
                            {inspeccionesDelDia.map((inspeccion, idx) => (
                                <div
                                    key={idx}
                                    className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                                >
                                    <div className="font-medium">{inspeccion.numero_inspeccion}</div>
                                    <div className="text-muted-foreground text-xs">
                                        {inspeccion.cliente_nombre} - {inspeccion.equipo}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {inspeccion.lugar} • {inspeccion.responsable}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}