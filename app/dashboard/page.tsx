"use client";

import { DashboardCliente } from "@/components/dashboard/dashboard-cliente";
import { DashboardOperacion } from "@/components/dashboard/dashboard-operacion";
import { useUserType } from "@/hooks/use-user-type";
import { Skeleton } from "@/components/ui/skeleton";
// import { UserTypeDebug } from "@/components/debug/user-type-debug";

export default function DashboardPage() {
    const { userType, loading } = useUserType();

    if (loading) {
        return (
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
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Debug component - remover en producción */}
            {/* <UserTypeDebug /> */}

            {userType === "cliente" ? <DashboardCliente /> : <DashboardOperacion />}
        </div>
    );
}
