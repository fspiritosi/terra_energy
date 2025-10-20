import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import Link from "next/link";

export function DashboardCliente() {
    return (
        <>
            {/* Resumen de estadísticas */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 este mes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">En proceso</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">66.7% tasa aprobación</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
                        <XCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Con observaciones</p>
                    </CardContent>
                </Card>
            </div>

            {/* Acción rápida */}
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Solicitud de Inspección</CardTitle>
                    <CardDescription>
                        Crea una nueva solicitud para programar una inspección
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/solicitudes/nueva">
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Solicitud
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Solicitudes recientes */}
            <Card>
                <CardHeader>
                    <CardTitle>Solicitudes Recientes</CardTitle>
                    <CardDescription>Últimas solicitudes de inspección</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { id: "SOL-001", tipo: "Instalación Eléctrica", estado: "pendiente", fecha: "2025-01-15" },
                            { id: "SOL-002", tipo: "Medidor", estado: "en_curso", fecha: "2025-01-14" },
                            { id: "SOL-003", tipo: "Transformador", estado: "aprobada", fecha: "2025-01-10" },
                        ].map((solicitud) => (
                            <div key={solicitud.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                <div>
                                    <p className="font-medium">{solicitud.id}</p>
                                    <p className="text-sm text-muted-foreground">{solicitud.tipo}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">{solicitud.fecha}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${solicitud.estado === "aprobada" ? "bg-green-100 text-green-800" :
                                            solicitud.estado === "en_curso" ? "bg-blue-100 text-blue-800" :
                                                "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {solicitud.estado === "aprobada" ? "Aprobada" :
                                            solicitud.estado === "en_curso" ? "En Curso" : "Pendiente"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
