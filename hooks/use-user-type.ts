"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export type UserType = "cliente" | "operacion" | "inspector";

export interface UserProfile {
  id: string;
  email: string;
  user_type: UserType;
  nombre: string;
  avatar_url?: string;
}

export function useUserType() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      // Obtener usuario autenticado
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);

        // Extraer datos del usuario
        const userType =
          (authUser.user_metadata?.user_type as UserType) || "operacion";
        const nombre =
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "Usuario";

        setUserProfile({
          id: authUser.id,
          email: authUser.email || "",
          user_type: userType,
          nombre: nombre,
          avatar_url: authUser.user_metadata?.avatar_url || "",
        });
      }

      setLoading(false);
    }

    loadUser();

    // Escuchar cambios de autenticación
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const userType =
          (session.user.user_metadata?.user_type as UserType) || "operacion";
        const nombre =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "Usuario";

        setUser(session.user);
        setUserProfile({
          id: session.user.id,
          email: session.user.email || "",
          user_type: userType,
          nombre: nombre,
          avatar_url: session.user.user_metadata?.avatar_url || "",
        });
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    userProfile,
    user,
    loading,
    userType: userProfile?.user_type || "operacion",
  };
}
