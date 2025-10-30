"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User as TypeUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { FloatingPasswordAlert } from "@/components/dashboard/floating-password-alert";

interface PasswordAlertContextType {
    user: TypeUser | null;
    refreshUser: () => Promise<void>;
}

const PasswordAlertContext = createContext<PasswordAlertContextType | undefined>(undefined);

export function usePasswordAlert() {
    const context = useContext(PasswordAlertContext);
    if (context === undefined) {
        throw new Error('usePasswordAlert must be used within a PasswordAlertProvider');
    }
    return context;
}

interface PasswordAlertProviderProps {
    children: React.ReactNode;
    initialUser?: TypeUser | null;
}

export function PasswordAlertProvider({ children, initialUser }: PasswordAlertProviderProps) {
    const [user, setUser] = useState<TypeUser | null>(initialUser || null);
    const supabase = createClient();

    const refreshUser = useCallback(async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
        } catch (error) {
            console.error("Error refreshing user:", error);
        }
    }, [supabase.auth]);

    useEffect(() => {
        // Obtener usuario inicial si no se proporcionó
        if (!initialUser) {
            refreshUser();
        }

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    setUser(session?.user || null);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [initialUser, supabase.auth, refreshUser]);

    return (
        <PasswordAlertContext.Provider value={{ user, refreshUser }}>
            {children}
            {/* Alert flotante global */}
            <FloatingPasswordAlert user={user} />
        </PasswordAlertContext.Provider>
    );
}