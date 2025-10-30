import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function AuthErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string }>;
}) {
    const { message } = await searchParams;
    const errorMessage = message || "Ha ocurrido un error de autenticación";

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
                            <AlertCircle className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl text-destructive">Error de Autenticación</CardTitle>
                        <CardDescription>
                            No se pudo completar la operación solicitada
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                            <p className="text-sm text-destructive font-medium">
                                {errorMessage}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Esto puede ocurrir por:
                            </p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                <li>El enlace ha expirado</li>
                                <li>El enlace ya fue utilizado</li>
                                <li>El enlace es inválido</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button asChild>
                                <Link href="/auth/login">
                                    Volver al inicio de sesión
                                </Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/auth/forgot-password">
                                    Solicitar nuevo enlace
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}