import { createClient } from "./client";

export async function ensureSolicitudesImagesBucket() {
  // El bucket 'solicitudes-imagenes' ya existe y está configurado
  // No necesitamos verificar ni crear nada
  return true;
}

export async function uploadSolicitudImage(
  solicitudId: string,
  file: File,
  orden: number
): Promise<{ url: string; fileName: string } | null> {
  const supabase = createClient();

  try {
    // Generar nombre único para el archivo en storage
    const fileExt = file.name.split(".").pop();
    const storageFileName = `${solicitudId}-${orden}-${Date.now()}.${fileExt}`;
    const filePath = `solicitudes/${storageFileName}`;

    // Subir imagen
    const { error: uploadError } = await supabase.storage
      .from("solicitudes-imagenes")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from("solicitudes-imagenes").getPublicUrl(filePath);

    // Retornar la URL y el nombre original del archivo (no el generado)
    return { url: publicUrl, fileName: file.name };
  } catch (error) {
    console.error("Error subiendo imagen de solicitud:", error);
    return null;
  }
}

export async function deleteSolicitudImage(imageUrl: string): Promise<boolean> {
  const supabase = createClient();

  try {
    // Extraer el path del archivo de la URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts.slice(-2).join("/"); // solicitudes/filename.ext

    const { error } = await supabase.storage
      .from("solicitudes-imagenes")
      .remove([filePath]);

    return !error;
  } catch (error) {
    console.error("Error eliminando imagen de solicitud:", error);
    return false;
  }
}

export async function deleteSolicitudImages(
  imageUrls: string[]
): Promise<boolean> {
  const supabase = createClient();

  try {
    const filePaths = imageUrls.map((imageUrl) => {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      return pathParts.slice(-2).join("/"); // solicitudes/filename.ext
    });

    const { error } = await supabase.storage
      .from("solicitudes-imagenes")
      .remove(filePaths);

    return !error;
  } catch (error) {
    console.error("Error eliminando imágenes de solicitud:", error);
    return false;
  }
}

export function getSolicitudImageUrl(fileName: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("solicitudes-imagenes")
    .getPublicUrl(`solicitudes/${fileName}`);

  return data.publicUrl;
}
