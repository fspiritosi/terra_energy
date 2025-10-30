# 🔧 Solución para Doble Slash en URLs de Email

## 🚨 Problema Identificado

La URL del email tiene doble slash: `https://terra-energy.vercel.app//auth/confirm`

## 🎯 Causa

El `Site URL` en Supabase Dashboard está configurado con una barra al final: `https://terra-energy.vercel.app/`

## ✅ Solución

### 1. Configurar Site URL en Supabase Dashboard

Ve a **Authentication → URL Configuration** y configura:

**Site URL:** `https://terra-energy.vercel.app` (SIN barra al final)

### 2. Actualizar Templates de Email

En todos los templates, cambiar:

```html
{{ .SiteURL }}/auth/confirm
```

Por:

```html
{{ .SiteURL }}auth/confirm
```

### 3. Templates Corregidos

#### Reset Password Template:

```html
<a
  href="{{ .SiteURL }}auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password"
  class="button"
  >🔄 Crear nueva contraseña</a
>
```

#### Confirm Signup Template:

```html
<a
  href="{{ .SiteURL }}auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/dashboard"
  class="button"
  >Confirmar mi cuenta</a
>
```

#### Invite User Template:

```html
<a
  href="{{ .SiteURL }}auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/dashboard"
  class="button"
  >Aceptar invitación</a
>
```

## 🔧 Cambios Realizados en el Código

### 1. Middleware Corregido

- ✅ Permite acceso a todas las rutas `/auth/*` sin autenticación
- ✅ No redirige a login cuando se accede a rutas de auth

### 2. SearchParams Corregidos

- ✅ `app/auth/confirm/page.tsx` - Usa `await searchParams`
- ✅ `app/auth/error/page.tsx` - Usa `await searchParams`
- ✅ `app/auth/verify-email/page.tsx` - Usa `await searchParams`

## 🧪 Cómo Probar

1. **Configurar Site URL** en Supabase (sin barra al final)
2. **Actualizar templates** de email en Dashboard
3. **Probar flujo completo:**
   - Ir a "Olvidé mi contraseña"
   - Ingresar email
   - Revisar email recibido
   - Hacer clic en enlace
   - Verificar que va a `/auth/reset-password`

## 📋 Checklist

- [ ] Site URL configurado sin barra al final
- [ ] Templates de email actualizados
- [ ] Probar flujo de reset password
- [ ] Probar flujo de confirmación de registro
- [ ] Probar flujo de invitación

¡Una vez configurado el Site URL correctamente, el flujo debería funcionar perfectamente! 🎉
