"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { TipoInspeccion } from "./actions"

interface TrabajosMultiselectProps {
    trabajos?: TipoInspeccion[]
    selectedIds?: string[]
    onSelectionChange: (selectedIds: string[]) => void
    placeholder?: string
}

export function TrabajosMultiselect({
    trabajos = [],
    selectedIds = [],
    onSelectionChange,
    placeholder = "Seleccionar trabajos..."
}: TrabajosMultiselectProps) {
    const [open, setOpen] = React.useState(false)

    const selectedTrabajos = trabajos.filter(trabajo => selectedIds.includes(trabajo.id))

    const handleSelect = (trabajoId: string) => {
        const newSelection = selectedIds.includes(trabajoId)
            ? selectedIds.filter(id => id !== trabajoId)
            : [...selectedIds, trabajoId]

        onSelectionChange(newSelection)
    }

    const handleRemove = (trabajoId: string) => {
        onSelectionChange(selectedIds.filter(id => id !== trabajoId))
    }

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedIds.length > 0
                            ? `${selectedIds.length} trabajo${selectedIds.length > 1 ? 's' : ''} seleccionado${selectedIds.length > 1 ? 's' : ''}`
                            : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Buscar trabajos..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No se encontraron trabajos.</CommandEmpty>
                            <CommandGroup>
                                {trabajos.length > 0 ? trabajos.map((trabajo) => (
                                    <CommandItem
                                        key={trabajo.id}
                                        value={trabajo.nombre}
                                        onSelect={() => handleSelect(trabajo.id)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedIds.includes(trabajo.id) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{trabajo.nombre}</span>
                                            {trabajo.descripcion && (
                                                <span className="text-xs text-muted-foreground">
                                                    {trabajo.descripcion}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                )) : (
                                    <CommandItem disabled>
                                        Cargando trabajos...
                                    </CommandItem>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Mostrar trabajos seleccionados como badges */}
            {selectedTrabajos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTrabajos.map((trabajo) => (
                        <Badge key={trabajo.id} variant="secondary" className="pr-1">
                            {trabajo.nombre}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemove(trabajo.id)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}