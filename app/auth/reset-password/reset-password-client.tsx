"use client";

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
import { createClient } from "@/lib/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function ResetPasswordClient() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        console.log("🔄 [RESET] Componente montado, listo para cambiar contraseña");
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Validation
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setIsLoading(false);
            return;
        }

        try {
            console.log("🔐 [RESET] Intentando actualizar contraseña...");

            const { data, error } = await supabase.auth.updateUser({
                password: password
            });

            console.log("📊 [RESET] Resultado updateUser:", {
                hasData: !!data,
                hasUser: !!data?.user,
                error: error?.message
            });

            if (error) {
                // Si el error es de autenticación, mostrar mensaje específico
                if (error.message.includes('session') || error.message.includes('authenticated')) {
                    setError("Tu sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.");
                    setTimeout(() => {
                        router.push("/auth/forgot-password");
                    }, 3000);
                } else {
                    throw error;
                }
                return;
            }

            console.log("✅ [RESET] Contraseña actualizada exitosamente");
            setSuccess("Contraseña actualizada exitosamente");

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch (error) {
            console.error("❌ [RESET] Error al actualizar contraseña:", error);
            setError((error as AuthError).message || "Error al actualizar la contraseña");
        } finally {
            setIsLoading(false);
        }
    };



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
                        <form onSubmit={handleResetPassword}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Ingresa tu nueva contraseña"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirma tu nueva contraseña"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                        <p className="text-sm text-destructive font-medium">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <p className="text-sm text-green-700 font-medium">{success}</p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
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