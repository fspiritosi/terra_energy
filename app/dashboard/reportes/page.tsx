import Reportes from "@/components/reportes/Reportes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportesPage() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Reportes de Verificaciones</CardTitle>
                    <CardDescription>
                        Visualiza todas las verificaciones disponibles. Haz clic en el ícono de enlace para ver los detalles completos de cada verificación.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Reportes />
                </CardContent>
            </Card>
        </div>
    )
}

