"use client"

import * as React from "react"
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

import { Switch } from "@/components/ui/switch"
import { updateTipoDeInspeccion, createTipoDeInspeccion } from "./actions"
import { TipoDeInspeccionType } from "./actions"



const tipoDeInspeccionSchema = z.object({
    codigo: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    descripcion: z.string().min(10, "La descripcion debe tener al menos 10 caracteres").optional(),
    is_active: z.boolean().optional(),
})

type TipoDeInspeccionFormData = z.infer<typeof tipoDeInspeccionSchema>

interface TipoDeInspeccionFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tipoDeInspeccion?: TipoDeInspeccionType | null
    onSubmit: (data: TipoDeInspeccionFormData) => Promise<void>
    isLoading?: boolean
}

export function TipoDeInspeccionForm({
    open,
    onOpenChange,
    tipoDeInspeccion,
    onSubmit,
    isLoading = false,
}: TipoDeInspeccionFormProps) {
    const isEditing = !!tipoDeInspeccion

    const form = useForm<TipoDeInspeccionFormData>({
        resolver: zodResolver(tipoDeInspeccionSchema),
        defaultValues: {
            nombre: "",
            codigo: "",
            descripcion: "",
            is_active: true,
        },
    })

    // Resetear el formulario cuando cambie el cliente o se abra/cierre el modal
    React.useEffect(() => {
        if (open) {
            if (tipoDeInspeccion) {
                form.reset({
                    nombre: tipoDeInspeccion.nombre,
                    codigo: tipoDeInspeccion.codigo,
                    descripcion: tipoDeInspeccion.descripcion || "",
                    is_active: tipoDeInspeccion.is_active ?? true,
                })
            } else {
                form.reset({
                    nombre: "",
                    codigo: "",
                    descripcion: "",
                    is_active: true,
                })
            }
        }
    }, [open, tipoDeInspeccion, form])

    const handleSubmit = async (data: TipoDeInspeccionFormData) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch (error) {
            console.error("Error al guardar cliente:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Tipo de Inspección" : "Crear Nuevo Tipo de Inspección"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica los datos del tipo de inspección."
                            : "Completa los datos para crear un nuevo tipo de inspección."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="tipo-inspeccion-form">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nombre *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del tipo de inspección" {...field} data-testid="input-nombre" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="codigo"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Codigo *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="INS-001" {...field} data-testid="input-codigo" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="descripcion"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Descripcion</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="descripcion"
                                                {...field}
                                                data-testid="input-descripcion"
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
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Estado</FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                Tipo de inspección activo
                                            </div>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                data-testid="switch-activo"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                data-testid="btn-cancelar"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading} data-testid="btn-guardar">
                                {isLoading
                                    ? "Guardando..."
                                    : isEditing
                                        ? "Actualizar"
                                        : "Crear Tipo de Inspección"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}