"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import { Solicitud } from "./actions"
import moment from "moment-timezone"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'

const approveSchema = z.object({
    fechaProgramada: z.string().min(1, "La fecha programada es requerida"),
    comentarios: z.string().optional(),
})

type ApproveFormData = z.infer<typeof approveSchema>

interface SolicitudApproveDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    solicitud: Solicitud | null
    onApprove: (solicitudId: string, fechaProgramada: string, comentarios?: string) => Promise<void>
    isLoading?: boolean
}

export function SolicitudApproveDialog({
    open,
    onOpenChange,
    solicitud,
    onApprove,
    isLoading = false,
}: SolicitudApproveDialogProps) {
    const form = useForm<ApproveFormData>({
        resolver: zodResolver(approveSchema),
        defaultValues: {
            fechaProgramada: "",
            comentarios: "",
        },
    })

    React.useEffect(() => {
        if (open) {
            form.reset({
                fechaProgramada: "",
                comentarios: ""
            })
        }
    }, [open, form])

    const handleSubmit = async (data: ApproveFormData) => {
        if (!solicitud) return

        try {
            await onApprove(solicitud.id, data.fechaProgramada, data.comentarios)
            onOpenChange(false)
        } catch (error) {
            console.error("Error al aprobar solicitud:", error)
        }
    }

    if (!solicitud) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Aprobar Solicitud
                    </DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas aprobar la solicitud {solicitud.numero_solicitud}?
                        Esta acción permitirá que la solicitud pase al siguiente estado del proceso.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="bg-muted p-4 rounded-md">
                            <h4 className="font-medium text-sm mb-2">Resumen de la solicitud:</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <p><span className="font-medium">Cliente:</span> {solicitud.cliente?.nombre}</p>
                                <p><span className="font-medium">Lugar:</span> {solicitud.lugar}</p>
                                <p><span className="font-medium">Equipo:</span> {solicitud.equipo}</p>
                                <p><span className="font-medium">Responsable:</span> {solicitud.responsable}</p>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="fechaProgramada"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha Programada para la Inspección *</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="comentarios"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comentarios de Aprobación (Opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Agregar comentarios sobre la aprobación..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                type="submit"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Aprobando..." : "Aprobar Solicitud"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}