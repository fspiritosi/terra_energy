"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  getChecklistCompleto,
  getRespuestasChecklist,
  guardarRespuestasChecklist,
  type ChecklistCompleto,
  type RespuestaChecklist,
} from "./checklist-actions";
import { ChecklistForm } from "./checklist-form";
import { updateInspeccion } from "./actions";

interface CompletarChecklistClientProps {
  inspeccionId: string;
  inspeccion: {
    id: string;
    numero_inspeccion: string;
    cliente_nombre: string;
    lugar: string;
    equipo: string;
    fecha_programada: string;
  };
  tiposInspeccion: Array<{
    id: string;
    tipo_inspeccion: {
      id: string;
      codigo: string;
      nombre: string;
      descripcion: string | null;
    } | null;
  }>;
}

export function CompletarChecklistClient({
  inspeccionId,
  inspeccion,
  tiposInspeccion,
}: CompletarChecklistClientProps) {
  const router = useRouter();
  const [checklists, setChecklists] = React.useState<Record<string, ChecklistCompleto>>({});
  const [respuestas, setRespuestas] = React.useState<Record<string, Record<string, RespuestaChecklist>>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Cargar checklists y respuestas existentes
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const checklistsData: Record<string, ChecklistCompleto> = {};
        const respuestasData: Record<string, Record<string, RespuestaChecklist>> = {};

        // Cargar cada checklist
        for (const tipo of tiposInspeccion) {
          if (tipo.tipo_inspeccion && tipo.tipo_inspeccion.id) {
            const checklist = await getChecklistCompleto(tipo.tipo_inspeccion.id);
            if (checklist) {
              checklistsData[tipo.tipo_inspeccion.id] = checklist;
            }
          }
        }

        // Cargar respuestas existentes
        const respuestasExistentes = await getRespuestasChecklist(inspeccionId);
        for (const respuesta of respuestasExistentes) {
          if (!respuestasData[respuesta.requisito_id]) {
            respuestasData[respuesta.requisito_id] = {};
          }
          respuestasData[respuesta.requisito_id][respuesta.tipo_respuesta_id] = {
            requisito_id: respuesta.requisito_id,
            tipo_respuesta_id: respuesta.tipo_respuesta_id,
            valor_texto: respuesta.valor_texto as string | null | undefined,
            valor_numero: respuesta.valor_numero as number | null | undefined,
            valor_booleano: respuesta.valor_booleano as boolean | null | undefined,
            valor_fecha: respuesta.valor_fecha as string | null | undefined,
            valor_tiempo: respuesta.valor_tiempo as string | null | undefined,
          };
        }

        setChecklists(checklistsData);
        setRespuestas(respuestasData);
      } catch (error) {
        console.error("Error loading checklists:", error);
        toast.error("Error al cargar los checklists");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [inspeccionId, tiposInspeccion]);

  const handleRespuestaChange = (
    tipoInspeccionId: string,
    requisitoId: string,
    tipoRespuestaId: string,
    valor: Partial<RespuestaChecklist>
  ) => {
    setRespuestas((prev) => {
      const newRespuestas = { ...prev };
      if (!newRespuestas[requisitoId]) {
        newRespuestas[requisitoId] = {};
      }
      newRespuestas[requisitoId][tipoRespuestaId] = {
        requisito_id: requisitoId,
        tipo_respuesta_id: tipoRespuestaId,
        ...valor,
      };
      return newRespuestas;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Convertir respuestas a array plano
      const respuestasArray: RespuestaChecklist[] = [];
      for (const requisitoId in respuestas) {
        for (const tipoRespuestaId in respuestas[requisitoId]) {
          respuestasArray.push(respuestas[requisitoId][tipoRespuestaId]);
        }
      }

      await guardarRespuestasChecklist(inspeccionId, respuestasArray);
      toast.success("Checklist guardado exitosamente");
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("Error al guardar el checklist");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompletar = async () => {
    setIsSaving(true);
    try {
      // Guardar respuestas
      const respuestasArray: RespuestaChecklist[] = [];
      for (const requisitoId in respuestas) {
        for (const tipoRespuestaId in respuestas[requisitoId]) {
          respuestasArray.push(respuestas[requisitoId][tipoRespuestaId]);
        }
      }

      await guardarRespuestasChecklist(inspeccionId, respuestasArray);

      // Marcar inspección como completada
      await updateInspeccion({
        id: inspeccionId,
        estado: "completada",
      });

      toast.success("Inspección completada exitosamente");
      router.push("/dashboard/inspecciones");
    } catch (error) {
      console.error("Error completing inspection:", error);
      toast.error("Error al completar la inspección");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Cargando checklists...</div>
      </div>
    );
  }

  // Si no hay tipos de inspección, mostrar mensaje
  if (tiposInspeccion.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No hay tipos de inspección asociados</CardTitle>
            <CardDescription>
              Esta inspección no tiene tipos de inspección asociados. Por favor, verifica que la solicitud tenga trabajos asignados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/inspecciones")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Inspecciones
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/inspecciones")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Completar Checklist de Inspección</h1>
          </div>
          <p className="text-muted-foreground">
            Inspección {inspeccion.numero_inspeccion} - {inspeccion.cliente_nombre}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
          <Button onClick={handleCompletar} disabled={isSaving}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completar Inspección
          </Button>
        </div>
      </div>

      {/* Información de la inspección */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Inspección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{inspeccion.cliente_nombre}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lugar</p>
              <p className="font-medium">{inspeccion.lugar}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equipo</p>
              <p className="font-medium">{inspeccion.equipo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Programada</p>
              <p className="font-medium">
                {new Date(inspeccion.fecha_programada).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklists */}
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-6">
          {tiposInspeccion.map((tipo) => {
            if (!tipo.tipo_inspeccion) return null;
            const checklist = checklists[tipo.tipo_inspeccion.id];
            if (!checklist) return null;

            return (
              <Card key={tipo.tipo_inspeccion.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {tipo.tipo_inspeccion.nombre}
                        <Badge variant="outline">{tipo.tipo_inspeccion.codigo}</Badge>
                      </CardTitle>
                      {tipo.tipo_inspeccion.descripcion && (
                        <CardDescription className="mt-1">
                          {tipo.tipo_inspeccion.descripcion}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChecklistForm
                    checklist={checklist}
                    respuestas={respuestas}
                    onRespuestaChange={(requisitoId, tipoRespuestaId, valor) =>
                      handleRespuestaChange(tipo.tipo_inspeccion!.id, requisitoId, tipoRespuestaId, valor)
                    }
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

