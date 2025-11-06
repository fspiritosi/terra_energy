import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import Link from "next/link";
import { getSolicitudesSinAsignar } from "./dashboard-operacion-actions";

export async function SolicitudesSinAsignar() {
    const solicitudes = await getSolicitudesSinAsignar(5);

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitudes Pendientes</CardTitle>
                <CardDescription>Requieren revisión y aprobación</CardDescription>
            </CardHeader>
            <CardContent>
                {solicitudes.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No hay solicitudes pendientes</p>
                    </div>
                ) : (
                    <div className="space-y-3">
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
                                        Responsable: {solicitud.responsable} • {formatFecha(solicitud.fecha_solicitud)}
                                    </p>
                                </div>
                                <Button size="sm" asChild>
                                    <Link href={`/dashboard/solicitudes?review=${solicitud.numero_solicitud}`}>
                                        Revisar
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                <Button asChild className="w-full mt-4" variant="outline">
                    <Link href="/dashboard/solicitudes">Ver Todas las Solicitudes</Link>
                </Button>
            </CardContent>
        </Card>
    );
}