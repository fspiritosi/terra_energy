"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, CheckCircle2, FileText, Loader2 } from "lucide-react";
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
import { crearDocumentoInspeccion } from "../pdf/documento-actions";
import moment from "moment-timezone";
import "moment/locale/es";

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires';

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

  // Función para extraer valores mínimos/máximos de la descripción del requisito
  const extraerValoresLimite = (descripcion: string): { minimo?: number; maximo?: number } => {
    const limites: { minimo?: number; maximo?: number } = {};
    
    // Buscar patrones como "mínima sea de 1000", "mínimo de 1000", "mínima de 1000"
    const patronMinimo = /mínim[ao]\s+(?:sea\s+de|de|:)\s*(\d+(?:\.\d+)?)/i;
    const matchMinimo = descripcion.match(patronMinimo);
    if (matchMinimo) {
      limites.minimo = parseFloat(matchMinimo[1]);
    }
    
    // Buscar patrones como "máxima sea de 1000", "máximo de 1000", "máxima de 1000"
    const patronMaximo = /máxim[ao]\s+(?:sea\s+de|de|:)\s*(\d+(?:\.\d+)?)/i;
    const matchMaximo = descripcion.match(patronMaximo);
    if (matchMaximo) {
      limites.maximo = parseFloat(matchMaximo[1]);
    }
    
    // Buscar rangos como "entre 10 y 52", "de 10 a 52"
    const patronRango = /(?:entre|de)\s+(\d+(?:\.\d+)?)\s+(?:y|a)\s+(\d+(?:\.\d+)?)/i;
    const matchRango = descripcion.match(patronRango);
    if (matchRango) {
      limites.minimo = parseFloat(matchRango[1]);
      limites.maximo = parseFloat(matchRango[2]);
    }
    
    return limites;
  };

  // Validar completitud y valores de las respuestas
  const validarRespuestas = (): { valido: boolean; errores: string[] } => {
    const errores: string[] = [];
    const requisitosRequeridos = new Set<string>();
    const requisitosRespondidos = new Set<string>();

    // Recopilar todos los requisitos requeridos de todos los checklists
    Object.values(checklists).forEach((checklist) => {
      checklist.secciones.forEach((seccion) => {
        seccion.requisitos.forEach((requisito) => {
          requisitosRequeridos.add(requisito.id);
        });
        seccion.subcategorias.forEach((subcategoria) => {
          subcategoria.requisitos.forEach((requisito) => {
            requisitosRequeridos.add(requisito.id);
          });
        });
      });
    });

    // Verificar que cada requisito tenga al menos una respuesta
    requisitosRequeridos.forEach((requisitoId) => {
      const respuestasRequisito = respuestas[requisitoId];
      if (!respuestasRequisito || Object.keys(respuestasRequisito).length === 0) {
        // Buscar la descripción del requisito para el mensaje de error
        let descripcion = "Requisito";
        Object.values(checklists).forEach((checklist) => {
          checklist.secciones.forEach((seccion) => {
            const requisito = seccion.requisitos.find((r) => r.id === requisitoId);
            if (requisito) descripcion = requisito.descripcion;
            seccion.subcategorias.forEach((subcategoria) => {
              const requisito = subcategoria.requisitos.find((r) => r.id === requisitoId);
              if (requisito) descripcion = requisito.descripcion;
            });
          });
        });
        errores.push(`Falta responder: ${descripcion.substring(0, 60)}...`);
      } else {
        requisitosRespondidos.add(requisitoId);
        
        // Buscar la descripción del requisito una vez
        let descripcionRequisito = "";
        Object.values(checklists).forEach((checklist) => {
          checklist.secciones.forEach((seccion) => {
            const requisito = seccion.requisitos.find((r) => r.id === requisitoId);
            if (requisito) descripcionRequisito = requisito.descripcion;
            seccion.subcategorias.forEach((subcategoria) => {
              const requisito = subcategoria.requisitos.find((r) => r.id === requisitoId);
              if (requisito) descripcionRequisito = requisito.descripcion;
            });
          });
        });
        
        // Buscar qué tipos de respuesta tiene este requisito
        let tiposRespuestaRequisito: Array<{ id: string; codigo: string; tipo_dato: string }> = [];
        Object.values(checklists).forEach((checklist) => {
          checklist.secciones.forEach((seccion) => {
            const requisito = seccion.requisitos.find((r) => r.id === requisitoId);
            if (requisito) tiposRespuestaRequisito = requisito.tipos_respuesta;
            seccion.subcategorias.forEach((subcategoria) => {
              const requisito = subcategoria.requisitos.find((r) => r.id === requisitoId);
              if (requisito) tiposRespuestaRequisito = requisito.tipos_respuesta;
            });
          });
        });
        
        // Validar cada tipo de respuesta según su tipo
        // Primero, verificar si hay tipos booleanos (verificacion o si_no) - estos son obligatorios
        const tiposBooleanos = tiposRespuestaRequisito.filter(
          (t) => t.tipo_dato === "booleano" && (t.codigo === "verificacion" || t.codigo === "si_no")
        );
        
        tiposBooleanos.forEach((tipoRespuesta) => {
          const respuesta = respuestasRequisito[tipoRespuesta.id];
          // Si es un tipo booleano obligatorio, debe tener valor
          if (!respuesta || respuesta.valor_booleano === null || respuesta.valor_booleano === undefined) {
            errores.push(`Debe seleccionar Sí o No para: ${descripcionRequisito.substring(0, 60)}...`);
          } else if (respuesta.valor_booleano === true) {
            // Si marcó "Sí" (true) y hay un tipo de respuesta numérico, validar el valor si está presente
            const tipoValorMedido = tiposRespuestaRequisito.find(
              (t) => t.tipo_dato === "numero" && t.codigo === "valor_medido"
            );
            if (tipoValorMedido) {
              const respuestaValor = respuestasRequisito[tipoValorMedido.id];
              // Si hay un valor numérico ingresado, debe cumplir límites
              if (respuestaValor && respuestaValor.valor_numero !== null && respuestaValor.valor_numero !== undefined) {
                const limites = extraerValoresLimite(descripcionRequisito);
                if (limites.minimo !== undefined && respuestaValor.valor_numero < limites.minimo) {
                  errores.push(
                    `El valor medido (${respuestaValor.valor_numero}) está por debajo del mínimo requerido (${limites.minimo}) en: ${descripcionRequisito.substring(0, 50)}...`
                  );
                }
                if (limites.maximo !== undefined && respuestaValor.valor_numero > limites.maximo) {
                  errores.push(
                    `El valor medido (${respuestaValor.valor_numero}) está por encima del máximo permitido (${limites.maximo}) en: ${descripcionRequisito.substring(0, 50)}...`
                  );
                }
              }
            }
          }
          // Si marcó "No" (false), no validar valores numéricos (se rechaza directamente)
        });
        
        // Validar tipos numéricos solo si NO hay verificación asociada (casos donde el valor es obligatorio)
        const tiposNumericos = tiposRespuestaRequisito.filter(
          (t) => t.tipo_dato === "numero" && t.codigo === "valor_medido"
        );
        
        tiposNumericos.forEach((tipoRespuesta) => {
          // Verificar si hay un tipo de verificación asociado
          const tieneVerificacion = tiposBooleanos.length > 0;
          
          // Si NO tiene verificación, el valor numérico es opcional pero si está presente debe cumplir límites
          if (!tieneVerificacion) {
            const respuesta = respuestasRequisito[tipoRespuesta.id];
            if (respuesta && respuesta.valor_numero !== null && respuesta.valor_numero !== undefined) {
              const limites = extraerValoresLimite(descripcionRequisito);
              if (limites.minimo !== undefined && respuesta.valor_numero < limites.minimo) {
                errores.push(
                  `El valor medido (${respuesta.valor_numero}) está por debajo del mínimo requerido (${limites.minimo}) en: ${descripcionRequisito.substring(0, 50)}...`
                );
              }
              if (limites.maximo !== undefined && respuesta.valor_numero > limites.maximo) {
                errores.push(
                  `El valor medido (${respuesta.valor_numero}) está por encima del máximo permitido (${limites.maximo}) en: ${descripcionRequisito.substring(0, 50)}...`
                );
              }
            }
          }
        });
      }
    });

    return {
      valido: errores.length === 0,
      errores,
    };
  };

  const handleCompletar = async () => {
    setIsSaving(true);
    try {
      // Validar respuestas antes de continuar
      const validacion = validarRespuestas();
      if (!validacion.valido) {
        toast.error("No se puede completar la inspección. Hay errores:", {
          description: validacion.errores.slice(0, 3).join(" • "),
          duration: 5000,
        });
        setIsSaving(false);
        return;
      }

      // Guardar respuestas
      const respuestasArray: RespuestaChecklist[] = [];
      for (const requisitoId in respuestas) {
        for (const tipoRespuestaId in respuestas[requisitoId]) {
          respuestasArray.push(respuestas[requisitoId][tipoRespuestaId]);
        }
      }

      await guardarRespuestasChecklist(inspeccionId, respuestasArray);

      // Determinar resultado basado en respuestas booleanas y valores numéricos
      const respuestasBooleanas = respuestasArray.filter(
        (r) => r.valor_booleano !== undefined && r.valor_booleano !== null
      );
      const hayRechazosBooleanos = respuestasBooleanas.some((r) => r.valor_booleano === false);
      
      // Verificar valores numéricos fuera de rango
      let hayValoresFueraDeRango = false;
      respuestasArray.forEach((respuesta) => {
        if (respuesta.valor_numero !== null && respuesta.valor_numero !== undefined) {
          // Buscar la descripción del requisito usando el requisito_id de la respuesta
          let descripcion = "";
          Object.values(checklists).forEach((checklist) => {
            checklist.secciones.forEach((seccion) => {
              const requisito = seccion.requisitos.find((r) => r.id === respuesta.requisito_id);
              if (requisito) descripcion = requisito.descripcion;
              seccion.subcategorias.forEach((subcategoria) => {
                const requisito = subcategoria.requisitos.find((r) => r.id === respuesta.requisito_id);
                if (requisito) descripcion = requisito.descripcion;
              });
            });
          });
          
          if (descripcion) {
            const limites = extraerValoresLimite(descripcion);
            if (
              (limites.minimo !== undefined && respuesta.valor_numero < limites.minimo) ||
              (limites.maximo !== undefined && respuesta.valor_numero > limites.maximo)
            ) {
              hayValoresFueraDeRango = true;
            }
          }
        }
      });

      const resultado = hayRechazosBooleanos || hayValoresFueraDeRango ? "rechazado" : "aprobado";

      // Marcar inspección como completada
      await updateInspeccion({
        id: inspeccionId,
        estado: "completada",
      });

      // Generar documento PDF
      toast.info("Generando documento de inspección...");
      const documento = await crearDocumentoInspeccion(inspeccionId, resultado);

      if (documento) {
        toast.success(
          `Inspección completada. Documento ${documento.numero_documento} generado exitosamente.`,
          {
            action: {
              label: "Ver PDF",
              onClick: () => window.open(`/api/documentos/${documento.id}/pdf`, "_blank"),
            },
          }
        );
      } else {
        toast.success("Inspección completada exitosamente");
      }

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
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Procesando..." : "Completar Inspección"}
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
                {/* Parsear fecha DATE (YYYY-MM-DD) como fecha local en Argentina */}
                {moment.tz(inspeccion.fecha_programada + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss', TIMEZONE_ARGENTINA).locale('es').format('DD/MM/YYYY')}
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

