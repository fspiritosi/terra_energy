import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Users } from "lucide-react";
import { getDashboardOperacionStats } from "./dashboard-operacion-actions";

export async function StatsCardsOperacion() {
    const stats = await getDashboardOperacionStats();

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
                    <FileText className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.solicitudesPendientes}</div>
                    <p className="text-xs text-muted-foreground">Requieren revisión</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.solicitudesAprobadas}</div>
                    <p className="text-xs text-muted-foreground">Listas para inspección</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
                    <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.solicitudesRechazadas}</div>
                    <p className="text-xs text-muted-foreground">Con observaciones</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalClientes}</div>
                    <p className="text-xs text-muted-foreground">En el sistema</p>
                </CardContent>
            </Card>
        </div>
    );
}