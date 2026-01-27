"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, AlertCircle } from "lucide-react"
import { SolicitudItem } from "./solicitud-actions"
import { ItemInspectionType, getItemInspectionTypes } from "./actions"
import { ItemInspectionsSelector } from "./item-inspections-selector"
import { Card, CardTitle } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form"

type ItemError = {
    descripcion?: FieldError
    cantidad?: FieldError
    inspections?: FieldError | Merge<FieldError, FieldErrorsImpl<string[]>>
}

interface ItemsManagerProps {
    items: SolicitudItem[]
    onItemsChange: (items: SolicitudItem[]) => void
    errors?: Merge<FieldError, (ItemError | undefined)[]> | FieldError
}

export function ItemsManager({ items, onItemsChange, errors }: ItemsManagerProps) {
    const [inspectionTypes, setInspectionTypes] = useState<ItemInspectionType[]>([])
    const [loading, setLoading] = useState(true)
    const [openAccordions, setOpenAccordions] = useState<string[]>([])

    // Obtener errores como array si existe
    const itemErrors = errors && Array.isArray(errors) ? errors : []

    // Función para verificar si un item tiene errores
    const hasItemError = (index: number): boolean => {
        if (!itemErrors[index]) return false
        const err = itemErrors[index] as ItemError
        return !!(err?.descripcion || err?.cantidad || err?.inspections)
    }

    // Abrir automáticamente acordeones con errores
    useEffect(() => {
        if (itemErrors.length > 0) {
            const indicesWithErrors: string[] = []
            itemErrors.forEach((err, index) => {
                if (err && (err.descripcion || err.cantidad || err.inspections)) {
                    indicesWithErrors.push(index.toString())
                }
            })
            if (indicesWithErrors.length > 0) {
                setOpenAccordions(prev => {
                    const newOpen = [...new Set([...prev, ...indicesWithErrors])]
                    return newOpen
                })
            }
        }
    }, [itemErrors])

    // Cargar tipos de inspección
    useEffect(() => {
        const loadInspectionTypes = async () => {
            try {
                const types = await getItemInspectionTypes()
                setInspectionTypes(types)
            } catch (error) {
                console.error("Error loading inspection types:", error)
            } finally {
                setLoading(false)
            }
        }
        loadInspectionTypes()
    }, [])

    // Resetear acordeones abiertos cuando cambian los items externamente (ej: modo edición)
    useEffect(() => {
        // Solo resetear si no hay acordeones abiertos (evitar conflictos con addItem)
        if (openAccordions.length === 0 && items.length > 0) {
            // En modo edición, no abrir ningún acordeón por defecto
            setOpenAccordions([])
        }
    }, [items.length, openAccordions.length])

    const addItem = () => {
        const newItem: SolicitudItem = {
            descripcion: "",
            cantidad: 1,
            inspections: []
        }
        const newItems = [...items, newItem]
        onItemsChange(newItems)

        // Abrir automáticamente el acordeón del nuevo item
        const newItemIndex = newItems.length - 1
        setOpenAccordions(prev => [...prev, newItemIndex.toString()])
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        onItemsChange(newItems)

        // Remover el acordeón de la lista de abiertos y reajustar índices
        setOpenAccordions(prev =>
            prev
                .filter(value => value !== index.toString())
                .map(value => {
                    const numValue = parseInt(value)
                    return numValue > index ? (numValue - 1).toString() : value
                })
        )
    }

    const updateItem = (index: number, field: keyof SolicitudItem, value: string | number | string[]) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value }
            }
            return item
        })
        onItemsChange(newItems)
    }

    const updateItemInspections = (index: number, inspections: string[]) => {
        updateItem(index, 'inspections', inspections)
    }

    if (loading) {
        return <div className="text-center py-4">Cargando tipos de inspección...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base">Items a Inspeccionar</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Item
                </Button>
            </div>

            {items.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No hay items agregados</p>
                    <p className="text-sm">Haz click en Agregar Item para comenzar</p>
                </div>
            )}

            <div className="space-y-4">
                {items.map((item, index) => {
                    const itemError = itemErrors[index] as ItemError | undefined
                    const hasError = hasItemError(index)

                    return (
                    <Card key={index} className={hasError ? "border-red-500 border-2" : ""}>
                        <Accordion
                            type="multiple"
                            value={openAccordions}
                            onValueChange={setOpenAccordions}
                        >
                            <AccordionItem value={`${index}`} className="border-none">
                                <div className="flex items-center justify-between p-6">
                                    <AccordionTrigger className="flex-1 text-left hover:no-underline p-0">
                                        <div className="flex items-center gap-2">
                                            {hasError && (
                                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                            )}
                                            <CardTitle className={`text-base ${hasError ? "text-red-500" : ""}`}>
                                                {item.descripcion ? item.descripcion : `Item ${index + 1}`}
                                                {item.descripcion && ` (# ${item.cantidad})`}
                                                {hasError && !openAccordions.includes(index.toString()) && (
                                                    <span className="text-sm font-normal ml-2">- Faltan datos</span>
                                                )}
                                            </CardTitle>
                                        </div>
                                    </AccordionTrigger>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeItem(index)}
                                        className="text-red-600 hover:text-red-700 ml-4"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <AccordionContent className="px-6 pb-6 pt-0">
                                    <div className="space-y-4">
                                        {/* Información básica del item */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div className="md:col-span-3">
                                                <Label htmlFor={`descripcion-${index}`} className="text-sm">
                                                    Descripción del elemento e identificación *
                                                </Label>
                                                <Input
                                                    id={`descripcion-${index}`}
                                                    placeholder="Ej: CONJUNTO PERCHA DE IZAJE 5 1/8"
                                                    value={item.descripcion}
                                                    onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                                                    className={itemError?.descripcion ? "border-red-500" : ""}
                                                />
                                                {itemError?.descripcion && (
                                                    <p className="text-sm text-red-500 mt-1">{itemError.descripcion.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor={`cantidad-${index}`} className="text-sm">
                                                    Cantidad *
                                                </Label>
                                                <Input
                                                    id={`cantidad-${index}`}
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                                                    className={itemError?.cantidad ? "border-red-500" : ""}
                                                />
                                                {itemError?.cantidad && (
                                                    <p className="text-sm text-red-500 mt-1">{itemError.cantidad.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Selector de inspecciones */}
                                        <div>
                                            <ItemInspectionsSelector
                                                inspectionTypes={inspectionTypes}
                                                selectedInspections={item.inspections || []}
                                                onSelectionChange={(inspections) => updateItemInspections(index, inspections)}
                                                disabled={loading}
                                                hasError={!!itemError?.inspections}
                                            />
                                            {itemError?.inspections && (
                                                <p className="text-sm text-red-500 mt-1">Debe seleccionar al menos un tipo de inspección</p>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Card>
                    )
                })}
            </div>
            {items.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    Total de items: {items.length}
                </div>
            )}
        </div>
    )
}