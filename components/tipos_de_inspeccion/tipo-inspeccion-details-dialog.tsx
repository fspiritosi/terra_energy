"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type ChecklistCompleto } from "@/components/inspecciones/components/checklist-actions";
import { getInspeccionesByTipoInspeccion } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText } from "lucide-react";
import moment from "moment-timezone";
import "moment/locale/es";

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires';

interface TipoInspeccionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipoInspeccionId: string;
  tipoInspeccionNombre: string;
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

export function TipoInspeccionDetailsDialog({
  open,
  onOpenChange,
  tipoInspeccionId,
  tipoInspeccionNombre,
  checklist,
}: TipoInspeccionDetailsDialogProps) {
  const [inspecciones, setInspecciones] = React.useState<any[]>([]);
  const [loadingInspecciones, setLoadingInspecciones] = React.useState(false);

  React.useEffect(() => {
    if (open && tipoInspeccionId) {
      setLoadingInspecciones(true);
      getInspeccionesByTipoInspeccion(tipoInspeccionId)
        .then((data) => {
          setInspecciones(data);
        })
        .catch((error) => {
          console.error("Error loading inspecciones:", error);
        })
        .finally(() => {
          setLoadingInspecciones(false);
        });
    }
  }, [open, tipoInspeccionId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{tipoInspeccionNombre}</DialogTitle>
          <DialogDescription>
            Ver checklist completo e inspecciones asignadas a este tipo
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checklist">
              <FileText className="mr-2 h-4 w-4" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="inspecciones">
              <Calendar className="mr-2 h-4 w-4" />
              Inspecciones ({inspecciones.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-4">
            <ScrollArea className="h-[60vh] pr-4">
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
                              <div className="flex items-center gap-2">
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
            </ScrollArea>
          </TabsContent>

          <TabsContent value="inspecciones" className="mt-4">
            <ScrollArea className="h-[60vh]">
              {loadingInspecciones ? (
                <div className="text-center text-muted-foreground py-8">Cargando...</div>
              ) : inspecciones.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No hay inspecciones asignadas a este tipo
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha Programada</TableHead>
                        <TableHead>Fecha Completada</TableHead>
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
                              ? moment.tz(inspeccion.fecha_programada + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss', TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')
                              : "N/A"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {inspeccion.fecha_completada
                              ? moment.tz(inspeccion.fecha_completada + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss', TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

