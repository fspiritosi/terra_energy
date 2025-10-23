"use client";

import { useUserType } from "@/hooks/use-user-type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserTypeDebug() {
    const { userProfile, user, loading, userType } = useUserType();

    if (loading) {
        return <div>Cargando información del usuario...</div>;
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Debug: Información del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <strong>User Type:</strong> {userType}
                </div>
                <div>
                    <strong>Nombre:</strong> {userProfile?.nombre || "No disponible"}
                </div>
                <div>
                    <strong>Email:</strong> {userProfile?.email || "No disponible"}
                </div>
                <div>
                    <strong>ID:</strong> {userProfile?.id || "No disponible"}
                </div>
                <div>
                    <strong>Metadata user_type:</strong> {user?.user_metadata?.user_type || "No definido"}
                </div>
                <div>
                    <strong>Raw metadata:</strong>
                    <pre className="text-xs bg-muted p-2 rounded mt-1">
                        {JSON.stringify(user?.user_metadata, null, 2)}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}