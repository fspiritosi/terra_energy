import { DashboardCliente } from "@/components/dashboard/dashboard-cliente";
import { DashboardOperacion } from "@/components/dashboard/dashboard-operacion";
import { getCurrentUser } from "@/components/dashboard/user-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function DashboardPage() {
    const { user, error } = await getCurrentUser();

    if (error) {
        console.log(error);
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                <p className="text-muted-foreground">No se pudo cargar la información del usuario</p>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-64" />
            </div>
        }>
            <div className="flex flex-col gap-4">
                {user?.user_metadata?.user_type === "cliente" ? <DashboardCliente /> : <DashboardOperacion />}
            </div>
        </Suspense>
    );
}
