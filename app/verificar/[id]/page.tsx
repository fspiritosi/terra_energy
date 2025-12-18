import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Calendar, 
  MapPin, 
  Building2, 
  Wrench,
  Download,
  ShieldCheck,
  ClipboardCheck,
  CheckSquare,
  Square,
  MinusSquare
} from "lucide-react";
import Link from "next/link";

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
        id,
        numero_solicitud,
        cliente:clientes (
          id,
          nombre,
          logo
        ),
        trabajos:solicitud_trabajos (
          id,
          tipo_inspeccion:tipos_inspeccion_checklist (
            id,
            codigo,
            nombre
          )
        )
      )
    `)
    .eq("id", documento.inspeccion_id)
    .single();

  // Obtener las respuestas del checklist
  // Nota: Los requisitos pueden tener seccion_id directo O subcategoria_id (donde la sección viene de la subcategoría)
  const { data: respuestas } = await supabase
    .from("inspeccion_respuestas")
    .select(`
      *,
      requisito:checklist_requisitos (
        id,
        descripcion,
        orden,
        seccion_id,
        subcategoria_id,
        seccion:checklist_secciones (
          id,
          nombre,
          orden,
          tipo_inspeccion:tipos_inspeccion_checklist (
            id,
            nombre,
            codigo
          )
        ),
        subcategoria:checklist_subcategorias (
          id,
          nombre,
          orden,
          seccion:checklist_secciones (
            id,
            nombre,
            orden,
            tipo_inspeccion:tipos_inspeccion_checklist (
              id,
              nombre,
              codigo
            )
          )
        )
      ),
      tipo_respuesta:tipos_respuesta (
        id,
        codigo,
        nombre,
        tipo_dato
      )
    `)
    .eq("inspeccion_id", documento.inspeccion_id)
    .order("created_at", { ascending: true });

  const solicitud = inspeccion?.solicitud as any;
  const clienteNombre = solicitud?.cliente?.nombre || inspeccion?.cliente_nombre || "N/A";
  const trabajos = solicitud?.trabajos || [];

  // Organizar respuestas por tipo de inspección > sección > subcategoría > requisito
  type RespuestaItem = {
    tipo: string;
    tipoCodigo: string;
    tipoNombre: string;
    valor: any;
  };

  type RequisitoItem = {
    id: string;
    descripcion: string;
    orden: number;
    respuestas: RespuestaItem[];
  };

  const respuestasOrganizadas: Record<string, {
    tipoInspeccion: { id: string; nombre: string; codigo: string };
    secciones: Record<string, {
      nombre: string;
      orden: number;
      subcategorias: Record<string, {
        nombre: string;
        orden: number;
        requisitos: RequisitoItem[];
      }>;
      requisitosSinSubcategoria: RequisitoItem[];
    }>;
  }> = {};

  if (respuestas) {
    for (const resp of respuestas) {
      const requisito = resp.requisito as any;
      const subcategoria = requisito?.subcategoria;
      const tipoRespuesta = resp.tipo_respuesta as any;
      
      // La sección puede venir directamente del requisito O a través de la subcategoría
      const seccion = requisito?.seccion || subcategoria?.seccion;
      const tipoInspeccion = seccion?.tipo_inspeccion;

      if (!tipoInspeccion || !seccion) continue;

      // Inicializar tipo de inspección
      if (!respuestasOrganizadas[tipoInspeccion.id]) {
        respuestasOrganizadas[tipoInspeccion.id] = {
          tipoInspeccion: {
            id: tipoInspeccion.id,
            nombre: tipoInspeccion.nombre,
            codigo: tipoInspeccion.codigo,
          },
          secciones: {},
        };
      }

      // Inicializar sección
      if (!respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id]) {
        respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id] = {
          nombre: seccion.nombre,
          orden: seccion.orden,
          subcategorias: {},
          requisitosSinSubcategoria: [],
        };
      }

      // Determinar valor de la respuesta
      let valorRespuesta: any = null;
      if (resp.valor_booleano !== null && resp.valor_booleano !== undefined) valorRespuesta = resp.valor_booleano;
      else if (resp.valor_texto !== null && resp.valor_texto !== undefined) valorRespuesta = resp.valor_texto;
      else if (resp.valor_numero !== null && resp.valor_numero !== undefined) valorRespuesta = resp.valor_numero;
      else if (resp.valor_fecha !== null && resp.valor_fecha !== undefined) valorRespuesta = resp.valor_fecha;
      else if (resp.valor_tiempo !== null && resp.valor_tiempo !== undefined) valorRespuesta = resp.valor_tiempo;

      const respuestaItem: RespuestaItem = {
        tipo: tipoRespuesta?.tipo_dato || "texto",
        tipoCodigo: tipoRespuesta?.codigo || "",
        tipoNombre: tipoRespuesta?.nombre || "",
        valor: valorRespuesta,
      };

      if (subcategoria) {
        // Inicializar subcategoría
        if (!respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id].subcategorias[subcategoria.id]) {
          respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id].subcategorias[subcategoria.id] = {
            nombre: subcategoria.nombre,
            orden: subcategoria.orden,
            requisitos: [],
          };
        }

        // Buscar si ya existe el requisito
        let existingReq = respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id].subcategorias[subcategoria.id].requisitos.find(
          (r) => r.id === requisito.id
        );

        if (existingReq) {
          existingReq.respuestas.push(respuestaItem);
        } else {
          respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id].subcategorias[subcategoria.id].requisitos.push({
            id: requisito.id,
            descripcion: requisito.descripcion,
            orden: requisito.orden,
            respuestas: [respuestaItem],
          });
        }
      } else {
        // Requisito sin subcategoría
        let existingReq = respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id].requisitosSinSubcategoria.find(
          (r) => r.id === requisito.id
        );

        if (existingReq) {
          existingReq.respuestas.push(respuestaItem);
        } else {
          respuestasOrganizadas[tipoInspeccion.id].secciones[seccion.id].requisitosSinSubcategoria.push({
            id: requisito.id,
            descripcion: requisito.descripcion,
            orden: requisito.orden,
            respuestas: [respuestaItem],
          });
        }
      }
    }
  }

  const resultadoConfig = {
    aprobado: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      badge: "bg-green-100 text-green-800 border-green-300",
      label: "APROBADO",
    },
    rechazado: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      badge: "bg-red-100 text-red-800 border-red-300",
      label: "RECHAZADO",
    },
    con_observaciones: {
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      label: "CON OBSERVACIONES",
    },
    pendiente: {
      icon: AlertCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "border-muted",
      badge: "bg-muted text-muted-foreground",
      label: "PENDIENTE",
    },
  };

  const config = resultadoConfig[documento.resultado as keyof typeof resultadoConfig] || resultadoConfig.pendiente;
  const ResultadoIcon = config.icon;

  // Función para renderizar cada respuesta individualmente
  const renderRespuesta = (respuesta: RespuestaItem) => {
    const { tipo, tipoCodigo, tipoNombre, valor } = respuesta;

    // Si no hay valor
    if (valor === null || valor === undefined) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MinusSquare className="h-4 w-4" />
          <span className="text-xs">{tipoNombre}: Sin respuesta</span>
        </div>
      );
    }

    // Para valores booleanos
    if (tipo === "booleano") {
      const isTrue = valor === true;
      return (
        <div className={`flex items-center gap-2 ${isTrue ? "text-green-600" : "text-red-600"}`}>
          {isTrue ? (
            <CheckSquare className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">
            {tipoNombre}: {isTrue ? "Sí / Cumple" : "No / No Cumple"}
          </span>
        </div>
      );
    }

    // Para valores numéricos
    if (tipo === "numero") {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <span className="text-xs font-medium bg-blue-100 px-2 py-0.5 rounded">
            {tipoNombre}: {valor}
          </span>
        </div>
      );
    }

    // Para textos
    return (
      <div className="flex items-center gap-2 text-foreground">
        <span className="text-xs">
          <span className="font-medium">{tipoNombre}:</span> {String(valor)}
        </span>
      </div>
    );
  };

  // Función para verificar si un requisito tiene alguna respuesta fallida
  const tieneRespuestaFallida = (requisito: RequisitoItem) => {
    return requisito.respuestas.some(
      (r) => r.tipo === "booleano" && r.valor === false
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header con colores del proyecto */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Terra Energy Services</h1>
                <p className="text-xs text-primary-foreground/80">Verificación de Documento</p>
              </div>
            </div>
            <Button asChild variant="secondary" className="gap-2">
              <Link href={`/api/documentos/${id}/pdf`} target="_blank">
                <Download className="h-4 w-4" />
                Descargar PDF
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Verificación de autenticidad - siempre verde */}
        <Card className="border-green-500 border-2">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="h-12 w-12 text-green-600" />
              <div className="text-center">
                <CardTitle className="text-2xl text-green-700">
                  Documento Auténtico
                </CardTitle>
                <CardDescription className="text-green-600">
                  Este documento fue emitido oficialmente por Terra Energy Services y su contenido es verificable
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Resultado de la inspección - separado */}
        <Card className={`${config.borderColor} border-2`}>
          <CardHeader className={`${config.bgColor} rounded-t-lg pb-4`}>
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <ClipboardCheck className="h-5 w-5" />
              Resultado de la Inspección
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-3">
                <ResultadoIcon className={`h-10 w-10 ${config.color}`} />
                <Badge className={`text-xl px-6 py-2 ${config.badge} border`}>
                  {config.label}
                </Badge>
              </div>
            </div>
            {documento.resultado === "rechazado" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-2">
                  ⚠️ Esta inspección fue rechazada debido a uno o más requisitos no cumplidos.
                </p>
                <p className="text-xs text-red-600">
                  Revise el checklist a continuación para identificar los items marcados en rojo.
                </p>
              </div>
            )}
            {documento.observaciones_generales && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Observaciones:</p>
                <p className="text-sm text-muted-foreground">{documento.observaciones_generales}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalles del documento y la inspección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles del documento */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-secondary text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Detalles del Documento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Nº Documento</p>
                  <p className="font-semibold text-foreground">{documento.numero_documento}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Revisión</p>
                  <p className="font-semibold text-foreground">{documento.revision || "00"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" /> Fecha Emisión
                  </p>
                  <p className="font-semibold text-foreground">
                    {new Date(documento.fecha_documento).toLocaleDateString("es-AR")}
                  </p>
                </div>
                {documento.fecha_vencimiento && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" /> Vencimiento
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(documento.fecha_vencimiento).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalles de la inspección */}
          {inspeccion && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-secondary text-lg">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Detalles de la Inspección
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Nº Inspección</p>
                    <p className="font-semibold text-foreground">{inspeccion.numero_inspeccion}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-primary" /> Cliente
                    </p>
                    <p className="font-semibold text-foreground">{clienteNombre}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" /> Lugar
                    </p>
                    <p className="font-semibold text-foreground">{inspeccion.lugar}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Wrench className="h-3 w-3 text-primary" /> Equipo
                    </p>
                    <p className="font-semibold text-foreground">{inspeccion.equipo}</p>
                  </div>
                </div>
                {inspeccion.fecha_completada && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" /> Fecha de Inspección
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(inspeccion.fecha_completada).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tipos de inspección realizados */}
        {trabajos.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-secondary text-lg">Tipos de Inspección Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {trabajos.map((trabajo: any) => (
                  trabajo.tipo_inspeccion && (
                    <Badge key={trabajo.id} variant="outline" className="text-sm">
                      {trabajo.tipo_inspeccion.codigo} - {trabajo.tipo_inspeccion.nombre}
                    </Badge>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checklist con respuestas */}
        {Object.keys(respuestasOrganizadas).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Checklist de Inspección - Respuestas Registradas
              </CardTitle>
              <CardDescription>
                Detalle completo de las verificaciones realizadas durante la inspección
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.values(respuestasOrganizadas).map((tipoData) => (
                <div key={tipoData.tipoInspeccion.id} className="space-y-4">
                  {/* Tipo de inspección */}
                  <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg">
                    <Badge className="bg-primary text-primary-foreground">
                      {tipoData.tipoInspeccion.codigo}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      {tipoData.tipoInspeccion.nombre}
                    </span>
                  </div>

                  {/* Secciones */}
                  {Object.values(tipoData.secciones)
                    .sort((a, b) => a.orden - b.orden)
                    .map((seccion, seccionIdx) => (
                      <div key={seccionIdx} className="ml-4 space-y-3">
                        <h4 className="font-medium text-secondary border-b pb-1">
                          {seccion.nombre}
                        </h4>

                        {/* Requisitos sin subcategoría */}
                        {seccion.requisitosSinSubcategoria.length > 0 && (
                          <div className="space-y-2 ml-2">
                            {seccion.requisitosSinSubcategoria
                              .sort((a, b) => a.orden - b.orden)
                              .map((req) => {
                                const tieneFallo = tieneRespuestaFallida(req);
                                return (
                                  <div
                                    key={req.id}
                                    className={`p-3 rounded-md border ${
                                      tieneFallo 
                                        ? "bg-red-50 border-red-300" 
                                        : "bg-muted/50 border-transparent"
                                    }`}
                                  >
                                    <p className={`text-sm mb-2 ${tieneFallo ? "text-red-900 font-medium" : "text-foreground"}`}>
                                      {req.descripcion}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                      {req.respuestas.map((resp, respIdx) => (
                                        <div key={respIdx}>
                                          {renderRespuesta(resp)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}

                        {/* Subcategorías */}
                        {Object.values(seccion.subcategorias)
                          .sort((a, b) => a.orden - b.orden)
                          .map((subcategoria, subIdx) => (
                            <div key={subIdx} className="ml-2 space-y-2">
                              <h5 className="text-sm font-medium text-muted-foreground">
                                {subcategoria.nombre}
                              </h5>
                              <div className="space-y-2 ml-2">
                                {subcategoria.requisitos
                                  .sort((a, b) => a.orden - b.orden)
                                  .map((req) => {
                                    const tieneFallo = tieneRespuestaFallida(req);
                                    return (
                                      <div
                                        key={req.id}
                                        className={`p-3 rounded-md border ${
                                          tieneFallo 
                                            ? "bg-red-50 border-red-300" 
                                            : "bg-muted/50 border-transparent"
                                        }`}
                                      >
                                        <p className={`text-sm mb-2 ${tieneFallo ? "text-red-900 font-medium" : "text-foreground"}`}>
                                          {req.descripcion}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                          {req.respuestas.map((resp, respIdx) => (
                                            <div key={respIdx}>
                                              {renderRespuesta(resp)}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}

                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground px-4 space-y-2">
          <p>
            Este documento fue verificado electrónicamente. La reproducción parcial de este 
            documento no es válida. Los resultados se refieren al momento en que se 
            realizaron las inspecciones.
          </p>
          <p className="text-primary font-medium">
            © {new Date().getFullYear()} Terra Energy Services. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}
