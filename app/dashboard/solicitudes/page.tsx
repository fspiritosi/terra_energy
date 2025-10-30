
// import { useUserType } from "@/hooks/use-user-type";
// import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/components/dashboard/user-actions";
import { SolicitudesCliente } from "@/components/solicitudes/solicitudes-cliente";
import { SolicitudesOperacion } from "@/components/solicitudes/solicitudes-operacion";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function SolicitudesPage() {
    const { user, error } = await getCurrentUser()

    if (error) {
        console.log(error)
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            </div>
        )
    }

    return <Suspense fallback={
        <div className="flex flex-col gap-4 p-6">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    }>
        {user?.user_metadata?.user_type === "cliente"
            ? <SolicitudesCliente />
            : <SolicitudesOperacion />}
    </Suspense>
}