"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureProfilesBucket } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploadProps {
    currentImageUrl: string;
    onImageChange: (url: string) => void;
    userId: string;
}

export function ImageUpload({ currentImageUrl, onImageChange, userId }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Asegurar que el bucket existe al montar el componente
        ensureProfilesBucket();
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen debe ser menor a 5MB');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Eliminar imagen anterior si existe
            if (currentImageUrl) {
                await deleteCurrentImage();
            }

            // Generar nombre único para el archivo
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Subir nueva imagen
            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            onImageChange(publicUrl);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Error al subir imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const deleteCurrentImage = async () => {
        if (!currentImageUrl) return;

        try {
            const supabase = createClient();

            // Extraer el path del archivo de la URL
            const url = new URL(currentImageUrl);
            const pathParts = url.pathname.split('/');
            const filePath = pathParts.slice(-2).join('/'); // avatars/filename.ext

            await supabase.storage
                .from('profiles')
                .remove([filePath]);
        } catch (error) {
            console.error('Error al eliminar imagen anterior:', error);
        }
    };

    const handleRemoveImage = async () => {
        if (!currentImageUrl) return;

        setIsUploading(true);
        try {
            await deleteCurrentImage();
            onImageChange('');
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Error al eliminar imagen');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={currentImageUrl} />
                    <AvatarFallback>
                        <Camera className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                </Avatar>

                {currentImageUrl && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <div className="flex space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                >
                    <Upload className="h-4 w-4 mr-2" />
                    {currentImageUrl ? 'Cambiar' : 'Subir'} Foto
                </Button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
            )}

            {isUploading && (
                <p className="text-xs text-muted-foreground">Subiendo imagen...</p>
            )}
        </div>
    );
}