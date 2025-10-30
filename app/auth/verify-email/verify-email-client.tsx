"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface VerifyEmailClientProps {
    email?: string;
}

export function VerifyEmailClient({ email }: VerifyEmailClientProps) {
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);

    const supabase = createClient();

    const handleResendEmail = async () => {
        if (!email) return;

        setIsResending(true);
        setResendError(null);
        setResendSuccess(false);

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                }
            });

            if (error) throw error;

            setResendSuccess(true);
        } catch (error) {
            setResendError((error as AuthError).message || "Error al reenviar el correo");
        } finally {
            setIsResending(false);
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
                        <CardTitle className="text-2xl">Verifica tu correo electrónico</CardTitle>
                        <CardDescription>
                            Hemos enviado un enlace de verificación a tu correo electrónico
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {email && (
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                                <p className="text-sm font-medium text-center">
                                    Correo enviado a: <span className="text-primary">{email}</span>
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Revisa tu bandeja de entrada</p>
                                    <p className="text-xs text-muted-foreground">
                                        Busca un correo de Terra Energy Services
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Haz clic en el enlace</p>
                                    <p className="text-xs text-muted-foreground">
                                        El enlace te llevará de vuelta a la aplicación
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Revisa la carpeta de spam</p>
                                    <p className="text-xs text-muted-foreground">
                                        A veces los correos pueden llegar ahí
                                    </p>
                                </div>
                            </div>
                        </div>

                        {resendSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700 font-medium">
                                    ✓ Correo reenviado exitosamente
                                </p>
                            </div>
                        )}

                        {resendError && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                <p className="text-sm text-destructive font-medium">{resendError}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {email && (
                                <Button
                                    variant="outline"
                                    onClick={handleResendEmail}
                                    disabled={isResending}
                                    className="w-full"
                                >
                                    {isResending ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Reenviando...
                                        </>
                                    ) : (
                                        "Reenviar correo de verificación"
                                    )}
                                </Button>
                            )}

                            <Button asChild variant="ghost" className="w-full">
                                <Link href="/auth/login">
                                    Volver al inicio de sesión
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}