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
import { SolicitudImagesUpload, SolicitudImage } from "./solicitud-images-upload"
import { useUserType } from "@/hooks/use-user-type"
import moment from "moment-timezone"

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires'
import { useUserCliente } from "@/hooks/use-user-cliente"
import { Solicitud, TipoInspeccion, ClienteOption } from "./actions"
import { SolicitudItem } from "./solicitud-actions"
import { Equipo } from "@/components/equipos/components/actions"

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
    trabajos_ids: z.array(z.string()).min(1, "Debe seleccionar al menos un trabajo"),
    images: z.array(z.any()).optional() // Las imágenes son opcionales
})

type SolicitudFormData = z.infer<typeof solicitudSchema>

interface SolicitudFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    solicitud?: Solicitud | null
    clientes: ClienteOption[]
    trabajos: TipoInspeccion[]
    equipos: Equipo[]
    isLoadingClientes?: boolean
    isLoadingTrabajos?: boolean
    isLoadingEquipos?: boolean
    onSubmit: (data: SolicitudFormData) => Promise<void>
    isLoading?: boolean
}

export function SolicitudForm({
    open,
    onOpenChange,
    solicitud,
    clientes,
    trabajos,
    equipos,
    isLoadingClientes = false,
    isLoadingTrabajos = false,
    isLoadingEquipos = false,
    onSubmit,
    isLoading = false,
}: SolicitudFormProps) {
    const isEditing = !!solicitud
    const { userProfile } = useUserType()
    const { clienteId: clienteIdFromUser, isLoading: isLoadingClienteId } = useUserCliente()
    const [items, setItems] = React.useState<SolicitudItem[]>([])
    const [images, setImages] = React.useState<SolicitudImage[]>([])

    // Obtener cliente_id del usuario logueado si es cliente
    const finalClienteId = React.useMemo(() => {
        if (userProfile?.user_type === "cliente") {
            return clienteIdFromUser || ""
        }
        return ""
    }, [userProfile, clienteIdFromUser])

    const form = useForm<SolicitudFormData>({
        resolver: zodResolver(solicitudSchema),
        defaultValues: {
            cliente_id: finalClienteId,
            lugar: "",
            responsable: "",
            equipo: "",
            fecha_entrega_deseada: "",
            requisitos_adicionales: "",
            items: [],
            trabajos_ids: [],
            images: [],
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

                // Convertir imágenes existentes al formato del componente
                const existingImages: SolicitudImage[] = (solicitud.imagenes || []).map(img => {
                    // Verificar si la URL es válida, si no, intentar reconstruirla
                    const imageUrl = img.imagen_url;

                    // Si la URL no contiene el dominio de Supabase, podría ser solo el path
                    if (!imageUrl.includes('supabase') && !imageUrl.startsWith('http')) {
                        // Reconstruir la URL usando el cliente de Supabase
                        console.warn("⚠️ URL de imagen incompleta, reconstruyendo:", imageUrl);
                        // Por ahora usar la URL tal como está, pero esto podría necesitar corrección
                    }

                    return {
                        id: img.id,
                        url: imageUrl,
                        fileName: img.nombre_archivo,
                        orden: img.orden || 1,
                        isNew: false,
                    };
                })

                // Ordenar las imágenes por orden
                existingImages.sort((a, b) => a.orden - b.orden);



                form.reset({
                    cliente_id: solicitud.cliente_id,
                    lugar: solicitud.lugar,
                    responsable: solicitud.responsable,
                    equipo: solicitud.equipo,
                    fecha_entrega_deseada: solicitud.fecha_entrega_deseada,
                    requisitos_adicionales: solicitud.requisitos_adicionales || "",
                    items: itemsWithInspections,
                    trabajos_ids: trabajosIds as string[],
                    images: [],
                })
                setItems(itemsWithInspections)
                setImages(existingImages)
            } else {
                // Modo creación
                form.reset({
                    cliente_id: finalClienteId,
                    lugar: "",
                    responsable: "",
                    equipo: "",
                    fecha_entrega_deseada: "",
                    requisitos_adicionales: "",
                    items: [],
                    trabajos_ids: [],
                    images: [],
                })
                setItems([])
                setImages([])
            }
        }
    }, [open, solicitud, form, finalClienteId])

    // Sincronizar items con el formulario
    React.useEffect(() => {
        const itemsWithInspections = items.map(item => ({
            ...item,
            inspections: item.inspections || []
        }))
        form.setValue("items", itemsWithInspections)
    }, [items, form])

    // Sincronizar imágenes con el formulario
    React.useEffect(() => {
        const processImages = async () => {
            const imageData = await Promise.all(
                images.map(async (img) => {
                    // Si la imagen tiene un archivo nuevo, convertir a formato serializable (base64)
                    if (img.file && img.isNew) {
                        try {
                            const arrayBuffer = await img.file.arrayBuffer();
                            const uint8Array = new Uint8Array(arrayBuffer);
                            
                            // Convertir ArrayBuffer a base64 de forma segura
                            let binary = '';
                            for (let i = 0; i < uint8Array.length; i++) {
                                binary += String.fromCharCode(uint8Array[i]);
                            }
                            const base64 = btoa(binary);
                            
                            return {
                                fileData: {
                                    base64,
                                    type: img.file.type,
                                    name: img.file.name,
                                },
                                url: img.url,
                                fileName: img.fileName,
                                orden: img.orden,
                                id: img.id,
                                toDelete: img.toDelete,
                            };
                        } catch (error) {
                            console.error("Error convirtiendo imagen a base64:", error);
                            // Si hay error, retornar solo metadatos sin fileData
                            return {
                                url: img.url,
                                fileName: img.fileName,
                                orden: img.orden,
                                id: img.id,
                                toDelete: img.toDelete,
                            };
                        }
                    }
                    // Para imágenes existentes, solo pasar los metadatos
                    return {
                        url: img.url,
                        fileName: img.fileName,
                        orden: img.orden,
                        id: img.id,
                        toDelete: img.toDelete,
                    };
                })
            );
            form.setValue("images", imageData);
        };

        processImages();
    }, [images, form])

    const handleSubmit = async (data: SolicitudFormData) => {
        try {
            // Procesar imágenes justo antes de enviar para asegurar que estén en el formato correcto
            const processedImages = await Promise.all(
                images.map(async (img) => {
                    // Si la imagen tiene un archivo nuevo, convertir a formato serializable (base64)
                    if (img.file && img.isNew) {
                        try {
                            const arrayBuffer = await img.file.arrayBuffer();
                            const uint8Array = new Uint8Array(arrayBuffer);
                            
                            // Convertir ArrayBuffer a base64 de forma segura
                            let binary = '';
                            for (let i = 0; i < uint8Array.length; i++) {
                                binary += String.fromCharCode(uint8Array[i]);
                            }
                            const base64 = btoa(binary);
                            
                            return {
                                fileData: {
                                    base64,
                                    type: img.file.type,
                                    name: img.file.name,
                                },
                                url: img.url,
                                fileName: img.fileName,
                                orden: img.orden,
                                id: img.id,
                                toDelete: img.toDelete,
                            };
                        } catch (error) {
                            console.error("Error convirtiendo imagen a base64:", error);
                            // Si hay error, retornar solo metadatos sin fileData
                            return {
                                url: img.url,
                                fileName: img.fileName,
                                orden: img.orden,
                                id: img.id,
                                toDelete: img.toDelete,
                            };
                        }
                    }
                    // Para imágenes existentes, solo pasar los metadatos
                    return {
                        url: img.url,
                        fileName: img.fileName,
                        orden: img.orden,
                        id: img.id,
                        toDelete: img.toDelete,
                    };
                })
            );

            // Combinar los datos del formulario con las imágenes procesadas
            const dataWithImages = {
                ...data,
                images: processedImages,
            };

            await onSubmit(dataWithImages)
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
                                                    disabled={isLoadingClientes}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">
                                                        {isLoadingClientes ? "Cargando clientes..." : "Seleccionar cliente..."}
                                                    </option>
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
                                        {isLoadingClienteId
                                            ? "Cargando información del cliente..."
                                            : clientes.find(c => c.id === finalClienteId)?.nombre || "Cliente no encontrado"
                                        }
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
                                                <select
                                                    {...field}
                                                    disabled={isLoadingEquipos}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">
                                                        {isLoadingEquipos ? "Cargando equipos..." : "Seleccionar equipo..."}
                                                    </option>
                                                    {equipos.filter(equipo => equipo.is_active).map(equipo => (
                                                        <option key={equipo.id} value={equipo.name}>
                                                            {equipo.name}
                                                        </option>
                                                    ))}
                                                </select>
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
                                                    min={moment.tz(TIMEZONE_ARGENTINA).format('YYYY-MM-DD')}
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
                                                placeholder={isLoadingTrabajos ? "Cargando trabajos..." : "Seleccionar tipos de inspección..."}
                                                isLoading={isLoadingTrabajos}
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

                            {/* Imágenes */}
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem>
                                        <SolicitudImagesUpload
                                            images={images}
                                            onImagesChange={setImages}
                                            disabled={isLoading || (isEditing && solicitud?.estado !== "pendiente")}
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