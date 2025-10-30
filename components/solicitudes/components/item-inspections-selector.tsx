"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ItemInspectionType } from "./actions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface ItemInspectionsSelectorProps {
    inspectionTypes: ItemInspectionType[]
    selectedInspections: string[]
    onSelectionChange: (selectedIds: string[]) => void
    disabled?: boolean
}

export function ItemInspectionsSelector({
    inspectionTypes,
    selectedInspections,
    onSelectionChange,
    disabled = false
}: ItemInspectionsSelectorProps) {
    const handleInspectionToggle = (inspectionId: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selectedInspections, inspectionId])
        } else {
            onSelectionChange(selectedInspections.filter(id => id !== inspectionId))
        }
    }

    return (
        <TooltipProvider>
            <div className="space-y-3">
                <Label className="text-sm font-medium">Tipos de Inspección</Label>

                {/* Leyenda de códigos */}
                <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1">
                    <p className="font-medium">Leyenda:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {inspectionTypes.map((type) => (
                            <div key={type.id} className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                    {type.codigo}
                                </Badge>
                                <span>{type.descripcion || type.nombre}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selector de inspecciones */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {inspectionTypes.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`inspection-${type.id}`}
                                checked={selectedInspections.includes(type.id)}
                                onCheckedChange={(checked) =>
                                    handleInspectionToggle(type.id, checked as boolean)
                                }
                                disabled={disabled}
                            />
                            <div className="flex items-center gap-1">
                                <Label
                                    htmlFor={`inspection-${type.id}`}
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    {type.codigo}
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="max-w-xs">
                                            <p className="font-medium">{type.nombre}</p>
                                            <p className="text-xs">{type.descripcion || type.nombre}</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen de selecciones */}
                {selectedInspections.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {selectedInspections.map((inspectionId) => {
                            const type = inspectionTypes.find(t => t.id === inspectionId)
                            return type ? (
                                <Badge key={inspectionId} variant="secondary" className="text-xs">
                                    {type.codigo}
                                </Badge>
                            ) : null
                        })}
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}