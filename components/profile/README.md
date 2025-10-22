# Sistema de Perfil de Usuario

Este módulo proporciona un sistema completo para que los usuarios gestionen su perfil, incluyendo la subida y gestión de avatares.

## Componentes

### ProfileModal

Modal principal que contiene el formulario de edición de perfil.

### ProfileForm

Formulario para editar nombre completo y avatar del usuario.

### ImageUpload

Componente especializado para subir, reemplazar y eliminar imágenes de avatar.

## Características

### 🖼️ Gestión de Imágenes

- **Subida**: Arrastra y suelta o selecciona archivos
- **Validación**: Solo imágenes, máximo 5MB
- **Reemplazo**: Elimina automáticamente la imagen anterior
- **Eliminación**: Botón para quitar avatar actual
- **Previsualización**: Vista previa inmediata

### 🔒 Seguridad

- **RLS**: Políticas de seguridad a nivel de fila
- **Privacidad**: Solo el usuario puede gestionar sus propias imágenes
- **Validación**: Tipos de archivo y tamaño controlados

### 💾 Storage

- **Bucket**: `profiles` en Supabase Storage
- **Estructura**: `avatars/{userId}-{timestamp}.{ext}`
- **Público**: URLs públicas para mostrar avatares

## Uso

```tsx
import { ProfileModal } from "@/components/profile";

function NavUser({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Mi Cuenta</button>

      <ProfileModal user={user} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
```

## Configuración de Supabase

El sistema requiere:

1. **Bucket de Storage**: `profiles` (creado automáticamente)
2. **Políticas RLS**: Configuradas para seguridad
3. **Metadata de Usuario**: `full_name` y `avatar_url`

## Flujo de Actualización

1. Usuario abre modal desde menú
2. Puede cambiar nombre y/o avatar
3. Al subir imagen:
   - Se elimina la anterior (si existe)
   - Se sube la nueva al storage
   - Se obtiene URL pública
4. Al guardar:
   - Se actualiza metadata del usuario
   - Se refresca la interfaz
   - Se cierra el modal

## Estructura de Archivos

```
components/profile/
├── index.ts              # Exportaciones
├── profile-modal.tsx     # Modal principal
├── profile-form.tsx      # Formulario de edición
├── image-upload.tsx      # Subida de imágenes
└── README.md            # Documentación
```
