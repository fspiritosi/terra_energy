import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSolicitudesRecientes } from "./dashboard-actions";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import moment from "moment";
import "moment/locale/es";

export async function SolicitudesRecientes() {
    const solicitudes = await getSolicitudesRecientes(5);

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
                <CardTitle>Solicitudes Recientes</CardTitle>
                <CardDescription>Últimas 5 solicitudes de inspección</CardDescription>
            </CardHeader>
            <CardContent>
                {solicitudes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No hay solicitudes registradas</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {solicitudes.map((solicitud) => (
                            <div key={solicitud.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium">{solicitud.numero_solicitud}</p>
                                    <p className="text-sm text-muted-foreground">{solicitud.lugar}</p>
                                    <p className="text-xs text-muted-foreground">Responsable: {solicitud.responsable}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm">{formatFecha(solicitud.fecha_solicitud)}</p>
                                    {getEstadoBadge(solicitud.estado)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}