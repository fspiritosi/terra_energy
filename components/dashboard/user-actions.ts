"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    return { user, error };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { user: null, error };
  }
}
