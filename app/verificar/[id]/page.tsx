import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, FileText, Calendar, MapPin, Building2, Wrench } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerificarDocumentoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Obtener el documento
  const { data: documento, error: docError } = await supabase
    .from("documentos_inspeccion")
    .select("*")
    .eq("id", id)
    .single();

  if (docError || !documento) {
    notFound();
  }

  // Obtener la inspección relacionada
  const { data: inspeccion } = await supabase
    .from("inspecciones")
    .select(`
      *,
      solicitud:solicitudes_inspeccion (
        cliente:clientes (
          nombre
        )
      )
    `)
    .eq("id", documento.inspeccion_id)
    .single();

  const solicitud = inspeccion?.solicitud as any;
  const clienteNombre = solicitud?.cliente?.nombre || inspeccion?.cliente_nombre || "N/A";

  const resultadoConfig = {
    aprobado: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badge: "bg-green-100 text-green-800",
      label: "APROBADO",
    },
    rechazado: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      badge: "bg-red-100 text-red-800",
      label: "RECHAZADO",
    },
    con_observaciones: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      badge: "bg-yellow-100 text-yellow-800",
      label: "CON OBSERVACIONES",
    },
    pendiente: {
      icon: AlertCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      badge: "bg-gray-100 text-gray-800",
      label: "PENDIENTE",
    },
  };

  const config = resultadoConfig[documento.resultado as keyof typeof resultadoConfig] || resultadoConfig.pendiente;
  const ResultadoIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-800">Terra Energy Services</h1>
              <p className="text-xs text-muted-foreground">Verificación de Documento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Verificación exitosa */}
        <Card className={`mb-6 ${config.borderColor} border-2`}>
          <CardHeader className={`${config.bgColor} rounded-t-lg`}>
            <div className="flex items-center justify-center gap-3">
              <ResultadoIcon className={`h-12 w-12 ${config.color}`} />
              <div className="text-center">
                <CardTitle className={`text-2xl ${config.color}`}>
                  Documento Verificado
                </CardTitle>
                <CardDescription>
                  Este documento es auténtico y fue emitido por Terra Energy Services
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Resultado de la inspección */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resultado de la Inspección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Badge className={`text-lg px-6 py-2 ${config.badge}`}>
                {config.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Detalles del documento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalles del Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nº Documento</p>
                <p className="font-semibold">{documento.numero_documento}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Revisión</p>
                <p className="font-semibold">{documento.revision || "00"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Fecha Emisión
                </p>
                <p className="font-semibold">
                  {new Date(documento.fecha_documento).toLocaleDateString("es-AR")}
                </p>
              </div>
              {documento.fecha_vencimiento && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Fecha Vencimiento
                  </p>
                  <p className="font-semibold">
                    {new Date(documento.fecha_vencimiento).toLocaleDateString("es-AR")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la inspección */}
        {inspeccion && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalles de la Inspección</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nº Inspección</p>
                  <p className="font-semibold">{inspeccion.numero_inspeccion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-4 w-4" /> Cliente
                  </p>
                  <p className="font-semibold">{clienteNombre}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Lugar
                  </p>
                  <p className="font-semibold">{inspeccion.lugar}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Wrench className="h-4 w-4" /> Equipo
                  </p>
                  <p className="font-semibold">{inspeccion.equipo}</p>
                </div>
                {inspeccion.fecha_completada && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Fecha de Inspección
                    </p>
                    <p className="font-semibold">
                      {new Date(inspeccion.fecha_completada).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observaciones */}
        {documento.observaciones_generales && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{documento.observaciones_generales}</p>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground mt-8 px-4">
          <p>
            Este documento fue verificado electrónicamente. La reproducción parcial de este 
            documento no es válida. Los resultados se refieren al momento en que se 
            realizaron las inspecciones.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Terra Energy Services. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}

