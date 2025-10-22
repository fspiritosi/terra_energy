# Sistema de Usuarios

## 📋 Descripción

Sistema completo para gestionar usuarios del sistema y asignarlos a múltiples clientes. Los usuarios se crean usando Supabase Admin API y se les asigna el tipo "cliente" en los metadatos.

## 🔧 Configuración Requerida

### Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

**⚠️ IMPORTANTE**: `SUPABASE_SERVICE_ROLE_KEY` es necesaria para crear usuarios con Supabase Admin API.

### Base de Datos

El sistema utiliza las siguientes tablas:

- `usuarios_clientes`: Relación many-to-many entre usuarios y clientes
- `clientes`: Tabla de clientes existente
- `auth.users`: Tabla de autenticación de Supabase (gestionada automáticamente)

## 🚀 Funcionalidades

### ✅ Implementado

1. **Crear Usuarios**

   - Formulario con nombre, email y avatar opcional
   - Selección múltiple de clientes
   - Creación automática en `auth.users` con metadata `user_type: "cliente"`
   - Creación de relaciones en `usuarios_clientes`

2. **Editar Usuarios**

   - Actualización de datos personales
   - Reasignación de clientes
   - Cambio de estado activo/inactivo

3. **Eliminar Usuarios**

   - Eliminación completa del usuario de auth
   - Limpieza automática de relaciones

4. **Tabla de Usuarios**

   - Vista con avatar, nombre, email
   - Clientes asignados con badges
   - Filtros por estado y fecha
   - Búsqueda por nombre, email o cliente

5. **Gestión de Avatares**
   - Subida de imágenes a Supabase Storage
   - Bucket `profiles` con configuración automática
   - Eliminación automática de imágenes anteriores

## 🔐 Seguridad

- **RLS**: Row Level Security habilitado en `usuarios_clientes`
- **Admin API**: Uso de Service Role Key para operaciones de auth
- **Validación**: Schemas Zod para validación de formularios
- **Metadata**: Usuarios marcados con `user_type: "cliente"`

## 📱 Navegación

La página de usuarios está disponible en:

- **URL**: `/dashboard/usuarios`
- **Navegación**: Solo visible para usuarios tipo "operacion"

## 🔄 Flujo de Trabajo

### Crear Usuario

1. Click en "Agregar Usuario"
2. Completar formulario (nombre, email, avatar opcional)
3. Seleccionar clientes a asignar
4. Sistema crea usuario en auth + relaciones

### Editar Usuario

1. Click en menú de acciones → "Editar"
2. Modificar datos y/o reasignar clientes
3. Sistema actualiza auth + relaciones

### Eliminar Usuario

1. Click en menú de acciones → "Eliminar"
2. Confirmación de eliminación
3. Sistema elimina usuario y relaciones

## 🎨 Componentes

```
components/usuarios/
├── Usuarios.tsx                    # Componente principal
├── components/
│   ├── actions.ts                  # Server actions para obtener datos
│   ├── usuario-actions.ts          # Server actions para CRUD
│   ├── usuario-form.tsx           # Formulario crear/editar
│   ├── usuarios-table.tsx         # Tabla con filtros
│   ├── usuarios-table-wrapper.tsx # Wrapper con header
│   ├── columns.tsx                # Definición de columnas
│   ├── usuario-row-actions.tsx    # Acciones de fila
│   ├── add-usuario-button.tsx     # Botón agregar
│   └── index.ts                   # Exports
```

## 🔧 Personalización

### Agregar Campos al Usuario

1. Actualizar schema en `usuario-form.tsx`
2. Modificar `CreateUsuarioData` y `UpdateUsuarioData`
3. Actualizar funciones en `usuario-actions.ts`

### Cambiar Validaciones

Editar el schema Zod en `usuario-form.tsx`:

```typescript
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  // Agregar más campos aquí
});
```

## 🐛 Troubleshooting

### Error: "Service Role Key not found"

- Verificar que `SUPABASE_SERVICE_ROLE_KEY` esté en `.env.local`
- Reiniciar el servidor de desarrollo

### Error: "Bucket profiles not found"

- El bucket se crea automáticamente al subir la primera imagen
- Verificar permisos de Storage en Supabase Dashboard

### Usuarios no aparecen en la tabla

- Verificar que existan relaciones en `usuarios_clientes`
- Revisar logs del servidor para errores de auth

## 📚 Referencias

- [Supabase Admin API](https://supabase.com/docs/reference/javascript/admin-api)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
