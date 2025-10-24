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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageUpload } from "@/components/profile/image-upload"
import { Usuario, ClienteOption } from "./actions"

// Schema unificado con campos opcionales
const usuarioSchema = z.object({
    nombre: z.string().optional(),
    email: z.string().optional(),
    avatar_url: z.string().optional(),
    clienteIds: z.array(z.string()).min(1, "Debe seleccionar al menos un cliente"),
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
            clienteIds: [],
            is_active: true,
        },
    })

    // Resetear el formulario cuando cambie el usuario o se abra/cierre el modal
    React.useEffect(() => {
        if (open) {
            if (usuario) {
                const clienteIds = usuario.clientes?.map(c => c.id) || []
                form.reset({
                    nombre: usuario.nombre || "",
                    email: usuario.email || "",
                    avatar_url: usuario.avatar_url || "",
                    clienteIds,
                    is_active: usuario.is_active,
                })
                setAvatarUrl(usuario.avatar_url || "")
            } else {
                form.reset({
                    nombre: "",
                    email: "",
                    avatar_url: "",
                    clienteIds: [],
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
                // En modo edición, solo enviar clienteIds y is_active
                await onSubmit({
                    clienteIds: data.clienteIds,
                    is_active: data.is_active
                })
            } else {
                // En modo creación, incluir todos los campos
                await onSubmit({
                    nombre: data.nombre,
                    email: data.email,
                    avatar_url: avatarUrl,
                    clienteIds: data.clienteIds,
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
                        {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica las asignaciones de clientes y el estado del usuario. Los datos personales no se pueden editar desde aquí."
                            : "Completa los datos para crear un nuevo usuario y asignarlo a clientes."}
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

                            {/* Asignación de clientes */}
                            <FormField
                                control={form.control}
                                name="clienteIds"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">
                                                Asignar a Clientes *
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Selecciona los clientes a los que tendrá acceso este usuario
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto border rounded-md p-3">
                                            {clientes.map((cliente) => (
                                                <FormField
                                                    key={cliente.id}
                                                    control={form.control}
                                                    name="clienteIds"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={cliente.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(cliente.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, cliente.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== cliente.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal cursor-pointer">
                                                                    {cliente.nombre}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
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
                            ? "Guardando..."
                            : isEditing
                                ? "Actualizar Usuario"
                                : "Crear Usuario"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}