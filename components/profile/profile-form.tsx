"use client";

import { useState } from "react";
import { User as TypeUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ImageUpload } from ".";

interface ProfileFormProps {
    user: TypeUser | null;
    onSuccess: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Actualizar metadata del usuario
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl,
                }
            });

            if (updateError) throw updateError;

            // Refrescar la página para mostrar los cambios
            router.refresh();
            onSuccess();
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

            {error && (
                <p className="text-sm text-destructive">{error}</p>
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