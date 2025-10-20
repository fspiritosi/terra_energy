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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Cliente } from "./actions"

const clienteSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    cuit: z.string().min(11, "El CUIT debe tener al menos 11 caracteres"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    moneda: z.enum(["ARS", "USD"]),
    is_active: z.boolean(),
})

type ClienteFormData = z.infer<typeof clienteSchema>

interface ClienteFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cliente?: Cliente | null
    onSubmit: (data: ClienteFormData) => Promise<void>
    isLoading?: boolean
}

export function ClienteForm({
    open,
    onOpenChange,
    cliente,
    onSubmit,
    isLoading = false,
}: ClienteFormProps) {
    const isEditing = !!cliente

    const form = useForm<ClienteFormData>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            nombre: "",
            cuit: "",
            email: "",
            telefono: "",
            direccion: "",
            moneda: "ARS",
            is_active: true,
        },
    })

    // Resetear el formulario cuando cambie el cliente o se abra/cierre el modal
    React.useEffect(() => {
        if (open) {
            if (cliente) {
                form.reset({
                    nombre: cliente.nombre,
                    cuit: cliente.cuit,
                    email: cliente.email || "",
                    telefono: cliente.telefono || "",
                    direccion: cliente.direccion || "",
                    moneda: cliente.moneda,
                    is_active: cliente.is_active,
                })
            } else {
                form.reset({
                    nombre: "",
                    cuit: "",
                    email: "",
                    telefono: "",
                    direccion: "",
                    moneda: "ARS",
                    is_active: true,
                })
            }
        }
    }, [open, cliente, form])

    const handleSubmit = async (data: ClienteFormData) => {
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
                        {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica los datos del cliente."
                            : "Completa los datos para crear un nuevo cliente."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nombre *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cuit"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>CUIT *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="20-12345678-9" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="cliente@ejemplo.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+54 11 1234-5678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dirección completa" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="moneda"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Moneda *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar moneda" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ARS">Pesos Argentinos (ARS)</SelectItem>
                                                <SelectItem value="USD">Dólares (USD)</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                Cliente activo
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
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Guardando..."
                                    : isEditing
                                        ? "Actualizar"
                                        : "Crear Cliente"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}