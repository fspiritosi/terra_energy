"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { ensureSolicitudesImagesBucket } from "@/lib/supabase/solicitudes-storage";

export interface SolicitudImage {
    id?: string; // Para imágenes existentes
    url: string;
    fileName: string;
    orden: number;
    file?: File; // Para imágenes nuevas
    isNew?: boolean; // Flag para identificar imágenes nuevas
    toDelete?: boolean; // Flag para marcar imágenes a eliminar
}

interface SolicitudImagesUploadProps {
    images: SolicitudImage[];
    onImagesChange: (images: SolicitudImage[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

export function SolicitudImagesUpload({
    images,
    onImagesChange,
    maxImages = 3,
    disabled = false,
}: SolicitudImagesUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);



    useEffect(() => {
        // Asegurar que el bucket existe al montar el componente
        ensureSolicitudesImagesBucket();
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        setError(null);

        // Validar que no exceda el máximo
        const currentImages = images.filter(img => !img.toDelete);
        if (currentImages.length + files.length > maxImages) {
            setError(`Solo puedes subir máximo ${maxImages} imágenes`);
            return;
        }

        // Validar cada archivo
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten archivos de imagen');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Cada imagen debe ser menor a 5MB');
                return;
            }
        }

        setIsUploading(true);

        try {
            const newImages: SolicitudImage[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const orden = currentImages.length + i + 1;

                // Crear URL temporal para preview
                const tempUrl = URL.createObjectURL(file);

                newImages.push({
                    url: tempUrl,
                    fileName: file.name,
                    orden,
                    file,
                    isNew: true,
                });
            }

            onImagesChange([...images, ...newImages]);
        } catch (error) {
            console.log(error)
            setError('Error al procesar las imágenes');
        } finally {
            setIsUploading(false);
            // Limpiar el input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...images];
        const imageToRemove = updatedImages[index];

        if (imageToRemove.isNew) {
            // Si es nueva, simplemente la eliminamos del array
            if (imageToRemove.url.startsWith('blob:')) {
                URL.revokeObjectURL(imageToRemove.url);
            }
            updatedImages.splice(index, 1);
        } else {
            // Si es existente, la marcamos para eliminar
            updatedImages[index] = { ...imageToRemove, toDelete: true };
        }

        // Reordenar las imágenes restantes
        const activeImages = updatedImages.filter(img => !img.toDelete);
        activeImages.forEach((img, idx) => {
            img.orden = idx + 1;
        });

        onImagesChange(updatedImages);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const activeImages = images.filter(img => !img.toDelete);
    const canAddMore = activeImages.length < maxImages && !disabled;



    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base">Imágenes de la Solicitud (Opcional)</Label>
                <span className="text-sm text-muted-foreground">
                    {activeImages.length}/{maxImages}
                </span>
            </div>

            {/* Grid de imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeImages.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-4">
                        No hay imágenes cargadas
                    </div>
                )}
                {activeImages.map((image, index) => (
                    <Card key={`${image.url}-${index}`} className="relative">
                        <CardContent className="p-2">
                            <div className="relative aspect-square">
                                <img
                                    src={image.url}
                                    alt={`Imagen ${image.orden}`}
                                    className="w-full h-full object-cover rounded-md"
                                    onError={(e) => {
                                        console.error("Error cargando imagen:", image.url);
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                {!disabled && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                    {image.orden}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {image.fileName}
                            </p>
                        </CardContent>
                    </Card>
                ))}

                {/* Botón para agregar más imágenes */}
                {canAddMore && (
                    <Card className="border-dashed">
                        <CardContent className="p-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full h-full aspect-square flex flex-col items-center justify-center"
                                onClick={triggerFileInput}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                        <span className="text-xs">Procesando...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            Agregar imagen
                                        </span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Input de archivo oculto */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Mensajes de error */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Información adicional */}
            <div className="text-xs text-muted-foreground space-y-1">
                <p>• Máximo {maxImages} imágenes por solicitud</p>
                <p>• Formatos permitidos: JPG, PNG, WebP</p>
                <p>• Tamaño máximo: 5MB por imagen</p>
            </div>
        </div>
    );
}