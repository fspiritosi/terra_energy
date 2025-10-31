# 📋 Tareas Pendientes - Sistema de Inspecciones

## 1. ✅ **Restricción Usuario-Cliente (UN SOLO CLIENTE)**

**Estado**: ✅ COMPLETADO
**Descripción**: Modificado el formulario de creación/edición de usuarios para que solo permita seleccionar UN cliente en lugar de múltiples clientes.
**Cambios realizados**:

- ✅ Cambiado de checkboxes (multi-select) a radio buttons (single-select)
- ✅ Actualizado schema de validación: `clienteIds[]` → `clienteId`
- ✅ Modificadas interfaces `CreateUsuarioData` y `UpdateUsuarioData`
- ✅ Actualizada lógica en `createUsuario()` y `updateUsuario()`
- ✅ Instalado componente `radio-group` de shadcn
- ✅ Actualizado texto de UI: "Asignar a Clientes" → "Asignar a Cliente"

---

## 2. ✅ **Botones Aprobar/Rechazar en Modal de Detalles**

**Estado**: 🔄 PENDIENTE
**Descripción**: Agregar botones de "Aprobar" y "Rechazar" en el modal de detalles de solicitud, en lugar de usar solo los botones de acción de la tabla.
**Archivos a modificar**:

- Modal de detalles de solicitud
- Integrar con server actions existentes: `aprobarSolicitud()` y `rechazarSolicitud()`
  **Server Actions**: Ya existen y funcionan ✅

---

## 3. ✅ **Dashboard Funcional con Componentes Asincrónicos**

**Estado**: ✅ COMPLETADO
**Descripción**: Dashboard funcional con componentes asincrónicos individuales, cada uno con su propio fallback de loading.
**Componentes implementados**:

- ✅ **StatsCards**: Widget de estadísticas de solicitudes por estado (total, pendientes, aprobadas, rechazadas)
- ✅ **SolicitudesRecientes**: Widget de últimas 5 solicitudes con datos reales
- ✅ **CrearSolicitudWidget**: Widget para crear nueva solicitud
- ✅ **DashboardCliente**: Dashboard principal que integra todos los widgets
  **Características implementadas**:
- ✅ Cada componente es asíncrono (server component)
- ✅ Cada uno con su propio Suspense y fallback
- ✅ Datos reales desde la base de datos
- ✅ Revalidación automática con revalidatePath

---

## 4. ✅ **Dashboard Cliente - Crear Solicitud + Tabla Recientes**

**Estado**: ✅ COMPLETADO
**Descripción**: Dashboard del cliente con funcionalidad completa para crear solicitudes y mostrar recientes.
**Funcionalidades implementadas**:

- ✅ **Botón "Crear Solicitud"**: Abre el modal existente de crear solicitudes
- ✅ **Tabla "Solicitudes Recientes"**: Muestra las últimas 5 solicitudes del cliente
- ✅ **Revalidación**: Cuando se crea una solicitud, `revalidatePath()` actualiza automáticamente la tabla de recientes
- ✅ **Estadísticas en tiempo real**: Cards con métricas actualizadas
- ✅ **Componentes asincrónicos**: Cada widget carga independientemente con Suspense

---

## 🎯 **Prioridades Sugeridas**:

1. **Alta**: #2 Botones aprobar/rechazar en modal

---

## ✅ **Completadas**:

- ✅ Políticas RLS para que usuarios cliente vean solo sus clientes asignados
- ✅ Header muestra nombre del cliente para usuarios tipo "cliente"
- ✅ Server components para solicitudes (eliminados useEffect y estados)
- ✅ Server actions para aprobar/rechazar solicitudes
- ✅ **AddSolicitudButton revalidation**: Actualizado para revalidar tanto `/dashboard/solicitudes` como `/dashboard` en todas las acciones (crear, actualizar, aprobar, rechazar, eliminar)
- ✅ **Dashboard Cliente completo**: Implementado con widgets funcionales (StatsCards, SolicitudesRecientes, CrearSolicitudWidget)
- ✅ **Dashboard Operación completo**: Implementado con widgets funcionales (StatsCardsOperacion, SolicitudesSinAsignar, ActividadRecienteOperacion, AccionesRapidasOperacion)
- ✅ **Componentes asincrónicos**: Todos los widgets del dashboard son server components con Suspense y datos reales
- ✅ **Revalidación automática**: Los dashboards se actualizan automáticamente cuando se crean/modifican solicitudes
- ✅ **Fix error fetch cliente**: Corregido error al intentar obtener info de cliente para usuarios no-cliente
- ✅ **Nomenclatura de solicitudes mejorada**: Cambiado de SOL-2025-001 a SOL-[INICIALES_CLIENTE]-001 (ej: SOL-EDSE-001 para "Empresa Demo S.A.")
- ✅ **Restricción usuario-cliente**: Cambiado formulario de usuarios para permitir solo UN cliente por usuario (radio buttons en lugar de checkboxes)
