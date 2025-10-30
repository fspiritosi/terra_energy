"use client";

import { useState } from "react";
import { User as TypeUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ImageUpload } from ".";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePasswordAlert } from "@/components/providers/password-alert-provider";

interface ProfileFormProps {
    user: TypeUser | null;
    onSuccess: () => void;
    showPasswordSection?: boolean;
}

export function ProfileForm({ user, onSuccess, showPasswordSection = false }: ProfileFormProps) {
    const [fullName, setFullName] = useState(
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        ""
    );
    const [avatarUrl, setAvatarUrl] = useState(
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        ""
    );

    // Estados para cambio de contraseña
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const { refreshUser } = usePasswordAlert();

    const needsPasswordChange = user?.user_metadata?.needs_password_change === true;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const supabase = createClient();

            // Validaciones para cambio de contraseña
            if (showPasswordSection || needsPasswordChange) {
                if (!newPassword || newPassword.length < 6) {
                    throw new Error("La nueva contraseña debe tener al menos 6 caracteres");
                }

                if (newPassword !== confirmPassword) {
                    throw new Error("Las contraseñas no coinciden");
                }

                // Si es primera vez (contraseña por defecto), validar contraseña actual
                if (needsPasswordChange && currentPassword !== "terra123") {
                    throw new Error("La contraseña actual no es correcta");
                }
            }

            // Preparar datos de actualización
            const updateData: Record<string, string | boolean> = {
                full_name: fullName,
                avatar_url: avatarUrl,
            };

            // Si está cambiando contraseña, quitar la flag
            if ((showPasswordSection || needsPasswordChange) && newPassword) {
                // Quitar la flag de needs_password_change
                updateData.needs_password_change = false;
                delete updateData.default_password; // También quitar referencia de contraseña por defecto
            }

            // Actualizar contraseña si se proporcionó
            if ((showPasswordSection || needsPasswordChange) && newPassword) {
                const { error: passwordError } = await supabase.auth.updateUser({
                    password: newPassword,
                    data: updateData
                });

                if (passwordError) throw passwordError;
                setSuccess("Contraseña actualizada exitosamente");
            } else {
                // Solo actualizar metadata
                const { error: updateError } = await supabase.auth.updateUser({
                    data: updateData
                });

                if (updateError) throw updateError;
                setSuccess("Perfil actualizado exitosamente");
            }

            // Refrescar el usuario en el contexto para actualizar el alert
            await refreshUser();

            // Refrescar la página para mostrar los cambios
            router.refresh();

            // Cerrar modal después de un breve delay para mostrar el mensaje de éxito
            setTimeout(() => {
                onSuccess();
            }, 1500);

        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Error al actualizar perfil");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Foto de Perfil</Label>
                <ImageUpload
                    currentImageUrl={avatarUrl}
                    onImageChange={setAvatarUrl}
                    userId={user?.id || ""}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre completo"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                    El correo electrónico no se puede cambiar
                </p>
            </div>

            {/* Sección de cambio de contraseña */}
            {(showPasswordSection || needsPasswordChange) && (
                <>
                    <Separator />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">
                                {needsPasswordChange ? "Cambiar Contraseña (Requerido)" : "Cambiar Contraseña"}
                            </Label>
                            {needsPasswordChange && (
                                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                                    Tu contraseña actual es temporal. Por seguridad, debes cambiarla.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                                {needsPasswordChange ? "Contraseña Actual (terra123)" : "Contraseña Actual"}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder={needsPasswordChange ? "terra123" : "Tu contraseña actual"}
                                    required={showPasswordSection || needsPasswordChange}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Tu nueva contraseña"
                                    required={showPasswordSection || needsPasswordChange}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirma tu nueva contraseña"
                                    required={showPasswordSection || needsPasswordChange}
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
                    </div>
                </>
            )}

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

            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onSuccess}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </div>
        </form>
    );
}