// Configuración de URLs para redirecciones de auth
export const AUTH_CONFIG = {
  // URL base de la aplicación
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://terra-energy.vercel.app",

  // URLs de redirección para diferentes flujos de auth
  redirectUrls: {
    // Después de confirmar email de registro
    confirmSignup: "/dashboard",

    // Después de hacer clic en magic link
    magicLink: "/dashboard",

    // Después de hacer clic en enlace de recuperación de contraseña
    resetPassword: "/auth/reset-password",

    // Después de confirmar cambio de email
    emailChange: "/dashboard",

    // Después de confirmar invitación
    invite: "/dashboard",

    // Página de error de auth
    error: "/auth/error",

    // Página de verificación de email
    verifyEmail: "/auth/verify-email",
  },

  // URLs permitidas para redirección (whitelist)
  allowedRedirectUrls: [
    "https://terra-energy.vercel.app",
    "http://localhost:3000",
    // Agregar más URLs según sea necesario
  ],
};

// Función helper para construir URLs completas
export function buildAuthUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path, AUTH_CONFIG.siteUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

// URLs específicas para templates de email
export const EMAIL_REDIRECT_URLS = {
  // Para template de confirmación de registro
  confirmation: buildAuthUrl("/auth/confirm"),

  // Para template de magic link
  magicLink: buildAuthUrl("/auth/confirm"),

  // Para template de recuperación de contraseña
  recovery: buildAuthUrl("/auth/confirm"),

  // Para template de cambio de email
  emailChange: buildAuthUrl("/auth/confirm"),

  // Para template de invitación
  invite: buildAuthUrl("/auth/confirm"),

  // Para template de reautenticación
  reauthentication: buildAuthUrl("/auth/confirm"),
};
