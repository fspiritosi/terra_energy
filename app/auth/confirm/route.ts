import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  console.log("🔍 [CONFIRM API] Parámetros recibidos:", {
    token_hash: token_hash?.substring(0, 20) + "...",
    type,
    next,
  });

  if (token_hash && type) {
    const supabase = await createClient();

    console.log("🔐 [CONFIRM API] Intentando verificar OTP...");

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("📊 [CONFIRM API] Resultado verifyOtp:", {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: error?.message,
    });

    if (!error) {
      // Determine redirect based on type
      let redirectUrl = next;

      switch (type) {
        case "recovery":
          redirectUrl = "/auth/reset-password";
          break;
        case "signup":
        case "invite":
        case "magiclink":
        case "email_change":
        default:
          redirectUrl = next ?? "/dashboard";
          break;
      }

      console.log(
        "✅ [CONFIRM API] Verificación exitosa, redirigiendo a:",
        redirectUrl
      );

      // Crear la URL de redirección
      const redirectTo = new URL(redirectUrl, request.url);

      // Usar NextResponse.redirect para mantener las cookies
      return NextResponse.redirect(redirectTo);
    } else {
      console.error("❌ [CONFIRM API] Error en verificación:", error);
      // Redirect to error page with error message
      const errorUrl = new URL(
        `/auth/error?message=${encodeURIComponent(error.message)}`,
        request.url
      );
      return NextResponse.redirect(errorUrl);
    }
  }

  console.log("⚠️ [CONFIRM API] Sin token_hash o type, redirigiendo a login");
  // If no token_hash or type, redirect to login
  const loginUrl = new URL("/auth/login", request.url);
  return NextResponse.redirect(loginUrl);
}
