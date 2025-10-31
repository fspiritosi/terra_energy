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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageUpload } from "@/components/profile/image-upload"
import { Usuario, ClienteOption } from "./actions"

// Schema unificado con campos opcionales
const usuarioSchema = z.object({
    nombre: z.string().optional(),
    email: z.string().optional(),
    avatar_url: z.string().optional(),
    clienteId: z.string().min(1, "Debe seleccionar un cliente"),
    is_active: z.boolean(),
})

type UsuarioFormData = z.infer<typeof usuarioSchema>

interface UsuarioFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    usuario?: Usuario | null
    clientes: ClienteOption[]
    onSubmit: (data: UsuarioFormData) => Promise<void>
    isLoading?: boolean
}

export function UsuarioForm({
    open,
    onOpenChange,
    usuario,
    clientes,
    onSubmit,
    isLoading = false,
}: UsuarioFormProps) {
    const isEditing = !!usuario
    const [avatarUrl, setAvatarUrl] = React.useState("")

    const form = useForm<UsuarioFormData>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nombre: "",
            email: "",
            avatar_url: "",
            clienteId: "",
            is_active: true,
        },
    })

    // Resetear el formulario cuando cambie el usuario o se abra/cierre el modal
    React.useEffect(() => {
        if (open) {
            if (usuario) {
                const clienteId = usuario.clientes?.[0]?.id || ""
                form.reset({
                    nombre: usuario.nombre || "",
                    email: usuario.email || "",
                    avatar_url: usuario.avatar_url || "",
                    clienteId,
                    is_active: usuario.is_active,
                })
                setAvatarUrl(usuario.avatar_url || "")
            } else {
                form.reset({
                    nombre: "",
                    email: "",
                    avatar_url: "",
                    clienteId: "",
                    is_active: true,
                })
                setAvatarUrl("")
            }
        }
    }, [open, usuario, form])

    // Sincronizar avatar URL con el formulario
    React.useEffect(() => {
        if (!isEditing) {
            form.setValue("avatar_url", avatarUrl)
        }
    }, [avatarUrl, form, isEditing])

    const handleSubmit = async (data: UsuarioFormData) => {
        try {
            if (isEditing) {
                // En modo edición, solo enviar clienteId y is_active
                await onSubmit({
                    clienteId: data.clienteId,
                    is_active: data.is_active
                })
            } else {
                // En modo creación, incluir todos los campos
                await onSubmit({
                    nombre: data.nombre,
                    email: data.email,
                    avatar_url: avatarUrl,
                    clienteId: data.clienteId,
                    is_active: data.is_active
                })
            }
            onOpenChange(false)
        } catch (error) {
            console.error("Error al guardar usuario:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Usuario" : "Invitar Nuevo Usuario"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica las asignaciones de clientes y el estado del usuario. Los datos personales no se pueden editar desde aquí."
                            : "Completa los datos para enviar una invitación por email al nuevo usuario."}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Información del usuario en modo edición */}
                            {isEditing && (
                                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={usuario?.avatar_url} />
                                            <AvatarFallback>
                                                {usuario?.nombre?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-medium">{usuario?.nombre}</h3>
                                            <p className="text-sm text-muted-foreground">{usuario?.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Solo puedes modificar las asignaciones de clientes y el estado del usuario
                                    </p>
                                </div>
                            )}

                            {/* Avatar - Solo en modo creación */}
                            {!isEditing && (
                                <div className="flex justify-center">
                                    <div className="space-y-2">
                                        <FormLabel>Foto de Perfil (Opcional)</FormLabel>
                                        <ImageUpload
                                            currentImageUrl={avatarUrl}
                                            onImageChange={setAvatarUrl}
                                            userId={`temp-${Date.now()}`}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Datos básicos - Solo mostrar en modo creación */}
                            {!isEditing && (
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="nombre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre Completo *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nombre completo del usuario" {...field} />
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
                                                <FormLabel>Correo Electrónico *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="usuario@ejemplo.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {/* Asignación de cliente */}
                            <FormField
                                control={form.control}
                                name="clienteId"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">
                                                Asignar a Cliente *
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Selecciona el cliente al que tendrá acceso este usuario
                                            </p>
                                        </div>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto border rounded-md p-3"
                                            >
                                                {clientes.map((cliente) => (
                                                    <div key={cliente.id} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={cliente.id} id={cliente.id} />
                                                        <FormLabel
                                                            htmlFor={cliente.id}
                                                            className="text-sm font-normal cursor-pointer flex-1"
                                                        >
                                                            {cliente.nombre}
                                                        </FormLabel>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Estado */}
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Estado del Usuario</FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                {field.value
                                                    ? "Usuario activo - Puede acceder al sistema"
                                                    : "Usuario inactivo - Bloqueado del sistema"}
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
                </ScrollArea>

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
                            ? (isEditing ? "Guardando..." : "Enviando invitación...")
                            : isEditing
                                ? "Actualizar Usuario"
                                : "Enviar Invitación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}