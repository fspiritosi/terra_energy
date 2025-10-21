import { createClient } from "./client";

export async function ensureProfilesBucket() {
  const supabase = createClient();

  try {
    // Verificar si el bucket existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const profilesBucket = buckets?.find(
      (bucket) => bucket.name === "profiles"
    );

    if (!profilesBucket) {
      // Crear el bucket si no existe
      const { error } = await supabase.storage.createBucket("profiles", {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        console.error("Error creando bucket profiles:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error verificando bucket profiles:", error);
    return false;
  }
}

export function getAvatarUrl(userId: string, fileName: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("profiles")
    .getPublicUrl(`avatars/${fileName}`);

  return data.publicUrl;
}

export async function deleteAvatar(filePath: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage
      .from("profiles")
      .remove([filePath]);

    return !error;
  } catch (error) {
    console.error("Error eliminando avatar:", error);
    return false;
  }
}
