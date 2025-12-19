"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import moment from "moment";
import {
  uploadSolicitudImage,
  deleteSolicitudImage,
  ensureSolicitudesImagesBucket,
} from "@/lib/supabase/solicitudes-storage";

export interface SolicitudItem {
  descripcion: string;
  cantidad: number;
  inspections?: string[]; // Array de IDs de tipos de inspección
}

export interface SolicitudImageData {
  file?: File; // Para imágenes nuevas
  url?: string; // Para imágenes existentes
  fileName: string;
  orden: number;
  id?: string; // Para imágenes existentes
  toDelete?: boolean; // Para marcar imágenes a eliminar
}

export interface CreateSolicitudData {
  cliente_id: string;
  lugar: string;
  responsable: string;
  equipo: string;
  fecha_entrega_deseada: string;
  requisitos_adicionales?: string;
  items: SolicitudItem[];
  trabajos_ids: string[];
  images?: SolicitudImageData[];
}

export interface UpdateSolicitudData extends CreateSolicitudData {
  id: string;
}

// Función auxiliar para manejar imágenes
async function handleSolicitudImages(
  solicitudId: string,
  images?: SolicitudImageData[]
) {
  if (!images || images.length === 0) return;

  const supabase = await createClient();

  // Asegurar que el bucket existe
  await ensureSolicitudesImagesBucket();

  // Procesar imágenes a eliminar
  const imagesToDelete = images.filter((img) => img.toDelete && img.id);
  for (const image of imagesToDelete) {
    if (image.url) {
      await deleteSolicitudImage(image.url);
    }
    if (image.id) {
      await supabase.from("solicitud_imagenes").delete().eq("id", image.id);
    }
  }

  // Procesar imágenes nuevas
  const newImages = images.filter((img) => img.file && !img.toDelete);
  for (const imageData of newImages) {
    if (imageData.file) {
      const uploadResult = await uploadSolicitudImage(
        solicitudId,
        imageData.file,
        imageData.orden
      );

      if (uploadResult) {
        await supabase.from("solicitud_imagenes").insert({
          solicitud_id: solicitudId,
          imagen_url: uploadResult.url,
          nombre_archivo: uploadResult.fileName,
          orden: imageData.orden,
        });
      }
    }
  }
}

export async function createSolicitud(data: CreateSolicitudData) {
  try {
    const supabase = await createClient();

    // 1. Crear la solicitud principal
    const { data: solicitud, error: solicitudError } = await supabase
      .from("solicitudes_inspeccion")
      .insert({
        cliente_id: data.cliente_id,
        lugar: data.lugar,
        responsable: data.responsable,
        equipo: data.equipo,
        fecha_entrega_deseada: data.fecha_entrega_deseada,
        requisitos_adicionales: data.requisitos_adicionales,
        numero_solicitud: "", // Se auto-genera con el trigger
      })
      .select()
      .single();

    if (solicitudError) {
      console.error("Error creating solicitud:", solicitudError);
      throw new Error(`Error al crear solicitud: ${solicitudError.message}`);
    }

    if (!solicitud) {
      throw new Error("No se pudo crear la solicitud");
    }

    // 2. Crear los items
    if (data.items.length > 0) {
      const items = data.items.map((item, index) => ({
        solicitud_id: solicitud.id,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        orden: index + 1,
      }));

      const { data: createdItems, error: itemsError } = await supabase
        .from("solicitud_items")
        .insert(items)
        .select();

      if (itemsError) {
        console.error("Error creating items:", itemsError);
        throw new Error(`Error al crear items: ${itemsError.message}`);
      }

      // 2.1. Crear las inspecciones de items
      if (createdItems) {
        const itemInspections: Array<{
          solicitud_item_id: string;
          inspection_type_id: string;
        }> = [];

        data.items.forEach((item, index) => {
          if (item.inspections && item.inspections.length > 0) {
            const itemId = createdItems[index].id;
            item.inspections.forEach((inspectionTypeId) => {
              itemInspections.push({
                solicitud_item_id: itemId,
                inspection_type_id: inspectionTypeId,
              });
            });
          }
        });

        if (itemInspections.length > 0) {
          const { error: inspectionsError } = await supabase
            .from("solicitud_item_inspections")
            .insert(itemInspections);

          if (inspectionsError) {
            console.error("Error creating item inspections:", inspectionsError);
            throw new Error(
              `Error al crear inspecciones de items: ${inspectionsError.message}`
            );
          }
        }
      }
    }

    // 3. Crear las relaciones con trabajos
    if (data.trabajos_ids.length > 0) {
      const trabajos = data.trabajos_ids.map((trabajoId) => ({
        solicitud_id: solicitud.id,
        tipo_inspeccion_id: trabajoId,
      }));

      const { error: trabajosError } = await supabase
        .from("solicitud_trabajos")
        .insert(trabajos);

      if (trabajosError) {
        console.error("Error creating trabajos:", trabajosError);
        throw new Error(`Error al crear trabajos: ${trabajosError.message}`);
      }
    }

    // 4. Manejar imágenes si las hay
    if (data.images && data.images.length > 0) {
      await handleSolicitudImages(solicitud.id, data.images);
    }

    revalidatePath("/dashboard/solicitudes");
    revalidatePath("/dashboard");
    return { success: true, solicitudId: solicitud.id };
  } catch (error) {
    console.error("Error in createSolicitud:", error);
    throw error;
  }
}

export async function updateSolicitud(data: UpdateSolicitudData) {
  try {
    const supabase = await createClient();

    // 1. Actualizar la solicitud principal
    const { error: solicitudError } = await supabase
      .from("solicitudes_inspeccion")
      .update({
        lugar: data.lugar,
        responsable: data.responsable,
        equipo: data.equipo,
        fecha_entrega_deseada: data.fecha_entrega_deseada,
        requisitos_adicionales: data.requisitos_adicionales,
      })
      .eq("id", data.id);

    if (solicitudError) {
      console.error("Error updating solicitud:", solicitudError);
      throw new Error(
        `Error al actualizar solicitud: ${solicitudError.message}`
      );
    }

    // 2. Eliminar items existentes y crear nuevos
    const { error: deleteItemsError } = await supabase
      .from("solicitud_items")
      .delete()
      .eq("solicitud_id", data.id);

    if (deleteItemsError) {
      console.error("Error deleting existing items:", deleteItemsError);
      throw new Error(`Error al actualizar items: ${deleteItemsError.message}`);
    }

    if (data.items.length > 0) {
      const items = data.items.map((item, index) => ({
        solicitud_id: data.id,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        orden: index + 1,
      }));

      const { data: createdItems, error: itemsError } = await supabase
        .from("solicitud_items")
        .insert(items)
        .select();

      if (itemsError) {
        console.error("Error creating new items:", itemsError);
        throw new Error(`Error al crear nuevos items: ${itemsError.message}`);
      }

      // 2.1. Crear las inspecciones de items
      if (createdItems) {
        const itemInspections: Array<{
          solicitud_item_id: string;
          inspection_type_id: string;
        }> = [];

        data.items.forEach((item, index) => {
          if (item.inspections && item.inspections.length > 0) {
            const itemId = createdItems[index].id;
            item.inspections.forEach((inspectionTypeId) => {
              itemInspections.push({
                solicitud_item_id: itemId,
                inspection_type_id: inspectionTypeId,
              });
            });
          }
        });

        if (itemInspections.length > 0) {
          const { error: inspectionsError } = await supabase
            .from("solicitud_item_inspections")
            .insert(itemInspections);

          if (inspectionsError) {
            console.error("Error creating item inspections:", inspectionsError);
            throw new Error(
              `Error al crear inspecciones de items: ${inspectionsError.message}`
            );
          }
        }
      }
    }

    // 3. Eliminar trabajos existentes y crear nuevos
    const { error: deleteTrabajosError } = await supabase
      .from("solicitud_trabajos")
      .delete()
      .eq("solicitud_id", data.id);

    if (deleteTrabajosError) {
      console.error("Error deleting existing trabajos:", deleteTrabajosError);
      throw new Error(
        `Error al actualizar trabajos: ${deleteTrabajosError.message}`
      );
    }

    if (data.trabajos_ids.length > 0) {
      const trabajos = data.trabajos_ids.map((trabajoId) => ({
        solicitud_id: data.id,
        tipo_inspeccion_id: trabajoId,
      }));

      const { error: trabajosError } = await supabase
        .from("solicitud_trabajos")
        .insert(trabajos);

      if (trabajosError) {
        console.error("Error creating new trabajos:", trabajosError);
        throw new Error(
          `Error al crear nuevos trabajos: ${trabajosError.message}`
        );
      }
    }

    // 4. Manejar imágenes si las hay
    if (data.images && data.images.length > 0) {
      await handleSolicitudImages(data.id, data.images);
    }

    revalidatePath("/dashboard/solicitudes");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in updateSolicitud:", error);
    throw error;
  }
}

export async function aprobarSolicitud(
  solicitudId: string,
  fechaProgramada: string,
  comentarios?: string
) {
  try {
    const supabase = await createClient();

    // Primero obtener los datos de la solicitud
    const { data: solicitud, error: solicitudError } = await supabase
      .from("solicitudes_inspeccion")
      .select(
        `
        *,
        clientes!inner(nombre)
      `
      )
      .eq("id", solicitudId)
      .single();

    if (solicitudError || !solicitud) {
      throw new Error(`Error al obtener solicitud: ${solicitudError?.message}`);
    }

    // Actualizar el estado de la solicitud
    const { error: updateError } = await supabase
      .from("solicitudes_inspeccion")
      .update({
        estado: "aprobada",
        fecha_aprobacion: moment().toISOString(),
        comentarios_aprobacion: comentarios,
      })
      .eq("id", solicitudId);

    if (updateError) {
      console.error("Error approving solicitud:", updateError);
      throw new Error(`Error al aprobar solicitud: ${updateError.message}`);
    }

    // Crear la inspección automáticamente
    const { error: inspeccionError } = await supabase
      .from("inspecciones")
      .insert({
        solicitud_id: solicitudId,
        numero_inspeccion: "", // Se generará automáticamente por el trigger
        fecha_programada: fechaProgramada,
        cliente_id: solicitud.cliente_id,
        cliente_nombre: solicitud.clientes.nombre,
        lugar: solicitud.lugar,
        responsable: solicitud.responsable,
        equipo: solicitud.equipo,
        estado: "programada",
      });

    if (inspeccionError) {
      console.error("Error creating inspeccion:", inspeccionError);
      throw new Error(`Error al crear inspección: ${inspeccionError.message}`);
    }

    revalidatePath("/dashboard/solicitudes");
    revalidatePath("/dashboard/inspecciones");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in aprobarSolicitud:", error);
    throw error;
  }
}

export async function rechazarSolicitud(
  solicitudId: string,
  comentarios?: string
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("solicitudes_inspeccion")
      .update({
        estado: "rechazada",
        fecha_aprobacion: moment().toISOString(),
        comentarios_aprobacion: comentarios,
      })
      .eq("id", solicitudId);

    if (error) {
      console.error("Error rejecting solicitud:", error);
      throw new Error(`Error al rechazar solicitud: ${error.message}`);
    }

    revalidatePath("/dashboard/solicitudes");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in rechazarSolicitud:", error);
    throw error;
  }
}

export async function deleteSolicitud(solicitudId: string) {
  try {
    const supabase = await createClient();

    // Los items y trabajos se eliminan automáticamente por CASCADE
    const { error } = await supabase
      .from("solicitudes_inspeccion")
      .delete()
      .eq("id", solicitudId);

    if (error) {
      console.error("Error deleting solicitud:", error);
      throw new Error(`Error al eliminar solicitud: ${error.message}`);
    }

    revalidatePath("/dashboard/solicitudes");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteSolicitud:", error);
    throw error;
  }
}
