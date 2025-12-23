"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { getInspeccionesType } from "./actions"
import moment from "moment-timezone"
import "moment/locale/es"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'
// import { Inspeccion } from "./actions"

const reprogramarSchema = z.object({
    nuevaFecha: z.string().min(1, "La nueva fecha es requerida"),
})

type ReprogramarFormData = z.infer<typeof reprogramarSchema>

interface ReprogramarDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    inspeccion: getInspeccionesType[number] | null
    onSubmit: (nuevaFecha: string) => Promise<void>
    isLoading?: boolean
}

export function ReprogramarDialog({
    open,
    onOpenChange,
    inspeccion,
    onSubmit,
    isLoading = false,
}: ReprogramarDialogProps) {
    const form = useForm<ReprogramarFormData>({
        resolver: zodResolver(reprogramarSchema),
        defaultValues: {
            nuevaFecha: "",
        },
    })

    // Resetear formulario cuando se abre/cierra o cambia la inspección
    useEffect(() => {
        if (open && inspeccion) {
            form.reset({
                nuevaFecha: inspeccion.fecha_programada,
            })
        }
    }, [open, inspeccion, form])

    const handleSubmit = async (data: ReprogramarFormData) => {
        try {
            await onSubmit(data.nuevaFecha)
            onOpenChange(false)
        } catch (error) {
            console.error("Error al reprogramar inspección:", error)
        }
    }

    if (!inspeccion) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Reprogramar Inspección
                    </DialogTitle>
                    <DialogDescription>
                        Cambia la fecha programada para la inspección {inspeccion.numero_inspeccion}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium text-sm mb-2">Información de la inspección:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p><span className="font-medium">Cliente:</span> {inspeccion.cliente_nombre}</p>
                        <p><span className="font-medium">Lugar:</span> {inspeccion.lugar}</p>
                        <p><span className="font-medium">Equipo:</span> {inspeccion.equipo}</p>
                        <p><span className="font-medium">Fecha actual:</span> {moment.tz(inspeccion.fecha_programada + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss', TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')}</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nuevaFecha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nueva Fecha Programada *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            min={moment.tz(TIMEZONE_ARGENTINA).format('YYYY-MM-DD')}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Reprogramando..." : "Reprogramar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}