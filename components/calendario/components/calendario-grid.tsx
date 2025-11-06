"use client"


import { getInspeccionesType } from "@/components/inspecciones/components"
// import { Inspeccion } from "@/components/inspecciones/components/actions"
import { cn } from "@/lib/utils"

interface CalendarioGridProps {
    fecha: Date
    inspecciones: getInspeccionesType
}

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']



export function CalendarioGrid({ fecha, inspecciones }: CalendarioGridProps) {
    const año = fecha.getFullYear()
    const mes = fecha.getMonth()

    // Primer día del mes
    const primerDia = new Date(año, mes, 1)
    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0)

    // Día de la semana del primer día (0 = domingo)
    const primerDiaSemana = primerDia.getDay()

    // Total de días en el mes
    const diasEnMes = ultimoDia.getDate()

    // Crear array de días para mostrar
    const dias = []

    // Días del mes anterior (para completar la primera semana)
    const mesAnterior = new Date(año, mes - 1, 0)
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
        dias.push({
            dia: mesAnterior.getDate() - i,
            esDelMesActual: false,
            fecha: new Date(año, mes - 1, mesAnterior.getDate() - i)
        })
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        dias.push({
            dia,
            esDelMesActual: true,
            fecha: new Date(año, mes, dia)
        })
    }

    // Días del mes siguiente (para completar la última semana)
    const diasRestantes = 42 - dias.length // 6 semanas * 7 días
    for (let dia = 1; dia <= diasRestantes; dia++) {
        dias.push({
            dia,
            esDelMesActual: false,
            fecha: new Date(año, mes + 1, dia)
        })
    }

    // Agrupar inspecciones por fecha
    const inspeccionesPorFecha = inspecciones.reduce((acc, inspeccion) => {
        const fechaKey = inspeccion.fecha_programada
        if (!acc[fechaKey]) {
            acc[fechaKey] = []
        }
        acc[fechaKey].push(inspeccion)
        return acc
    }, {} as Record<string, getInspeccionesType>)

    const hoy = new Date()
    const esHoy = (fecha: Date) => {
        return fecha.toDateString() === hoy.toDateString()
    }

    return (
        <div className="w-full">
            {/* Header con días de la semana */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-t-lg overflow-hidden">
                {diasSemana.map(dia => (
                    <div key={dia} className="bg-muted p-2 text-center text-sm font-medium text-muted-foreground">
                        {dia}
                    </div>
                ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-b-lg overflow-hidden">
                {dias.map((diaInfo, index) => {
                    const fechaKey = diaInfo.fecha.toISOString().split('T')[0]
                    const inspeccionesDelDia = inspeccionesPorFecha[fechaKey] || []

                    return (
                        <div
                            key={index}
                            className={cn(
                                "bg-background min-h-[120px] p-2 flex flex-col",
                                !diaInfo.esDelMesActual && "bg-muted/50 text-muted-foreground",
                                esHoy(diaInfo.fecha) && "bg-primary/5 ring-2 ring-primary/20"
                            )}
                        >
                            {/* Número del día */}
                            <div className={cn(
                                "text-sm font-medium mb-1",
                                esHoy(diaInfo.fecha) && "text-primary font-bold"
                            )}>
                                {diaInfo.dia}
                            </div>

                            {/* Inspecciones del día */}
                            <div className="flex-1 space-y-1">
                                {inspeccionesDelDia.slice(0, 3).map((inspeccion, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-muted after:bg-primary/70 relative rounded-md p-1 pl-3 text-xs after:absolute after:inset-y-1 after:left-1 after:w-0.5 after:rounded-full"
                                        title={`${inspeccion.numero_inspeccion} - ${inspeccion.cliente_nombre} - ${inspeccion.equipo}`}
                                    >
                                        <div className="font-medium truncate">
                                            {inspeccion.numero_inspeccion}
                                        </div>
                                        <div className="text-muted-foreground truncate">
                                            {inspeccion.cliente_nombre}
                                        </div>
                                    </div>
                                ))}

                                {/* Mostrar contador si hay más inspecciones */}
                                {inspeccionesDelDia.length > 3 && (
                                    <div className="text-xs text-muted-foreground font-medium">
                                        +{inspeccionesDelDia.length - 3} más
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}