import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Users, ClipboardCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export function DashboardOperacion() {
    return (
        <>
            {/* Resumen de estadísticas */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Requieren asignación</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inspecciones Hoy</CardTitle>
                        <Calendar className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">3 completadas</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inspectores Activos</CardTitle>
                        <Users className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">8 en campo</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reprogramaciones</CardTitle>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">Esta semana</p>
                    </CardContent>
                </Card>
            </div>

            {/* Acciones rápidas */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Solicitudes Sin Asignar</CardTitle>
                        <CardDescription>Requieren asignación de inspector</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { id: "SOL-015", cliente: "Cliente A", tipo: "Instalación", urgente: true },
                                { id: "SOL-016", cliente: "Cliente B", tipo: "Medidor", urgente: false },
                                { id: "SOL-017", cliente: "Cliente C", tipo: "Transformador", urgente: true },
                            ].map((solicitud) => (
                                <div key={solicitud.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium flex items-center gap-2">
                                            {solicitud.id}
                                            {solicitud.urgente && (
                                                <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-0.5 rounded">Urgente</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{solicitud.cliente} - {solicitud.tipo}</p>
                                    </div>
                                    <Button size="sm">Asignar</Button>
                                </div>
                            ))}
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link href="/dashboard/solicitudes">Ver Todas</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Inspecciones de Hoy</CardTitle>
                        <CardDescription>Programadas para hoy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { id: "INS-045", inspector: "Juan Pérez", hora: "09:00", estado: "completada" },
                                { id: "INS-046", inspector: "María García", hora: "11:00", estado: "en_curso" },
                                { id: "INS-047", inspector: "Carlos López", hora: "14:00", estado: "pendiente" },
                            ].map((inspeccion) => (
                                <div key={inspeccion.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="font-medium">{inspeccion.id} - {inspeccion.hora}</p>
                                        <p className="text-sm text-muted-foreground">{inspeccion.inspector}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${inspeccion.estado === "completada" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                                        inspeccion.estado === "en_curso" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" :
                                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                        }`}>
                                        {inspeccion.estado === "completada" ? "Completada" :
                                            inspeccion.estado === "en_curso" ? "En Curso" : "Pendiente"}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link href="/dashboard/calendario">Ver Calendario</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Alertas y notificaciones */}
            <Card>
                <CardHeader>
                    <CardTitle>Alertas Recientes</CardTitle>
                    <CardDescription>Eventos que requieren atención</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">Reprogramación solicitada</p>
                                <p className="text-xs text-muted-foreground">SOL-014 - Cliente solicita cambio de fecha por clima</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                            <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">Informe pendiente de revisión</p>
                                <p className="text-xs text-muted-foreground">INS-042 - Requiere aprobación antes de enviar al cliente</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
