"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, List } from "lucide-react"
import { CalendarioGrid } from "./calendario-grid"
import { getInspeccionesType } from "@/components/inspecciones/components"
import { CalendarioAgenda } from "./calendario-agenda"
import moment from "moment"
import "moment/locale/es"

type VistaCalendario = 'calendario' | 'agenda'

interface CalendarioViewProps {
    inspecciones: getInspeccionesType
}

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export function CalendarioView({ inspecciones }: CalendarioViewProps) {
    const [fechaActual, setFechaActual] = useState(new Date())
    const [vista, setVista] = useState<VistaCalendario>('calendario')

    const fechaMoment = moment(fechaActual)
    const mesActual = fechaMoment.month()
    const añoActual = fechaMoment.year()

    const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
        setFechaActual(prev => {
            const nuevaFecha = moment(prev)
            if (direccion === 'anterior') {
                nuevaFecha.subtract(1, 'month')
            } else {
                nuevaFecha.add(1, 'month')
            }
            return nuevaFecha.toDate()
        })
    }

    const irAHoy = () => {
        setFechaActual(new Date())
    }

    // Filtrar inspecciones del mes actual
    const inspeccionesDelMes = inspecciones.filter(inspeccion => {
        const fechaInspeccion = moment(inspeccion.fecha_programada)
        return fechaInspeccion.month() === mesActual &&
            fechaInspeccion.year() === añoActual
    })

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Calendario de Inspecciones</CardTitle>
                        <CardDescription>
                            Vista mensual de las inspecciones programadas
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Selector de vista */}
                        <div className="flex items-center gap-1 border rounded-lg p-1">
                            <Button
                                variant={vista === 'calendario' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setVista('calendario')}
                                className="h-8"
                            >
                                <Calendar className="h-4 w-4 mr-1" />
                                Calendario
                            </Button>
                            <Button
                                variant={vista === 'agenda' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setVista('agenda')}
                                className="h-8"
                            >
                                <List className="h-4 w-4 mr-1" />
                                Agenda
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={irAHoy}
                            >
                                Hoy
                            </Button>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => cambiarMes('anterior')}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="min-w-[140px] text-center font-medium">
                                    {fechaMoment.locale('es').format('MMMM YYYY')}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => cambiarMes('siguiente')}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {vista === 'calendario' ? (
                    <CalendarioGrid
                        fecha={fechaActual}
                        inspecciones={inspeccionesDelMes}
                    />
                ) : (
                    <CalendarioAgenda
                        fecha={fechaActual}
                        inspecciones={inspeccionesDelMes}
                    />
                )}
            </CardContent>
        </Card>
    )
}