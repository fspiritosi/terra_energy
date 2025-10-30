import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { AuthError, EmailOtpType } from "@supabase/supabase-js";

export default async function ConfirmPage({
    searchParams,
}: {
    searchParams: { token_hash?: string; type?: string; next?: string };
}) {
    const { token_hash, type, next } = searchParams;

    if (token_hash && type) {
        const supabase = await createClient();

        try {
            const { error } = await supabase.auth.verifyOtp({
                type: type as EmailOtpType,
                token_hash,
            });

            if (!error) {
                // Determine redirect based on type
                let redirectUrl = next ?? "/dashboard";

                switch (type) {
                    case 'recovery':
                        redirectUrl = "/auth/reset-password";
                        break;
                    case 'signup':
                    case 'invite':
                    case 'magiclink':
                    case 'email_change':
                    default:
                        redirectUrl = next ?? "/dashboard";
                        break;
                }

                redirect(redirectUrl);
            } else {
                // Redirect to error page with error message
                redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
            }
        } catch (error) {
            // Handle any unexpected errors
            const errorMessage = (error as AuthError)?.message || "Error de verificación";
            redirect(`/auth/error?message=${encodeURIComponent(errorMessage)}`);
        }
    }

    // If no token_hash or type, redirect to login
    redirect("/auth/login");
}