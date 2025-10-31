import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Calendar, Settings } from "lucide-react";
import Link from "next/link";

export function AccionesRapidasOperacion() {
    const acciones = [
        {
            title: "Gestionar Solicitudes",
            description: "Revisar y aprobar solicitudes pendientes",
            icon: FileText,
            href: "/dashboard/solicitudes",
            color: "text-blue-600"
        },
        {
            title: "Administrar Clientes",
            description: "Ver y gestionar información de clientes",
            icon: Users,
            href: "/dashboard/clientes",
            color: "text-green-600"
        },
        {
            title: "Programar Inspecciones",
            description: "Asignar fechas y recursos",
            icon: Calendar,
            href: "/dashboard/calendario",
            color: "text-purple-600"
        },
        {
            title: "Configuración",
            description: "Ajustes del sistema y usuarios",
            icon: Settings,
            href: "/dashboard/configuracion",
            color: "text-gray-600"
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Acceso directo a funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                    {acciones.map((accion) => {
                        const IconComponent = accion.icon;
                        return (
                            <Button
                                key={accion.href}
                                asChild
                                variant="outline"
                                className="h-auto p-4 justify-start"
                            >
                                <Link href={accion.href}>
                                    <div className="flex items-start gap-3">
                                        <IconComponent className={`h-5 w-5 mt-0.5 ${accion.color}`} />
                                        <div className="text-left">
                                            <p className="font-medium text-sm">{accion.title}</p>
                                            <p className="text-xs text-muted-foreground">{accion.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}