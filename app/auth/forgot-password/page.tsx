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
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const supabase = createClient();

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/confirm?type=recovery&next=/auth/reset-password`,
            });

            if (error) throw error;

            setSuccess("Se ha enviado un enlace de restablecimiento a tu correo electrónico");
            setEmail("");

        } catch (error) {
            setError((error as AuthError).message || "Error al enviar el correo de restablecimiento");
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
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Mail className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">¿Olvidaste tu contraseña?</CardTitle>
                        <CardDescription>
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleForgotPassword}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        <p className="text-xs text-green-600 mt-1">
                                            Revisa tu bandeja de entrada y carpeta de spam
                                        </p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Enviando..." : "Enviar enlace de restablecimiento"}
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