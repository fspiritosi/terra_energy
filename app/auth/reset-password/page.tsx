import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function updatePassword(formData: FormData) {
    "use server";

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log("🔐 [RESET SERVER ACTION] Iniciando actualización de contraseña...");
    console.log("📝 [RESET SERVER ACTION] Datos recibidos:", {
        passwordLength: password?.length,
        confirmPasswordLength: confirmPassword?.length,
        passwordsMatch: password === confirmPassword
    });

    // Validation
    if (!password || password.length < 6) {
        console.log("❌ [RESET SERVER ACTION] Validación fallida: contraseña muy corta");
        redirect("/auth/reset-password?error=" + encodeURIComponent("La contraseña debe tener al menos 6 caracteres"));
    }

    if (password !== confirmPassword) {
        console.log("❌ [RESET SERVER ACTION] Validación fallida: contraseñas no coinciden");
        redirect("/auth/reset-password?error=" + encodeURIComponent("Las contraseñas no coinciden"));
    }

    console.log("✅ [RESET SERVER ACTION] Validaciones pasadas, creando cliente Supabase...");

    const supabase = await createClient();

    // Verificar sesión actual antes de intentar actualizar
    console.log("🔍 [RESET SERVER ACTION] Verificando sesión actual...");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    console.log("📊 [RESET SERVER ACTION] Estado de sesión:", {
        hasSession: !!sessionData.session,
        hasUser: !!sessionData.session?.user,
        userId: sessionData.session?.user?.id,
        userEmail: sessionData.session?.user?.email,
        sessionError: sessionError?.message
    });

    if (!sessionData.session) {
        console.log("❌ [RESET SERVER ACTION] No hay sesión válida");
        redirect("/auth/reset-password?error=" + encodeURIComponent("Tu sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación."));
    }

    console.log("🔐 [RESET SERVER ACTION] Sesión válida encontrada, intentando actualizar contraseña...");

    try {
        const { data, error } = await supabase.auth.updateUser({
            password: password
        });

        console.log("📊 [RESET SERVER ACTION] Resultado updateUser:", {
            hasData: !!data,
            hasUser: !!data?.user,
            userUpdated: !!data?.user?.updated_at,
            error: error?.message,
            errorCode: error?.status
        });

        if (error) {
            console.error("❌ [RESET SERVER ACTION] Error al actualizar contraseña:", {
                message: error.message,
                status: error.status,
                name: error.name
            });

            // Manejar diferentes tipos de errores
            if (error.message.includes('session') || error.message.includes('authenticated')) {
                redirect("/auth/reset-password?error=" + encodeURIComponent("Tu sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación."));
            } else {
                redirect("/auth/reset-password?error=" + encodeURIComponent(error.message));
            }
        }

        // Si llegamos aquí, la actualización fue exitosa
        console.log("✅ [RESET SERVER ACTION] Contraseña actualizada exitosamente");

    } catch (error) {
        console.error("💥 [RESET SERVER ACTION] Error inesperado al actualizar contraseña:", {
            message: (error as Error).message,
            name: (error as Error).name
        });
        redirect("/auth/reset-password?error=" + encodeURIComponent("Error inesperado al actualizar la contraseña"));
    }

    // Redirect exitoso fuera del try/catch
    redirect("/auth/reset-password?success=" + encodeURIComponent("Contraseña actualizada exitosamente"));
}

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; success?: string }>;
}) {
    const { error, success } = await searchParams;

    console.log("🏁 [RESET PAGE] Página de reset cargada:", {
        hasError: !!error,
        hasSuccess: !!success,
        error: error,
        success: success
    });

    // También verificar la sesión en el servidor al cargar la página
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();

    console.log("🔍 [RESET PAGE] Estado de sesión al cargar página:", {
        hasSession: !!sessionData.session,
        hasUser: !!sessionData.session?.user,
        userId: sessionData.session?.user?.id,
        userEmail: sessionData.session?.user?.email
    });

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/Terra Energy Services - logo dorado.png"
                        alt="Terra Energy Services"
                        className="h-24 w-auto"
                        height={96}
                        width={96}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Nueva Contraseña</CardTitle>
                        <CardDescription>
                            Ingresa tu nueva contraseña para completar el restablecimiento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={updatePassword}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Ingresa tu nueva contraseña"
                                        required
                                        className="pr-10"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirma tu nueva contraseña"
                                        required
                                        className="pr-10"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                        <p className="text-sm text-destructive font-medium">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-700 font-medium">{success}</p>
                                        <div className="mt-2">
                                            <Link href="/dashboard" className="text-sm text-green-600 hover:text-green-800 underline">
                                                Ir al Dashboard
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full">
                                    Actualizar Contraseña
                                </Button>

                                <div className="text-center">
                                    <Link
                                        href="/auth/login"
                                        className="text-sm text-muted-foreground hover:text-primary"
                                    >
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}