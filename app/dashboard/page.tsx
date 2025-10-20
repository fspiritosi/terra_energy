import { DashboardCliente } from "@/components/dashboard/dashboard-cliente";
import { DashboardOperacion } from "@/components/dashboard/dashboard-operacion";

// TODO: Obtener del usuario autenticado desde Supabase
const USER_TYPE: "cliente" | "operacion" = "operacion"; // Cambiar para probar

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            {USER_TYPE === "cliente" ? <DashboardCliente /> : <DashboardOperacion />}
        </div>
    );
}
