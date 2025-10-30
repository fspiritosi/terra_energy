"use client";

import { User as TypeUser } from "@supabase/supabase-js";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProfileForm } from "./profile-form";

interface ProfileModalProps {
    user: TypeUser | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    showPasswordSection?: boolean;
}

export function ProfileModal({ user, open, onOpenChange, showPasswordSection = false }: ProfileModalProps) {
    const needsPasswordChange = user?.user_metadata?.needs_password_change === true;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {needsPasswordChange ? "Configurar Cuenta" : "Mi Cuenta"}
                    </DialogTitle>
                    <DialogDescription>
                        {needsPasswordChange
                            ? "Completa la configuración de tu cuenta cambiando tu contraseña temporal."
                            : "Actualiza tu información personal y foto de perfil."
                        }
                    </DialogDescription>
                </DialogHeader>
                <ProfileForm
                    user={user}
                    onSuccess={() => onOpenChange(false)}
                    showPasswordSection={showPasswordSection}
                />
            </DialogContent>
        </Dialog>
    );
}