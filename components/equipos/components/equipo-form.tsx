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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Equipo, CreateEquipoData, UpdateEquipoData } from "./actions"

const equipoSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    is_active: z.boolean(),
})

type EquipoFormData = z.infer<typeof equipoSchema>

interface EquipoFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    equipo?: Equipo | null
    onSubmit: (data: CreateEquipoData | UpdateEquipoData) => Promise<void>
    isLoading?: boolean
}

export function EquipoForm({
    open,
    onOpenChange,
    equipo,
    onSubmit,
    isLoading = false,
}: EquipoFormProps) {
    const isEditing = !!equipo

    const form = useForm<EquipoFormData>({
        resolver: zodResolver(equipoSchema),
        defaultValues: {
            name: "",
            description: "",
            is_active: true,
        },
    })

    // Resetear formulario cuando se abre/cierra o cambia el equipo
    useEffect(() => {
        if (open) {
            if (equipo) {
                // Modo edición
                form.reset({
                    name: equipo.name,
                    description: equipo.description || "",
                    is_active: equipo.is_active ?? true,
                })
            } else {
                // Modo creación
                form.reset({
                    name: "",
                    description: "",
                    is_active: true,
                })
            }
        }
    }, [open, equipo, form])

    const handleSubmit = async (data: EquipoFormData) => {
        try {
            if (isEditing && equipo) {
                await onSubmit({
                    id: equipo.id,
                    ...data,
                })
            } else {
                await onSubmit(data)
            }
            onOpenChange(false)
        } catch (error) {
            console.error("Error al guardar equipo:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Equipo" : "Nuevo Equipo"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica los datos del equipo de inspección."
                            : "Completa los datos para crear un nuevo equipo de inspección."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del equipo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descripción del equipo (opcional)"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Estado Activo</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            El equipo estará disponible para seleccionar en las solicitudes
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                        {isLoading
                            ? "Guardando..."
                            : isEditing
                                ? "Actualizar Equipo"
                                : "Crear Equipo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}