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

## 5. Calendario Completo

**Investigar**: Ejemplos de calendario en shadcn/ui
**Funcionalidad**: Mostrar calendario mensual con eventos agrupados por día
**Referencias**:

- https://ui.shadcn.com/view/new-york-v4/sidebar-12
- https://ui.shadcn.com/blocks/sidebar

## PENDIENTES

- manejar el dar de baja a los clientes (por ahora bloquear las solicitudes)
