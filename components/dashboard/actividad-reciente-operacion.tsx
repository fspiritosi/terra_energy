import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getSolicitudesRecientesOperacion } from "./dashboard-operacion-actions";
import moment from "moment";
import "moment/locale/es";

export async function ActividadRecienteOperacion() {
    const solicitudes = await getSolicitudesRecientesOperacion(5);

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case "aprobada":
                return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Aprobada</Badge>;
            case "rechazada":
                return <Badge variant="destructive">Rechazada</Badge>;
            case "pendiente":
            default:
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>;
        }
    };

    const formatFecha = (fecha: string) => {
        return moment(fecha).locale('es').format('DD/MM/YYYY');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas solicitudes en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
                {solicitudes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No hay actividad reciente</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {solicitudes.map((solicitud) => (
                            <div key={solicitud.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{solicitud.numero_solicitud}</p>
                                        {solicitud.urgente && (
                                            <Badge variant="destructive" className="text-xs">Urgente</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {solicitud.cliente?.nombre} - {solicitud.lugar}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFecha(solicitud.fecha_solicitud)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {getEstadoBadge(solicitud.estado)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Button asChild className="w-full mt-4" variant="outline">
                    <Link href="/dashboard/solicitudes">Ver Todas</Link>
                </Button>
            </CardContent>
        </Card>
    );
}