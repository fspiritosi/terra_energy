# Plan de Implementación - Dashboards Diferenciados

## 📋 Resumen

Sistema de dashboards diferenciados para **Clientes** y **Operación/Inspectores** basado en el flujo de inspecciones.

## 🎯 Estado Actual (Hardcoded)

### Variables temporales:
```typescript
// En: components/dashboard/app-sidebar.tsx y app/dashboard/page.tsx
const USER_TYPE: "cliente" | "operacion" = "operacion";
```

**Para probar:**
- Cambiar a `"cliente"` para ver dashboard de cliente
- Cambiar a `"operacion"` para ver dashboard de operación

---

## 🔄 Implementación Futura con Supabase

### 1. Estructura de Base de Datos

#### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'operacion', 'inspector')),
  cliente_id UUID REFERENCES clientes(id), -- Solo para tipo 'cliente'
  nombre TEXT NOT NULL,
  avatar_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio perfil"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Operación ve todos los usuarios"
  ON usuarios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND tipo_usuario IN ('operacion', 'inspector')
    )
  );
```

#### Tabla: `clientes`
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  razon_social TEXT,
  logo_url TEXT,
  configuracion JSONB DEFAULT '{}', -- Branding, moneda, etc.
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Autenticación y Contexto de Usuario

#### Hook personalizado: `useUserType()`
```typescript
// hooks/use-user-type.ts
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export type UserType = "cliente" | "operacion" | "inspector";

export interface UserProfile {
  id: string;
  email: string;
  tipo_usuario: UserType;
  nombre: string;
  avatar_url?: string;
  cliente_id?: string;
}

export function useUserType() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from("usuarios")
          .select("*")
          .eq("id", user.id)
          .single();
        
        setUserProfile(data);
      }
      setLoading(false);
    }
    
    loadUser();
  }, []);

  return { userProfile, loading, userType: userProfile?.tipo_usuario };
}
```

### 3. Actualizar Componentes

#### `components/dashboard/app-sidebar.tsx`
```typescript
"use client";

import { useUserType } from "@/hooks/use-user-type";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userType, userProfile, loading } = useUserType();
  
  if (loading) return <SidebarSkeleton />;
  
  const navItems = userType === "cliente" ? clienteNavItems : operacionNavItems;
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userProfile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
```

#### `app/dashboard/page.tsx`
```typescript
"use client";

import { useUserType } from "@/hooks/use-user-type";

export default function DashboardPage() {
  const { userType, loading } = useUserType();
  
  if (loading) return <DashboardSkeleton />;
  
  return (
    <>
      <header>...</header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {userType === "cliente" ? <DashboardCliente /> : <DashboardOperacion />}
      </div>
    </>
  );
}
```

### 4. Middleware de Protección

#### `middleware.ts`
```typescript
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  // Proteger rutas de dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    
    // Verificar permisos específicos por ruta
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("tipo_usuario")
      .eq("id", user.id)
      .single();
    
    // Rutas exclusivas de operación
    if (request.nextUrl.pathname.startsWith("/dashboard/clientes") ||
        request.nextUrl.pathname.startsWith("/dashboard/calendario")) {
      if (usuario?.tipo_usuario === "cliente") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }
  
  return response;
}
```

### 5. Proceso de Registro

#### Flujo de registro con tipo de usuario:
1. Usuario se registra con email/password
2. Sistema crea registro en `auth.users`
3. Trigger o función crea registro en `usuarios` con tipo asignado
4. Cliente puede ser asignado por operación o auto-registro con aprobación

```sql
-- Trigger para crear perfil de usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, tipo_usuario, nombre)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cliente'),
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 📊 Dashboards Implementados

### Dashboard Cliente
**Funcionalidades:**
- ✅ Resumen de solicitudes (total, pendientes, aprobadas, rechazadas)
- ✅ Botón de acción rápida: Nueva Solicitud
- ✅ Lista de solicitudes recientes con estados
- 🔜 Filtros por fecha y estado
- 🔜 Descarga de documentos/informes

**Navegación:**
- Dashboard
- Mis Solicitudes
- Nueva Solicitud
- Documentos

### Dashboard Operación
**Funcionalidades:**
- ✅ Resumen operativo (pendientes, inspecciones hoy, inspectores, reprogramaciones)
- ✅ Solicitudes sin asignar (con botón de asignación)
- ✅ Inspecciones del día con estados
- ✅ Alertas y notificaciones
- 🔜 Asignación de inspectores
- 🔜 Gestión de calendario
- 🔜 Generación de informes

**Navegación:**
- Dashboard
- Solicitudes Pendientes
- Calendario
- Inspecciones
- Clientes
- Reportes
- Configuración

---

## 🚀 Pasos de Migración

### Fase 1: Base de Datos (Sprint 1)
1. Crear tablas `usuarios` y `clientes`
2. Configurar RLS policies
3. Crear triggers de registro
4. Migrar usuarios existentes (si aplica)

### Fase 2: Autenticación (Sprint 1-2)
1. Implementar hook `useUserType()`
2. Actualizar componentes para usar el hook
3. Crear componentes de loading/skeleton
4. Probar flujos de autenticación

### Fase 3: Middleware y Protección (Sprint 2)
1. Implementar middleware de rutas
2. Agregar validaciones de permisos
3. Crear páginas de error 403
4. Testing de seguridad

### Fase 4: Funcionalidades Específicas (Sprint 3+)
1. Implementar flujo completo de solicitudes (Cliente)
2. Implementar asignación de inspectores (Operación)
3. Calendario interactivo
4. Generación de informes con QR
5. Sistema de notificaciones

---

## 🔐 Consideraciones de Seguridad

1. **RLS (Row Level Security)**: Cada tabla debe tener políticas que filtren por `cliente_id` o `tipo_usuario`
2. **Validación de permisos**: Middleware verifica acceso antes de renderizar
3. **Datos sensibles**: Nunca exponer información de otros clientes
4. **Auditoría**: Log de acciones críticas (asignaciones, aprobaciones, etc.)

---

## 📝 Notas de Desarrollo

- Mantener `USER_TYPE` hardcoded hasta completar Fase 2
- Documentar cambios en cada fase
- Crear tests E2E para flujos críticos
- Considerar feature flags para rollout gradual
