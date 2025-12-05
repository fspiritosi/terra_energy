"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChecklistCompleto } from "@/components/inspecciones/components/checklist-actions";
import { getInspeccionesByTipoInspeccion, TipoDeInspeccionType } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText, ArrowLeft } from "lucide-react";

interface TipoInspeccionDetailsPageProps {
  tipoInspeccion: TipoDeInspeccionType;
  checklist: ChecklistCompleto | null;
}

const estadoColors = {
  programada: "default",
  en_progreso: "secondary",
  completada: "default",
  cancelada: "destructive",
} as const;

const formatEstado = (estado: string): string => {
  return estado
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function TipoInspeccionDetailsPage({
  tipoInspeccion,
  checklist,
}: TipoInspeccionDetailsPageProps) {
  const router = useRouter();
  const [inspecciones, setInspecciones] = React.useState<any[]>([]);
  const [loadingInspecciones, setLoadingInspecciones] = React.useState(false);

  React.useEffect(() => {
    setLoadingInspecciones(true);
    getInspeccionesByTipoInspeccion(tipoInspeccion.id)
      .then((data) => {
        setInspecciones(data);
      })
      .catch((error) => {
        console.error("Error loading inspecciones:", error);
      })
      .finally(() => {
        setLoadingInspecciones(false);
      });
  }, [tipoInspeccion.id]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{tipoInspeccion.nombre}</h1>
            {tipoInspeccion.descripcion && (
              <p className="text-muted-foreground mt-1">{tipoInspeccion.descripcion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Tipo de Inspección</CardTitle>
          <CardDescription>
            Checklist completo e inspecciones asignadas a este tipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Checklist</span>
                <span className="sm:hidden">Checklist</span>
              </TabsTrigger>
              <TabsTrigger value="inspecciones" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Inspecciones ({inspecciones.length})</span>
                <span className="sm:hidden">({inspecciones.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="checklist" className="mt-6">
              {checklist ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{checklist.nombre}</h3>
                    {checklist.descripcion && (
                      <p className="text-sm text-muted-foreground mb-4">{checklist.descripcion}</p>
                    )}
                  </div>

                  {checklist.secciones.map((seccion) => (
                    <div key={seccion.id} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold">{seccion.nombre}</h4>
                      </div>

                      {/* Requisitos directos de la sección */}
                      {seccion.requisitos && seccion.requisitos.length > 0 && (
                        <div className="ml-4 space-y-3">
                          {seccion.requisitos.map((requisito) => (
                            <div key={requisito.id} className="border-l-2 border-muted pl-4 py-2">
                              <p className="text-sm mb-2">{requisito.descripcion}</p>
                              {requisito.norma_aplicable && (
                                <Badge variant="outline" className="text-xs">
                                  {requisito.norma_aplicable}
                                </Badge>
                              )}
                              {requisito.tipos_respuesta && requisito.tipos_respuesta.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {requisito.tipos_respuesta.map((tipo) => (
                                    <Badge key={tipo.id} variant="secondary" className="text-xs">
                                      {tipo.nombre}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Subcategorías */}
                      {seccion.subcategorias && seccion.subcategorias.length > 0 && (
                        <div className="ml-4 space-y-4">
                          {seccion.subcategorias.map((subcategoria) => (
                            <div key={subcategoria.id} className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="text-sm font-medium">{subcategoria.nombre}</h5>
                                {subcategoria.norma_aplicable && (
                                  <Badge variant="outline" className="text-xs">
                                    {subcategoria.norma_aplicable}
                                  </Badge>
                                )}
                              </div>

                              {subcategoria.requisitos && subcategoria.requisitos.length > 0 && (
                                <div className="ml-4 space-y-2">
                                  {subcategoria.requisitos.map((requisito) => (
                                    <div key={requisito.id} className="border-l-2 border-muted pl-3 py-2">
                                      <p className="text-sm mb-1">{requisito.descripcion}</p>
                                      {requisito.norma_aplicable && (
                                        <Badge variant="outline" className="text-xs mr-2">
                                          {requisito.norma_aplicable}
                                        </Badge>
                                      )}
                                      {requisito.tipos_respuesta && requisito.tipos_respuesta.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {requisito.tipos_respuesta.map((tipo) => (
                                            <Badge key={tipo.id} variant="secondary" className="text-xs">
                                              {tipo.nombre}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No hay checklist disponible para este tipo de inspección
                </div>
              )}
            </TabsContent>

            <TabsContent value="inspecciones" className="mt-6">
              {loadingInspecciones ? (
                <div className="text-center text-muted-foreground py-8">Cargando...</div>
              ) : inspecciones.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay inspecciones asignadas a este tipo
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <div className="min-w-full inline-block align-middle">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Número</TableHead>
                          <TableHead className="whitespace-nowrap">Cliente</TableHead>
                          <TableHead className="whitespace-nowrap">Estado</TableHead>
                          <TableHead className="whitespace-nowrap">Fecha Programada</TableHead>
                          <TableHead className="whitespace-nowrap">Fecha Completada</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inspecciones.map((inspeccion) => (
                          <TableRow key={inspeccion.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {inspeccion.numero_inspeccion}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {inspeccion.solicitud?.cliente?.nombre || "N/A"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={estadoColors[inspeccion.estado as keyof typeof estadoColors] || "default"}>
                                {formatEstado(inspeccion.estado || "")}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {inspeccion.fecha_programada
                                ? new Date(inspeccion.fecha_programada).toLocaleDateString("es-ES")
                                : "N/A"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {inspeccion.fecha_completada
                                ? new Date(inspeccion.fecha_completada).toLocaleDateString("es-ES")
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

