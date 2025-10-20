# 🎛️ Dashboards Terra Energy

## 🚀 Cambiar entre Dashboards (Desarrollo)

Para probar los diferentes dashboards, cambia la constante `USER_TYPE` en estos archivos:

### 1. Sidebar (Navegación)
**Archivo:** `components/dashboard/app-sidebar.tsx`
```typescript
const USER_TYPE: "cliente" | "operacion" = "operacion"; // ← Cambiar aquí
```

### 2. Dashboard Principal
**Archivo:** `app/dashboard/page.tsx`
```typescript
const USER_TYPE: "cliente" | "operacion" = "operacion"; // ← Cambiar aquí
```

---

## 👥 Tipos de Dashboard

### 🏢 Dashboard Cliente
**Para:** Usuarios finales que solicitan inspecciones

**Navegación:**
- 📊 Dashboard - Resumen de solicitudes
- 📄 Mis Solicitudes - Historial completo
- ➕ Nueva Solicitud - Crear inspección
- 📁 Documentos - Informes descargables

**Características:**
- Ver estado de solicitudes
- Crear nuevas solicitudes
- Descargar informes con QR
- Seguimiento en tiempo real

---

### ⚙️ Dashboard Operación
**Para:** Personal interno (operadores e inspectores)

**Navegación:**
- 📊 Dashboard - Vista operativa
- 📋 Solicitudes Pendientes - Bandeja de entrada
- 📅 Calendario - Programación de inspecciones
- ✅ Inspecciones - Gestión de inspecciones
- 👥 Clientes - Administración de clientes
- 📈 Reportes - Estadísticas y análisis
- ⚙️ Configuración - Ajustes del sistema

**Características:**
- Asignar inspectores a solicitudes
- Gestionar calendario de inspecciones
- Ver alertas y reprogramaciones
- Generar informes con branding dual
- Administrar clientes y usuarios

---

## 🎨 Componentes Principales

```
components/dashboard/
├── app-sidebar.tsx           → Sidebar con navegación dinámica
├── dashboard-cliente.tsx     → Vista de dashboard para clientes
├── dashboard-operacion.tsx   → Vista de dashboard para operación
├── nav-main.tsx             → Navegación principal
├── nav-user.tsx             → Menú de usuario con logout
└── team-switcher.tsx        → Logo y branding
```

---

## 📋 Flujo de Inspección

### Cliente:
1. **Crear Solicitud** → Selecciona tipo, completa formulario, define fecha
2. **Esperar Asignación** → Operación asigna inspector
3. **Inspección Realizada** → Inspector ejecuta en campo
4. **Recibir Informe** → PDF con QR descargable

### Operación:
1. **Recibir Solicitud** → Aparece en bandeja de pendientes
2. **Asignar Inspector** → Selecciona inspector y confirma fecha
3. **Monitorear Ejecución** → Seguimiento en calendario
4. **Generar Informe** → PDF con branding dual + QR
5. **Entregar a Cliente** → Notificación automática

---

## 🔮 Próximos Pasos

Ver documentación completa en: `docs/PLAN_IMPLEMENTACION_DASHBOARDS.md`

### Fase 1: Base de Datos
- [ ] Crear tabla `usuarios` con tipo_usuario
- [ ] Crear tabla `clientes`
- [ ] Configurar RLS policies

### Fase 2: Autenticación
- [ ] Implementar hook `useUserType()`
- [ ] Reemplazar constantes hardcoded
- [ ] Agregar loading states

### Fase 3: Funcionalidades
- [ ] Flujo completo de solicitudes
- [ ] Asignación de inspectores
- [ ] Calendario interactivo
- [ ] Generación de PDF con QR

---

## 🎨 Paleta de Colores

La aplicación usa la paleta personalizada de Terra Energy:
- **Primary:** Rojo Toscano (#7c4d3a)
- **Secondary:** Amarillo Pastel (#f7b984)
- **Accent:** MidnightBlue (#86a51)
- **Background:** Crema claro

---

## 📱 Responsive

El sidebar es completamente responsive:
- **Desktop:** Expandido con texto
- **Tablet:** Colapsable a iconos
- **Mobile:** Drawer lateral

---

## 🔐 Seguridad (Futuro)

- RLS en todas las tablas
- Middleware de protección de rutas
- Validación de permisos por tipo de usuario
- Auditoría de acciones críticas
