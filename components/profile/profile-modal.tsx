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
}

export function ProfileModal({ user, open, onOpenChange }: ProfileModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Mi Cuenta</DialogTitle>
                    <DialogDescription>
                        Actualiza tu información personal y foto de perfil.
                    </DialogDescription>
                </DialogHeader>
                <ProfileForm user={user} onSuccess={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}