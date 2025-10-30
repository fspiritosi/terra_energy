"use client";

import { useState, useEffect } from "react";
import { User as TypeUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "@/components/profile/profile-modal";
import { AlertTriangle, Key, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingPasswordAlertProps {
    user: TypeUser | null;
}

export function FloatingPasswordAlert({ user }: FloatingPasswordAlertProps) {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // Solo mostrar si el usuario necesita cambiar contraseña
    const needsPasswordChange = user?.user_metadata?.needs_password_change === true;

    useEffect(() => {
        if (needsPasswordChange && !isDismissed) {
            // Mostrar el alert después de un pequeño delay para una mejor UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [needsPasswordChange, isDismissed]);

    if (!needsPasswordChange || isDismissed) {
        return null;
    }

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsDismissed(true);
        }, 300);
    };

    return (
        <>
            {/* Alert flotante fijo */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-300 ease-in-out",
                    isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                )}
            >
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg shadow-lg p-4 backdrop-blur-sm">
                    {/* Header con icono y botón cerrar */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-amber-100 rounded-full">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </div>
                            <h3 className="font-semibold text-amber-800 text-sm">
                                Acción Requerida
                            </h3>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDismiss}
                            className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Contenido */}
                    <div className="space-y-3">
                        <div className="text-sm text-amber-700">
                            <p className="font-medium mb-1">Contraseña temporal activa</p>
                            <p className="text-xs">
                                Tu contraseña actual es <span className="font-mono bg-amber-100 px-1 rounded">terra123</span>
                            </p>
                            <p className="text-xs mt-1">
                                Cámbiala por seguridad antes de continuar.
                            </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setShowProfileModal(true)}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
                                size="sm"
                            >
                                <Key className="h-3 w-3 mr-1" />
                                Cambiar Ahora
                            </Button>
                            <Button
                                onClick={handleDismiss}
                                variant="outline"
                                className="text-xs h-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                                size="sm"
                            >
                                Más Tarde
                            </Button>
                        </div>
                    </div>

                    {/* Indicador de pulso */}
                    <div className="absolute -top-1 -right-1">
                        <div className="h-3 w-3 bg-amber-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 h-3 w-3 bg-amber-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                </div>
            </div>

            {/* Modal de perfil */}
            <ProfileModal
                user={user}
                open={showProfileModal}
                onOpenChange={(open) => {
                    setShowProfileModal(open);
                    // Si se cierra el modal después de cambiar contraseña, el componente se desmontará automáticamente
                    // porque needsPasswordChange será false
                }}
                showPasswordSection={true}
            />
        </>
    );
}