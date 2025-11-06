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

Ejemplo de codigo
import { AppSidebar } from "@/components/app-sidebar"
import {
Breadcrumb,
BreadcrumbItem,
BreadcrumbList,
BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
SidebarInset,
SidebarProvider,
SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
return (
<SidebarProvider>
<AppSidebar />
<SidebarInset>

<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
<SidebarTrigger className="-ml-1" />
<Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
<Breadcrumb>
<BreadcrumbList>
<BreadcrumbItem>
<BreadcrumbPage>October 2024</BreadcrumbPage>
</BreadcrumbItem>
</BreadcrumbList>
</Breadcrumb>
</header>
<div className="flex flex-1 flex-col gap-4 p-4">
<div className="grid auto-rows-min gap-4 md:grid-cols-5">
{Array.from({ length: 20 }).map((\_, i) => (
<div key={i} className="bg-muted/50 aspect-square rounded-xl" />
))}
</div>
</div>
</SidebarInset>
</SidebarProvider>
)
}

import \* as React from "react"
import { Plus } from "lucide-react"

import { Calendars } from "@/components/calendars"
import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
Sidebar,
SidebarContent,
SidebarFooter,
SidebarHeader,
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
SidebarRail,
SidebarSeparator,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
user: {
name: "shadcn",
email: "m@example.com",
avatar: "/avatars/shadcn.jpg",
},
calendars: [
{
name: "My Calendars",
items: ["Personal", "Work", "Family"],
},
{
name: "Favorites",
items: ["Holidays", "Birthdays"],
},
{
name: "Other",
items: ["Travel", "Reminders", "Deadlines"],
},
],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
return (
<Sidebar {...props}>
<SidebarHeader className="border-sidebar-border h-16 border-b">
<NavUser user={data.user} />
</SidebarHeader>
<SidebarContent>
<DatePicker />
<SidebarSeparator className="mx-0" />
<Calendars calendars={data.calendars} />
</SidebarContent>
<SidebarFooter>
<SidebarMenu>
<SidebarMenuItem>
<SidebarMenuButton>
<Plus />
<span>New Calendar</span>
</SidebarMenuButton>
</SidebarMenuItem>
</SidebarMenu>
</SidebarFooter>
<SidebarRail />
</Sidebar>
)
}

import \* as React from "react"
import { Check, ChevronRight } from "lucide-react"

import {
Collapsible,
CollapsibleContent,
CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
SidebarGroup,
SidebarGroupContent,
SidebarGroupLabel,
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
SidebarSeparator,
} from "@/components/ui/sidebar"

export function Calendars({
calendars,
}: {
calendars: {
name: string
items: string[]
}[]
}) {
return (
<>
{calendars.map((calendar, index) => (
<React.Fragment key={calendar.name}>
<SidebarGroup key={calendar.name} className="py-0">
<Collapsible
defaultOpen={index === 0}
className="group/collapsible" >
<SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm"
              >
<CollapsibleTrigger>
{calendar.name}{" "}
<ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
</CollapsibleTrigger>
</SidebarGroupLabel>
<CollapsibleContent>
<SidebarGroupContent>
<SidebarMenu>
{calendar.items.map((item, index) => (
<SidebarMenuItem key={item}>
<SidebarMenuButton>
<div
data-active={index < 2}
className="group/calendar-item border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border" >
<Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
</div>
{item}
</SidebarMenuButton>
</SidebarMenuItem>
))}
</SidebarMenu>
</SidebarGroupContent>
</CollapsibleContent>
</Collapsible>
</SidebarGroup>
<SidebarSeparator className="mx-0" />
</React.Fragment>
))}
</>
)
}
import { Calendar } from "@/components/ui/calendar"
import {
SidebarGroup,
SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DatePicker() {
return (
<SidebarGroup className="px-0">
<SidebarGroupContent>
<Calendar className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]" />
</SidebarGroupContent>
</SidebarGroup>
)
}
"use client"

import {
BadgeCheck,
Bell,
ChevronsUpDown,
CreditCard,
LogOut,
Sparkles,
} from "lucide-react"

import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar"
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
user,
}: {
user: {
name: string
email: string
avatar: string
}
}) {
const { isMobile } = useSidebar()

return (
<SidebarMenu>
<SidebarMenuItem>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
<Avatar className="h-8 w-8 rounded-lg">
<AvatarImage src={user.avatar} alt={user.name} />
<AvatarFallback className="rounded-lg">CN</AvatarFallback>
</Avatar>
<div className="grid flex-1 text-left text-sm leading-tight">
<span className="truncate font-medium">{user.name}</span>
<span className="truncate text-xs">{user.email}</span>
</div>
<ChevronsUpDown className="ml-auto size-4" />
</SidebarMenuButton>
</DropdownMenuTrigger>
<DropdownMenuContent
className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
side={isMobile ? "bottom" : "right"}
align="start"
sideOffset={4} >
<DropdownMenuLabel className="p-0 font-normal">
<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
<Avatar className="h-8 w-8 rounded-lg">
<AvatarImage src={user.avatar} alt={user.name} />
<AvatarFallback className="rounded-lg">CN</AvatarFallback>
</Avatar>
<div className="grid flex-1 text-left text-sm leading-tight">
<span className="truncate font-medium">{user.name}</span>
<span className="truncate text-xs">{user.email}</span>
</div>
</div>
</DropdownMenuLabel>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<Sparkles />
Upgrade to Pro
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuGroup>
<DropdownMenuItem>
<BadgeCheck />
Account
</DropdownMenuItem>
<DropdownMenuItem>
<CreditCard />
Billing
</DropdownMenuItem>
<DropdownMenuItem>
<Bell />
Notifications
</DropdownMenuItem>
</DropdownMenuGroup>
<DropdownMenuSeparator />
<DropdownMenuItem>
<LogOut />
Log out
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</SidebarMenuItem>
</SidebarMenu>
)
}
