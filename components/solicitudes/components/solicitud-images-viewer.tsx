"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Download, Eye, Image as ImageIcon } from "lucide-react";

export interface SolicitudImageView {
    id: string;
    url: string;
    fileName: string;
    orden: number;
}

interface SolicitudImagesViewerProps {
    images: SolicitudImageView[];
    title?: string;
}

export function SolicitudImagesViewer({
    images,
    title = "Imágenes de la Solicitud"
}: SolicitudImagesViewerProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeImageModal = () => {
        setSelectedImageIndex(null);
    };

    const goToPrevious = () => {
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const goToNext = () => {
        if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const downloadImage = (imageUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        {title}
                        <span className="text-sm font-normal text-muted-foreground">
                            ({images.length})
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <div key={image.id} className="relative group">
                                <div className="aspect-square relative overflow-hidden rounded-lg border">
                                    <img
                                        src={image.url}
                                        alt={`Imagen ${image.orden}`}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />

                                    {/* Overlay con acciones */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => openImageModal(index)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => downloadImage(image.url, image.fileName)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Número de orden */}
                                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {image.orden}
                                    </div>
                                </div>

                                {/* Nombre del archivo */}
                                <p className="text-xs text-muted-foreground mt-2 truncate">
                                    {image.fileName}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Modal para ver imagen en grande */}
            <Dialog open={selectedImageIndex !== null} onOpenChange={closeImageModal}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>
                                Imagen {selectedImage?.orden} - {selectedImage?.fileName}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} de {images.length}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => selectedImage && downloadImage(selectedImage.url, selectedImage.fileName)}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative">
                        {selectedImage && (
                            <div className="relative max-h-[70vh] overflow-hidden rounded-lg">
                                <img
                                    src={selectedImage.url}
                                    alt={`Imagen ${selectedImage.orden}`}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {/* Navegación */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute left-2 top-1/2 -translate-y-1/2"
                                    onClick={goToPrevious}
                                    disabled={selectedImageIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={goToNext}
                                    disabled={selectedImageIndex === images.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-2 justify-center mt-4 overflow-x-auto">
                            {images.map((image, index) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${index === selectedImageIndex
                                            ? 'border-primary'
                                            : 'border-transparent hover:border-muted-foreground'
                                        }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Thumbnail ${image.orden}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}