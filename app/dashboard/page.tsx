import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardCliente } from "@/components/dashboard/dashboard-cliente";
import { DashboardOperacion } from "@/components/dashboard/dashboard-operacion";

// TODO: Obtener del usuario autenticado desde Supabase
const USER_TYPE: "cliente" | "operacion" = "operacion"; // Cambiar para probar

export default function DashboardPage() {
    return (
        <div className="flex flex-col h-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </header>
            <div className="flex-1 overflow-auto p-4">
                <div className="flex flex-col gap-4">
                    {USER_TYPE === "cliente" ? <DashboardCliente /> : <DashboardOperacion />}
                </div>
            </div>
        </div>
    );
}
