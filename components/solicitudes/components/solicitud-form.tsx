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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ItemsManager } from "./items-manager"
import { TrabajosMultiselect } from "./trabajos-multiselect"
import { useUserType } from "@/hooks/use-user-type"
import { Solicitud, TipoInspeccion, ClienteOption } from "./actions"
import { SolicitudItem } from "./solicitud-actions"

const solicitudSchema = z.object({
    cliente_id: z.string().min(1, "Debe seleccionar un cliente"),
    lugar: z.string().min(1, "El lugar es requerido"),
    responsable: z.string().min(1, "El responsable es requerido"),
    equipo: z.string().min(1, "El equipo es requerido"),
    fecha_entrega_deseada: z.string().min(1, "La fecha de entrega es requerida"),
    requisitos_adicionales: z.string().optional(),
    items: z.array(z.object({
        descripcion: z.string().min(1, "La descripción es requerida"),
        cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
        inspections: z.array(z.string()).min(1, "Debe seleccionar al menos un tipo de inspección")
    })).min(1, "Debe agregar al menos un item"),
    trabajos_ids: z.array(z.string()).min(1, "Debe seleccionar al menos un trabajo")
})

type SolicitudFormData = z.infer<typeof solicitudSchema>

interface SolicitudFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    solicitud?: Solicitud | null
    clientes: ClienteOption[]
    trabajos: TipoInspeccion[]
    onSubmit: (data: SolicitudFormData) => Promise<void>
    isLoading?: boolean
}

export function SolicitudForm({
    open,
    onOpenChange,
    solicitud,
    clientes,
    trabajos,
    onSubmit,
    isLoading = false,
}: SolicitudFormProps) {
    const isEditing = !!solicitud
    const { userProfile } = useUserType()
    const [items, setItems] = React.useState<SolicitudItem[]>([])

    // Obtener cliente_id del usuario logueado si es cliente
    const clienteIdFromUser = React.useMemo(() => {
        if (userProfile?.user_type === "cliente") {
            // TODO: Obtener cliente_id desde usuarios_clientes
            return clientes[0]?.id || ""
        }
        return ""
    }, [userProfile, clientes])

    const form = useForm<SolicitudFormData>({
        resolver: zodResolver(solicitudSchema),
        defaultValues: {
            cliente_id: clienteIdFromUser,
            lugar: "",
            responsable: "",
            equipo: "",
            fecha_entrega_deseada: "",
            requisitos_adicionales: "",
            items: [],
            trabajos_ids: [],
        },
    })

    // Resetear formulario cuando se abre/cierra o cambia la solicitud
    React.useEffect(() => {
        if (open) {
            if (solicitud) {
                // Modo edición
                const trabajosIds = solicitud.trabajos?.map(t => t.tipo_inspeccion?.id).filter(Boolean) || []

                // Convertir items con inspecciones al formato del formulario
                const itemsWithInspections = (solicitud.items || []).map(item => ({
                    descripcion: item.descripcion,
                    cantidad: item.cantidad,
                    inspections: item.inspections?.map(insp => insp.inspection_type?.id).filter((id): id is string => Boolean(id)) || []
                }))

                form.reset({
                    cliente_id: solicitud.cliente_id,
                    lugar: solicitud.lugar,
                    responsable: solicitud.responsable,
                    equipo: solicitud.equipo,
                    fecha_entrega_deseada: solicitud.fecha_entrega_deseada,
                    requisitos_adicionales: solicitud.requisitos_adicionales || "",
                    items: itemsWithInspections,
                    trabajos_ids: trabajosIds as string[],
                })
                setItems(itemsWithInspections)
            } else {
                // Modo creación
                form.reset({
                    cliente_id: clienteIdFromUser,
                    lugar: "",
                    responsable: "",
                    equipo: "",
                    fecha_entrega_deseada: "",
                    requisitos_adicionales: "",
                    items: [],
                    trabajos_ids: [],
                })
                setItems([])
            }
        }
    }, [open, solicitud, form, clienteIdFromUser])

    // Sincronizar items con el formulario
    React.useEffect(() => {
        const itemsWithInspections = items.map(item => ({
            ...item,
            inspections: item.inspections || []
        }))
        form.setValue("items", itemsWithInspections)
    }, [items, form])

    const handleSubmit = async (data: SolicitudFormData) => {
        try {
            await onSubmit(data)
            onOpenChange(false)
        } catch (error) {
            console.error("Error al guardar solicitud:", error)
        }
    }

    const isCliente = userProfile?.user_type === "cliente"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Solicitud" : "Nueva Solicitud de Inspección"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica los datos de la solicitud de inspección."
                            : "Completa los datos para crear una nueva solicitud de inspección."}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            {/* Cliente - Solo mostrar select si es operador */}
                            {!isCliente && (
                                <FormField
                                    control={form.control}
                                    name="cliente_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cliente *</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Seleccionar cliente...</option>
                                                    {clientes.map(cliente => (
                                                        <option key={cliente.id} value={cliente.id}>
                                                            {cliente.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Información del cliente si es usuario cliente */}
                            {isCliente && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h3 className="font-medium">Información del Cliente</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {clientes.find(c => c.id === clienteIdFromUser)?.nombre || "Cliente no encontrado"}
                                    </p>
                                </div>
                            )}

                            {/* Datos básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="lugar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lugar *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ubicación de la inspección" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="responsable"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Responsable *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre del responsable" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="equipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Equipo *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Equipo a inspeccionar" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fecha_entrega_deseada"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Entrega Deseada *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Trabajos a realizar */}
                            <FormField
                                control={form.control}
                                name="trabajos_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trabajos a Realizar *</FormLabel>
                                        <FormControl>
                                            <TrabajosMultiselect
                                                trabajos={trabajos}
                                                selectedIds={field.value}
                                                onSelectionChange={field.onChange}
                                                placeholder="Seleccionar tipos de inspección..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Items */}
                            <FormField
                                control={form.control}
                                name="items"
                                render={() => (
                                    <FormItem>
                                        <ItemsManager
                                            items={items}
                                            onItemsChange={setItems}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Requisitos adicionales */}
                            <FormField
                                control={form.control}
                                name="requisitos_adicionales"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Requisitos Adicionales</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Requisitos adicionales del pedido..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                ? "Actualizar Solicitud"
                                : "Crear Solicitud"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}