"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"
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

interface ItemsManagerProps {
    items: SolicitudItem[]
    onItemsChange: (items: SolicitudItem[]) => void
}

export function ItemsManager({ items, onItemsChange }: ItemsManagerProps) {
    const [inspectionTypes, setInspectionTypes] = useState<ItemInspectionType[]>([])
    const [loading, setLoading] = useState(true)

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

    const addItem = () => {
        const newItem: SolicitudItem = {
            descripcion: "",
            cantidad: 1,
            inspections: []
        }
        onItemsChange([...items, newItem])
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        onItemsChange(newItems)
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
                {items.map((item, index) => (
                    <Card key={index}>
                        <Accordion type="multiple">
                            <AccordionItem value={`${index}`} className="border-none">
                                <div className="flex items-center justify-between p-6 pb-3">
                                    <AccordionTrigger className="flex-1 text-left hover:no-underline p-0">
                                        <CardTitle className="text-base">
                                            {item.descripcion ? item.descripcion : `Item ${index + 1}`}
                                            {item.descripcion && ` (# ${item.cantidad})`}
                                        </CardTitle>
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
                                                />
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
                                                />
                                            </div>
                                        </div>

                                        {/* Selector de inspecciones */}
                                        <ItemInspectionsSelector
                                            inspectionTypes={inspectionTypes}
                                            selectedInspections={item.inspections || []}
                                            onSelectionChange={(inspections) => updateItemInspections(index, inspections)}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Card>
                ))}
            </div>
            {items.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    Total de items: {items.length}
                </div>
            )}
        </div>
    )
}