"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { type ChecklistCompleto, type RespuestaChecklist } from "./checklist-actions";

interface ChecklistFormProps {
  checklist: ChecklistCompleto;
  respuestas: Record<string, Record<string, RespuestaChecklist>>;
  onRespuestaChange: (requisitoId: string, tipoRespuestaId: string, valor: any) => void;
}

export function ChecklistForm({ checklist, respuestas, onRespuestaChange }: ChecklistFormProps) {
  const getRespuesta = (requisitoId: string, tipoRespuestaId: string) => {
    return respuestas[requisitoId]?.[tipoRespuestaId];
  };

  const renderTipoRespuesta = (
    requisitoId: string,
    tipoRespuesta: { id: string; codigo: string; nombre: string; tipo_dato: string }
  ) => {
    const respuesta = getRespuesta(requisitoId, tipoRespuesta.id);

    switch (tipoRespuesta.tipo_dato) {
      case "booleano":
        if (tipoRespuesta.codigo === "verificacion") {
          return (
            <Checkbox
              checked={respuesta?.valor_booleano ?? false}
              onCheckedChange={(checked) =>
                onRespuestaChange(requisitoId, tipoRespuesta.id, {
                  valor_booleano: checked,
                })
              }
            />
          );
        } else {
          // Si/No
          return (
            <RadioGroup
              value={respuesta?.valor_booleano === true ? "si" : respuesta?.valor_booleano === false ? "no" : ""}
              onValueChange={(value) =>
                onRespuestaChange(requisitoId, tipoRespuesta.id, {
                  valor_booleano: value === "si",
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="si" id={`${requisitoId}-${tipoRespuesta.id}-si`} />
                <Label htmlFor={`${requisitoId}-${tipoRespuesta.id}-si`}>Sí</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${requisitoId}-${tipoRespuesta.id}-no`} />
                <Label htmlFor={`${requisitoId}-${tipoRespuesta.id}-no`}>No</Label>
              </div>
            </RadioGroup>
          );
        }

      case "numero":
        return (
          <Input
            type="number"
            step="any"
            placeholder="Ingrese el valor medido"
            value={respuesta?.valor_numero ?? ""}
            onChange={(e) =>
              onRespuestaChange(requisitoId, tipoRespuesta.id, {
                valor_numero: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
            className="max-w-xs"
          />
        );

      case "texto":
        if (tipoRespuesta.codigo === "lista") {
          return (
            <Textarea
              placeholder="Ingrese el listado (ej: productos con fechas)"
              value={respuesta?.valor_texto ?? ""}
              onChange={(e) =>
                onRespuestaChange(requisitoId, tipoRespuesta.id, {
                  valor_texto: e.target.value || null,
                })
              }
              className="min-h-[100px]"
            />
          );
        } else {
          return (
            <Textarea
              placeholder="Ingrese el texto"
              value={respuesta?.valor_texto ?? ""}
              onChange={(e) =>
                onRespuestaChange(requisitoId, tipoRespuesta.id, {
                  valor_texto: e.target.value || null,
                })
              }
              className="min-h-[80px]"
            />
          );
        }

      case "fecha":
        return (
          <Input
            type="date"
            value={respuesta?.valor_fecha ?? ""}
            onChange={(e) =>
              onRespuestaChange(requisitoId, tipoRespuesta.id, {
                valor_fecha: e.target.value || null,
              })
            }
            className="max-w-xs"
          />
        );

      case "tiempo":
        return (
          <Input
            type="text"
            placeholder="Ej: 30 minutos, 2 horas"
            value={respuesta?.valor_tiempo ?? ""}
            onChange={(e) =>
              onRespuestaChange(requisitoId, tipoRespuesta.id, {
                valor_tiempo: e.target.value || null,
              })
            }
            className="max-w-xs"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {checklist.secciones.map((seccion) => (
        <div key={seccion.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{seccion.nombre}</h3>
          </div>

          {/* Requisitos directos en la sección */}
          {seccion.requisitos.length > 0 && (
            <div className="space-y-4 pl-4 border-l-2">
              {seccion.requisitos.map((requisito) => (
                <div key={requisito.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Label className="text-base font-medium">{requisito.descripcion}</Label>
                      {requisito.norma_aplicable && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {requisito.norma_aplicable}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 pl-4">
                    {requisito.tipos_respuesta.map((tipoRespuesta) => (
                      <div key={tipoRespuesta.id} className="flex items-center gap-3">
                        <Label className="text-sm text-muted-foreground min-w-[120px]">
                          {tipoRespuesta.nombre}:
                        </Label>
                        {renderTipoRespuesta(requisito.id, tipoRespuesta)}
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          )}

          {/* Subcategorías */}
          {seccion.subcategorias.map((subcategoria) => (
            <div key={subcategoria.id} className="space-y-3 pl-4 border-l-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{subcategoria.nombre}</h4>
                {subcategoria.norma_aplicable && (
                  <Badge variant="outline" className="text-xs">
                    {subcategoria.norma_aplicable}
                  </Badge>
                )}
              </div>

              <div className="space-y-4 pl-4">
                {subcategoria.requisitos.map((requisito) => (
                  <div key={requisito.id} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{requisito.descripcion}</Label>
                        {requisito.norma_aplicable && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {requisito.norma_aplicable}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 pl-4">
                      {requisito.tipos_respuesta.map((tipoRespuesta) => (
                        <div key={tipoRespuesta.id} className="flex items-center gap-3">
                          <Label className="text-sm text-muted-foreground min-w-[120px]">
                            {tipoRespuesta.nombre}:
                          </Label>
                          {renderTipoRespuesta(requisito.id, tipoRespuesta)}
                        </div>
                      ))}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

