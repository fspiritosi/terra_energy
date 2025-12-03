# TAREAS ORGANIZADAS

## 1. Formulario de Solicitudes - Visibilidad y Selector para Admins

**Problema actual**:

- Solo los clientes ven el botón "Nueva Solicitud"
- Solo los clientes pueden crear solicitudes (el cliente se infiere automáticamente)

**Solución**:

- Hacer visible el botón para usuarios de operación/admins
- Agregar selector de cliente en el formulario cuando el usuario no es cliente

**Implementación**:

- Modificar `solicitudes-table-wrapper.tsx` para mostrar botón a operación
- Agregar campo select de cliente en `solicitud-form.tsx` para usuarios operación

## 2. CRUD de Equipos de Inspección

**Crear nueva página**: "Equipos de Inspecciones"
**Funcionalidad**: CRUD completo (tabla, modal, editar, eliminar)
**Campos**: `name`, `is_active`, `description` (opcional)
**Integración**: Reemplazar el campo de texto "equipo" en el formulario de solicitudes por un select
**Pendiente**: Crear las tablas en Supabase

## 3. Sistema de Inspecciones con Fechas

**Al aprobar solicitud**: Pedir fecha de entrega/resolución
**Nueva página**: "Listado de Inspecciones"
**Funcionalidad**: CRUD automático + botón "Reprogramar"
**Flujo**: Solicitud aprobada → se convierte en Inspección programada

## 4. Estructura del Sidebar - Item "Inspecciones" con Subitems

**Modificar**: `nav-config.ts` para crear estructura jerárquica
**Item principal**: "Inspecciones"
**Subitems**:

- Equipos de inspecciones
- Listado de inspecciones
- Tipos de inspecciones

## PENDIENTES

- manejar el dar de baja a los clientes (por ahora bloquear las solicitudes)

## 5. Calendario Completo

**Investigar**: Ejemplos de calendario en shadcn/ui
**Funcionalidad**: Mostrar calendario mensual con eventos agrupados por día
**Referencias**:

- https://ui.shadcn.com/view/new-york-v4/sidebar-12
- https://ui.shadcn.com/blocks/sidebar

mostar el calendario como google, elegir la vista de agenda y demas
Salto de linea en los items del

Odenar el sidebar para aagruparlos segun tipo (config)

"use client"

import \* as React from "react"
import { formatDateRange } from "little-date"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const events = [
{
title: "Team Sync Meeting",
from: "2025-06-12T09:00:00",
to: "2025-06-12T10:00:00",
},
{
title: "Design Review",
from: "2025-06-12T11:30:00",
to: "2025-06-12T12:30:00",
},
{
title: "Client Presentation",
from: "2025-06-12T14:00:00",
to: "2025-06-12T15:00:00",
},
]

export function Calendar31() {
const [date, setDate] = React.useState<Date | undefined>(
new Date(2025, 5, 12)
)

return (
<Card className="w-fit py-4">
<CardContent className="px-4">
<Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="bg-transparent p-0"
          required
        />
</CardContent>
<CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">

<div className="flex w-full items-center justify-between px-1">
<div className="text-sm font-medium">
{date?.toLocaleDateString("en-US", {
day: "numeric",
month: "long",
year: "numeric",
})}
</div>
<Button
            variant="ghost"
            size="icon"
            className="size-6"
            title="Add Event"
          >
<PlusIcon />
<span className="sr-only">Add Event</span>
</Button>
</div>
<div className="flex w-full flex-col gap-2">
{events.map((event) => (
<div
              key={event.title}
              className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
<div className="font-medium">{event.title}</div>
<div className="text-muted-foreground text-xs">
{formatDateRange(new Date(event.from), new Date(event.to))}
</div>
</div>
))}
</div>
</CardFooter>
</Card>
)
}

el trabajos a relaizar es opcional
El equipo define el tipo de trbajo
las imagenes no se ven en el deploy
Checklist para las inpecciones
Equipos de inpecciones(cual use para hacer el trajao)
Nueva tabla para equipos del cliente (equipos a inpeccionar) (los que el cliente te pasa)
