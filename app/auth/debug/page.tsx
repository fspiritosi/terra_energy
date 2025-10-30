import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export default async function DebugPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const { token_hash, type } = params;

    let verificationResult = null;
    let userInfo = null;

    if (token_hash && type) {
        const supabase = await createClient();

        try {
            console.log("🔍 [DEBUG] Intentando verificar token:", {
                token_hash: token_hash.substring(0, 20) + "...",
                type
            });

            const { data, error } = await supabase.auth.verifyOtp({
                type: type as EmailOtpType,
                token_hash,
            });

            verificationResult = {
                success: !error,
                error: error?.message,
                hasUser: !!data?.user,
                hasSession: !!data?.session,
                userEmail: data?.user?.email,
                userId: data?.user?.id,
            };

            // También obtener info del usuario actual
            const { data: currentUser } = await supabase.auth.getUser();
            userInfo = {
                isAuthenticated: !!currentUser.user,
                currentUserEmail: currentUser.user?.email,
                currentUserId: currentUser.user?.id,
            };

        } catch (error) {
            verificationResult = {
                success: false,
                error: (error as Error).message,
                hasUser: false,
                hasSession: false,
            };
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🔍 Debug Auth Parameters</h1>

            <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="font-semibold mb-2">📋 URL Parameters:</h2>
                    <pre className="text-sm">{JSON.stringify(params, null, 2)}</pre>
                </div>

                {verificationResult && (
                    <div className="bg-blue-50 p-4 rounded">
                        <h2 className="font-semibold mb-2">🔐 Token Verification Result:</h2>
                        <pre className="text-sm">{JSON.stringify(verificationResult, null, 2)}</pre>
                    </div>
                )}

                {userInfo && (
                    <div className="bg-green-50 p-4 rounded">
                        <h2 className="font-semibold mb-2">👤 Current User Info:</h2>
                        <pre className="text-sm">{JSON.stringify(userInfo, null, 2)}</pre>
                    </div>
                )}

                <div className="bg-yellow-50 p-4 rounded">
                    <h2 className="font-semibold mb-2">🔗 Test Links:</h2>
                    <div className="space-y-2">
                        <a href="/auth/confirm" className="block text-blue-600 hover:underline">
                            /auth/confirm (sin parámetros)
                        </a>
                        <a href="/auth/error" className="block text-blue-600 hover:underline">
                            /auth/error (sin mensaje)
                        </a>
                        <a href="/auth/login" className="block text-blue-600 hover:underline">
                            /auth/login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}