# Sistema de Solicitudes de Inspección

## Descripción General

El sistema de solicitudes de inspección permite a los clientes crear solicitudes para inspeccionar equipos industriales, y a los operadores gestionar y aprobar estas solicitudes. Cada solicitud puede contener múltiples items, y cada item puede tener múltiples tipos de inspección específicos.

## Arquitectura de Base de Datos

### Tablas Principales

#### 1. `solicitudes_inspeccion`

Tabla principal que almacena la información general de cada solicitud.

```sql
CREATE TABLE solicitudes_inspeccion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_solicitud VARCHAR UNIQUE NOT NULL,
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    user_id UUID REFERENCES auth.users(id),
    lugar VARCHAR NOT NULL,
    responsable VARCHAR NOT NULL,
    equipo VARCHAR NOT NULL,
    fecha_solicitud DATE DEFAULT CURRENT_DATE,
    fecha_entrega_deseada DATE NOT NULL,
    requisitos_adicionales TEXT,
    estado VARCHAR DEFAULT 'pendiente',
    aprobada_por UUID REFERENCES auth.users(id),
    fecha_aprobacion TIMESTAMP,
    comentarios_aprobacion TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

#### 2. `solicitud_items`

Almacena los items individuales que forman parte de una solicitud.

```sql
CREATE TABLE solicitud_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id UUID NOT NULL REFERENCES solicitudes_inspeccion(id) ON DELETE CASCADE,
    descripcion VARCHAR NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `item_inspection_types`

Catálogo de tipos de inspección disponibles para los items.

```sql
CREATE TABLE item_inspection_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. `solicitud_item_inspections`

Tabla de relación many-to-many entre items y tipos de inspección.

```sql
CREATE TABLE solicitud_item_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_item_id UUID NOT NULL REFERENCES solicitud_items(id) ON DELETE CASCADE,
    inspection_type_id UUID NOT NULL REFERENCES item_inspection_types(id) ON DELETE CASCADE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(solicitud_item_id, inspection_type_id)
);
```

#### 5. `solicitud_trabajos`

Relaciona las solicitudes con los tipos de inspección generales (trabajos a realizar).

```sql
CREATE TABLE solicitud_trabajos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id UUID NOT NULL REFERENCES solicitudes_inspeccion(id) ON DELETE CASCADE,
    tipo_inspeccion_id UUID NOT NULL REFERENCES tipo_de_inspeccion(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tipos de Inspección de Items

El sistema incluye 14 tipos de inspección específicos para items:

| Código  | Nombre                  | Descripción                                                                                |
| ------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| **LM**  | Limpieza mecánica       | Limpieza mecánica del elemento                                                             |
| **AC**  | Acerado                 | Proceso de acerado                                                                         |
| **DA**  | Desarmado armado        | Desarmado y armado del elemento                                                            |
| **IV**  | Inspección visual       | Inspección visual de cuerpo, roscas y uniones                                              |
| **CR**  | Control de roscas       | Control de roscas con peine de perfil o calibre de rosca                                   |
| **CD**  | Control dimensional     | Control dimensional de conexiones y cuerpo                                                 |
| **ME**  | Medición de espesores   | Medición de espesores por ultrasonido                                                      |
| **END** | Ensayos no destructivos | Inspección por partículas magnetizables y/o líquidos penetrantes sobre roscas y soldaduras |
| **PH**  | Prueba hidrostática     | Prueba hidrostática, indicar presión de prueba (TP)                                        |
| **PE**  | Prueba de estanqueidad  | Prueba de estanqueidad con retención de fluido > 24hs y nivel de llenado >80%              |
| **EG**  | Engrasado               | Proceso de engrasado                                                                       |
| **PT**  | Pintura                 | Aplicación de pintura                                                                      |
| **AI**  | Aislado                 | Proceso de aislado                                                                         |
| **PP**  | Precinto/Placa          | Colocación de precinto o placa                                                             |

## Flujo de Proceso

### 1. Creación de Solicitud (Cliente)

1. **Acceso**: El cliente accede al sistema con su cuenta
2. **Nueva Solicitud**: Hace clic en "Nueva Solicitud"
3. **Datos Generales**: Completa información básica:

   - Lugar de inspección
   - Responsable
   - Equipo a inspeccionar
   - Fecha de entrega deseada
   - Requisitos adicionales (opcional)

4. **Selección de Trabajos**: Selecciona los tipos de inspección generales
5. **Gestión de Items**: Para cada item:

   - Descripción del elemento e identificación
   - Cantidad
   - Tipos de inspección específicos (checkboxes)

6. **Envío**: La solicitud se crea con estado "pendiente"

### 2. Gestión por Operadores

1. **Visualización**: Los operadores ven todas las solicitudes
2. **Revisión**: Pueden ver detalles completos de cada solicitud
3. **Acciones Disponibles**:
   - **Aprobar**: Cambia estado a "aprobada"
   - **Rechazar**: Cambia estado a "rechazada"
   - **Editar**: Modificar solicitudes pendientes
   - **Agregar Comentarios**: En aprobación/rechazo

### 3. Estados de Solicitud

- **Pendiente**: Recién creada, esperando revisión
- **Aprobada**: Aprobada por operador, lista para ejecución
- **Rechazada**: Rechazada por operador con comentarios
- **En Proceso**: En ejecución (futuro)
- **Completada**: Finalizada (futuro)

## Componentes del Sistema

### Componentes Principales

#### `SolicitudesTableWrapper`

- Contenedor principal que muestra la tabla de solicitudes
- Diferente vista para clientes vs operadores
- Incluye botón "Nueva Solicitud" para clientes

#### `SolicitudesTable`

- Tabla con filtros y búsqueda
- Columnas adaptadas según tipo de usuario
- Acciones por fila (ver, editar, aprobar, rechazar)

#### `SolicitudForm`

- Formulario completo para crear/editar solicitudes
- Validación con Zod
- Gestión de items con inspecciones

#### `ItemsManager`

- Gestión de items individuales
- Interfaz tipo Card para cada item
- Integración con selector de inspecciones

#### `ItemInspectionsSelector`

- Selector de tipos de inspección por item
- Checkboxes con códigos y descripciones
- Leyenda completa de tipos disponibles

#### `SolicitudDetailsDialog`

- Vista detallada de solicitudes
- Muestra todos los datos e inspecciones
- Información de aprobación/rechazo

### Componentes de Acciones

#### `SolicitudRowActions`

- Menú de acciones por solicitud
- Permisos según tipo de usuario y estado
- Integración con diálogos de aprobación/rechazo

#### `AddSolicitudButton`

- Botón para crear nueva solicitud
- Carga datos necesarios (clientes, tipos de inspección)
- Manejo de estados de carga

## Seguridad y Permisos

### Row Level Security (RLS)

#### Políticas para Clientes

- **SELECT**: Solo ven sus propias solicitudes
- **INSERT**: Solo pueden crear solicitudes para su cliente
- **UPDATE**: Solo pueden editar sus solicitudes pendientes

#### Políticas para Operadores

- **SELECT**: Ven todas las solicitudes
- **INSERT**: Pueden crear solicitudes para cualquier cliente
- **UPDATE**: Pueden editar cualquier solicitud
- **Identificación**: Usuarios sin `user_type` o con `user_type` vacío/null

### Vista `usuarios_auth`

Combina datos de `auth.users` con metadatos, incluyendo:

- Clientes: `user_type = 'cliente'`
- Operadores: `user_type IS NULL` o `user_type = ''` o `user_type IN ('operacion', 'inspector')`

## API y Acciones del Servidor

### Funciones Principales

#### `getSolicitudes()`

- Obtiene solicitudes con todas las relaciones
- Incluye cliente, items, inspecciones y trabajos
- Ordenadas por fecha de creación

#### `createSolicitud(data)`

- Crea solicitud principal
- Crea items asociados
- Crea relaciones de inspecciones
- Crea relaciones de trabajos

#### `updateSolicitud(data)`

- Actualiza solicitud principal
- Reemplaza items e inspecciones
- Mantiene integridad referencial

#### `aprobarSolicitud(id, comentarios)`

- Cambia estado a "aprobada"
- Registra fecha y comentarios
- Actualiza aprobador

#### `rechazarSolicitud(id, comentarios)`

- Cambia estado a "rechazada"
- Registra fecha y comentarios
- Requiere comentarios obligatorios

### Funciones de Catálogo

#### `getClientesActivos()`

- Lista clientes activos para selección

#### `getTiposInspeccion()`

- Lista tipos de inspección generales

#### `getItemInspectionTypes()`

- Lista tipos de inspección específicos para items
- Ordenados por campo `orden`

## Validación y Tipos

### Esquema de Validación (Zod)

```typescript
const solicitudSchema = z.object({
  cliente_id: z.string().min(1, "Debe seleccionar un cliente"),
  lugar: z.string().min(1, "El lugar es requerido"),
  responsable: z.string().min(1, "El responsable es requerido"),
  equipo: z.string().min(1, "El equipo es requerido"),
  fecha_entrega_deseada: z.string().min(1, "La fecha de entrega es requerida"),
  requisitos_adicionales: z.string().optional(),
  items: z
    .array(
      z.object({
        descripcion: z.string().min(1, "La descripción es requerida"),
        cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
        inspections: z
          .array(z.string())
          .min(1, "Debe seleccionar al menos un tipo de inspección"),
      })
    )
    .min(1, "Debe agregar al menos un item"),
  trabajos_ids: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un trabajo"),
});
```

### Interfaces TypeScript

```typescript
interface SolicitudItem {
  descripcion: string;
  cantidad: number;
  inspections?: string[]; // Array de IDs de tipos de inspección
}

interface ItemInspectionType {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
}
```

## Características Técnicas

### Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **UI**: shadcn/ui, Tailwind CSS
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Notificaciones**: Sonner

### Funcionalidades Clave

- ✅ **Responsive Design**: Adaptado para desktop y móvil
- ✅ **Real-time**: Actualizaciones en tiempo real con Supabase
- ✅ **Validación Robusta**: Validación tanto en cliente como servidor
- ✅ **Seguridad**: RLS completo con permisos granulares
- ✅ **UX Optimizada**: Carga progresiva y estados de loading
- ✅ **Accesibilidad**: Componentes accesibles con ARIA

### Optimizaciones

- **Carga Lazy**: Datos se cargan solo cuando se necesitan
- **Memoización**: Componentes optimizados con React.memo
- **Índices DB**: Índices optimizados para consultas frecuentes
- **Tipado Estricto**: TypeScript estricto para prevenir errores

## Mantenimiento y Extensibilidad

### Agregar Nuevos Tipos de Inspección

1. Insertar en tabla `item_inspection_types`
2. Los componentes se actualizan automáticamente

### Modificar Flujo de Estados

1. Actualizar enum en base de datos
2. Modificar componentes de estado
3. Actualizar políticas RLS si es necesario

### Agregar Nuevos Campos

1. Migración de base de datos
2. Actualizar tipos TypeScript
3. Modificar formularios y validaciones
4. Actualizar componentes de visualización

## Troubleshooting

### Problemas Comunes

#### Usuario no puede ver solicitudes

- Verificar que esté en tabla `usuarios_clientes` (clientes)
- Verificar que `user_type` esté correcto (operadores)
- Revisar políticas RLS

#### Error al crear solicitud

- Verificar que cliente esté activo
- Verificar que tipos de inspección existan
- Revisar logs de Supabase para errores específicos

#### Formulario no valida correctamente

- Verificar esquema Zod
- Revisar que todos los campos requeridos estén presentes
- Verificar tipos de datos

### Logs y Debugging

- Errores se registran en consola del navegador
- Errores de servidor se registran en Supabase
- Usar herramientas de desarrollo de React para debugging

## Roadmap Futuro

### Funcionalidades Planificadas

- [ ] **Notificaciones**: Sistema de notificaciones en tiempo real
- [ ] **Reportes**: Generación de reportes PDF
- [ ] **Workflow**: Estados adicionales (en_proceso, completada)
- [ ] **Archivos**: Adjuntar documentos a solicitudes
- [ ] **Calendario**: Vista de calendario para fechas de entrega
- [ ] **Dashboard**: Métricas y estadísticas
- [ ] **API Externa**: Integración con sistemas externos
- [ ] **Mobile App**: Aplicación móvil nativa

### Mejoras Técnicas

- [ ] **Cache**: Implementar cache para consultas frecuentes
- [ ] **Offline**: Soporte para modo offline
- [ ] **PWA**: Convertir en Progressive Web App
- [ ] **Tests**: Suite completa de tests automatizados
- [ ] **CI/CD**: Pipeline de integración continua
