# Configuración de Templates de Email y URLs de Redirección

## 📧 Templates de Email para Supabase Dashboard

Ve a tu dashboard de Supabase → Authentication → Email Templates y configura cada template:

### 1. Confirm Signup (Confirmación de Registro)

**Subject:** `Confirma tu registro - Terra Energy`

**Template:**

```html
<body>
  <div class="container">
    <div class="header"><h1 class="logo">TERRA ENERGY</h1></div>
    <div class="content">
      <h2 class="title">¡Bienvenido a Terra Energy!</h2>
      <p class="message">
        Gracias por registrarte en nuestra plataforma de gestión energética.
        Para completar tu registro y acceder a todas las funcionalidades,
        necesitamos que confirmes tu dirección de correo electrónico.
      </p>
      <div class="button-container">
        <a
          href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/dashboard"
          class="button"
          >Confirmar mi cuenta</a
        >
      </div>
      <div class="security-note">
        <p>
          <strong>Nota de seguridad:</strong> Este enlace es válido por 24 horas
          y solo puede ser usado una vez. Si no solicitaste esta cuenta, puedes
          ignorar este correo.
        </p>
      </div>
      <div class="divider"></div>
      <p class="message">
        Si tienes problemas con el botón, copia y pega este enlace en tu
        navegador:<br /><br /><a
          href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/dashboard"
          style="color: #f4951d; word-break: break-all;"
          >{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash
          }}&type=signup&next=/dashboard</a
        >
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">
        <strong>Terra Energy Services</strong><br />Plataforma de gestión
        energética<br />Este correo fue enviado a {{ .Email }}
      </p>
    </div>
  </div>
</body>
```

### 2. Magic Link

**Subject:** `Tu enlace de acceso - Terra Energy`

**Template:** Usa el HTML del archivo `email-templates/magic-link.html` pero cambia la URL del botón por:

```html
<a
  href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard"
  class="button"
>
  🚀 Acceder a Terra Energy
</a>
```

### 3. Reset Password (Recuperación de Contraseña)

**Subject:** `Restablecer contraseña - Terra Energy`

**Template:**

```html
<body>
  <div class="container">
    <div class="header"><h1 class="logo">TERRA ENERGY</h1></div>
    <div class="content">
      <h2 class="title">Restablecer tu contraseña</h2>
      <div class="reset-box">
        <h3>🔑 Solicitud de restablecimiento</h3>
        <p>
          Hemos recibido una solicitud para restablecer la contraseña de tu
          cuenta en Terra Energy
        </p>
      </div>
      <p class="message">
        No te preocupes, es normal olvidar las contraseñas. Haz clic en el botón
        de abajo para crear una nueva contraseña segura para tu cuenta.
      </p>
      <div class="time-limit">⏰ Este enlace es válido por 1 hora</div>
      <div class="button-container">
        <a
          href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password"
          class="button"
          >🔄 Crear nueva contraseña</a
        >
      </div>
      <div class="security-tips">
        <h4>💡 Consejos para una contraseña segura:</h4>
        <ul>
          <li>Usa al menos 8 caracteres</li>
          <li>Combina letras mayúsculas y minúsculas</li>
          <li>Incluye números y símbolos especiales</li>
          <li>Evita información personal (nombres, fechas)</li>
          <li>No reutilices contraseñas de otras cuentas</li>
        </ul>
      </div>
      <div class="warning-box">
        <p>
          ⚠️ Si no solicitaste este restablecimiento, ignora este correo. Tu
          contraseña actual permanecerá sin cambios.
        </p>
      </div>
      <div class="divider"></div>
      <p class="message">
        Si tienes problemas con el botón, copia y pega este enlace en tu
        navegador:<br /><br /><a
          href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/reset-password"
          style="color: #f4951d; word-break: break-all;"
          >{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash
          }}&type=recovery&next=/auth/reset-password</a
        >
      </p>
      <p
        style="font-size: 14px; color: #8c6a51; text-align: center; margin-top: 30px;"
      >
        Por tu seguridad, este enlace expirará automáticamente en 1 hora.<br />Si
        necesitas ayuda, contacta a nuestro equipo de soporte.
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">
        <strong>Terra Energy Services</strong><br />Plataforma de gestión
        energética<br />Este correo fue enviado a {{ .Email }}
      </p>
    </div>
  </div>
</body>
```

### 4. Invite User (Invitación de Usuario)

**Subject:** `Invitación a Terra Energy`

**Template:**

```html
<body>
  <div class="container">
    <div class="header"><h1 class="logo">TERRA ENERGY</h1></div>
    <div class="content">
      <h2 class="title">¡Has sido invitado a Terra Energy!</h2>
      <div class="invitation-box">
        <h3>Invitación Especial</h3>
        <p>
          Has sido invitado a unirte a nuestra plataforma de gestión energética.
          Accede a herramientas profesionales para optimizar el rendimiento
          energético.
        </p>
      </div>
      <p class="message">
        Terra Energy Services te invita a formar parte de nuestra plataforma
        líder en gestión energética. Únete a profesionales que ya están
        optimizando sus operaciones con nuestras herramientas avanzadas.
      </p>
      <div class="features">
        <h3 style="color: #7c4d3a; text-align: center; margin-bottom: 20px;">
          ¿Qué puedes hacer con Terra Energy?
        </h3>
        <ul>
          <li>Monitoreo en tiempo real de consumo energético</li>
          <li>Análisis avanzado de eficiencia energética</li>
          <li>Reportes detallados y personalizables</li>
          <li>Gestión de múltiples instalaciones</li>
          <li>Alertas automáticas y notificaciones</li>
          <li>Soporte técnico especializado</li>
        </ul>
      </div>
      <div class="button-container">
        <a
          href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/dashboard"
          class="button"
          >Aceptar invitación</a
        >
      </div>
      <div class="divider"></div>
      <p class="message">
        Si tienes problemas con el botón, copia y pega este enlace en tu
        navegador:<br /><br /><a
          href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/dashboard"
          style="color: #f4951d; word-break: break-all;"
          >{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash
          }}&type=invite&next=/dashboard</a
        >
      </p>
      <p
        style="font-size: 14px; color: #8c6a51; text-align: center; margin-top: 30px;"
      >
        Esta invitación es válida por 7 días. Si no solicitaste acceso a Terra
        Energy, puedes ignorar este correo.
      </p>
    </div>
    <div class="footer">
      <p class="footer-text">
        <strong>Terra Energy Services</strong><br />Plataforma de gestión
        energética<br />Este correo fue enviado a {{ .Email }}
      </p>
    </div>
  </div>
</body>
```

### 5. Email Change (Cambio de Email)

**Subject:** `Confirmar cambio de email - Terra Energy`

**Template:** Usa el HTML del archivo `email-templates/change-email.html` pero cambia la URL del botón por:

```html
<a
  href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email_change&next=/dashboard"
  class="button"
>
  ✅ Confirmar nuevo email
</a>
```

### 6. Reauthentication (Reautenticación)

**Subject:** `Verificación de seguridad - Terra Energy`

**Template:** Usa el HTML del archivo `email-templates/reauthentication.html` pero cambia la URL del botón por:

```html
<a
  href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=reauthentication&next=/dashboard"
  class="button"
>
  🔗 Verificar automáticamente
</a>
```

## 🔗 Configuración de URLs de Redirección

Ve a tu dashboard de Supabase → Authentication → URL Configuration:

### Site URL

```
https://terra-energy.vercel.app
```

### Redirect URLs (agregar todas estas)

```
https://terra-energy.vercel.app/auth/confirm
https://terra-energy.vercel.app/auth/reset-password
https://terra-energy.vercel.app/auth/error
https://terra-energy.vercel.app/auth/verify-email
https://terra-energy.vercel.app/dashboard
http://localhost:3000/auth/confirm
http://localhost:3000/auth/reset-password
http://localhost:3000/auth/error
http://localhost:3000/auth/verify-email
http://localhost:3000/dashboard
```

## 🛠️ Configuración SMTP (Hostinger)

Ve a Settings → Authentication → SMTP Settings:

- **Sender email:** `yjimenez@codecontrol.com.ar`
- **Sender name:** `Terra Energy Services`
- **Host:** `smtp.hostinger.com`
- **Port:** `587`
- **Username:** `yjimenez@codecontrol.com.ar`
- **Password:** [tu contraseña de email]
- **Minimum interval:** `60` segundos

## 📝 Notas Importantes

1. **Reemplaza `{{ .SiteURL }}`** con tu dominio real en producción
2. **Testa cada flujo** después de configurar
3. **Revisa los logs** de Auth si algo no funciona
4. **Los templates HTML completos** están en la carpeta `email-templates/`

## 🧪 Cómo Probar

1. **Registro:** Crea un usuario nuevo → debe recibir email de confirmación
2. **Magic Link:** Usa "Olvidé mi contraseña" → debe recibir email
3. **Reset Password:** Haz clic en el enlace → debe ir a `/auth/reset-password`
4. **Confirmación:** Haz clic en confirmar → debe ir al dashboard

## 🚨 Si algo falla

1. Revisa los logs de Auth en Supabase
2. Verifica que las URLs estén en la whitelist
3. Confirma que el SMTP esté configurado correctamente
4. Prueba con un email diferente por si hay cache
