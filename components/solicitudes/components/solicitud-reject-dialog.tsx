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
import { Textarea } from "@/components/ui/textarea"
import { XCircle } from "lucide-react"
import { Solicitud } from "./actions"

const rejectSchema = z.object({
    comentarios: z.string().min(1, "Los comentarios son requeridos para rechazar una solicitud"),
})

type RejectFormData = z.infer<typeof rejectSchema>

interface SolicitudRejectDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    solicitud: Solicitud | null
    onReject: (solicitudId: string, comentarios: string) => Promise<void>
    isLoading?: boolean
}

export function SolicitudRejectDialog({
    open,
    onOpenChange,
    solicitud,
    onReject,
    isLoading = false,
}: SolicitudRejectDialogProps) {
    const form = useForm<RejectFormData>({
        resolver: zodResolver(rejectSchema),
        defaultValues: {
            comentarios: "",
        },
    })

    React.useEffect(() => {
        if (open) {
            form.reset({ comentarios: "" })
        }
    }, [open, form])

    const handleSubmit = async (data: RejectFormData) => {
        if (!solicitud) return

        try {
            await onReject(solicitud.id, data.comentarios)
            onOpenChange(false)
        } catch (error) {
            console.error("Error al rechazar solicitud:", error)
        }
    }

    if (!solicitud) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Rechazar Solicitud
                    </DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas rechazar la solicitud {solicitud.numero_solicitud}?
                        Debes proporcionar una razón para el rechazo.
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
                            name="comentarios"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo del Rechazo *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Explica por qué se rechaza esta solicitud..."
                                            className="min-h-[120px]"
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
                                variant="destructive"
                                disabled={isLoading}
                            >
                                {isLoading ? "Rechazando..." : "Rechazar Solicitud"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}