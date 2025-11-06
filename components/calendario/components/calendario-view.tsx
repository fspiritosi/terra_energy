"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CalendarioGrid } from "./calendario-grid"
import { getInspeccionesType } from "@/components/inspecciones/components"
// import { Inspeccion } from "@/components/inspecciones/components/actions"

interface CalendarioViewProps {
    inspecciones: getInspeccionesType
}

const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export function CalendarioView({ inspecciones }: CalendarioViewProps) {
    const [fechaActual, setFechaActual] = useState(new Date())

    const mesActual = fechaActual.getMonth()
    const añoActual = fechaActual.getFullYear()

    const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
        setFechaActual(prev => {
            const nuevaFecha = new Date(prev)
            if (direccion === 'anterior') {
                nuevaFecha.setMonth(prev.getMonth() - 1)
            } else {
                nuevaFecha.setMonth(prev.getMonth() + 1)
            }
            return nuevaFecha
        })
    }

    const irAHoy = () => {
        setFechaActual(new Date())
    }

    // Filtrar inspecciones del mes actual
    const inspeccionesDelMes = inspecciones.filter(inspeccion => {
        const fechaInspeccion = new Date(inspeccion.fecha_programada)
        return fechaInspeccion.getMonth() === mesActual &&
            fechaInspeccion.getFullYear() === añoActual
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
                                {meses[mesActual]} {añoActual}
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
            </CardHeader>
            <CardContent>
                <CalendarioGrid
                    fecha={fechaActual}
                    inspecciones={inspeccionesDelMes}
                />
            </CardContent>
        </Card>
    )
}