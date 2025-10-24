'use server';
import { Database } from "@/database.types";
//import { createClient } from "@/lib/supabase/client";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTipoDeInspeccion(tipoDeInspeccion: Database['public']['Tables']['tipo_de_inspeccion']['Insert']) {
    const supabase = await createClient();
    console.log(tipoDeInspeccion)
    try {
        const response = await supabase.from("tipo_de_inspeccion").insert(tipoDeInspeccion);
        revalidatePath("/dashboard/inspecciones/tipos_de_inspeccion");
        return response;
    } catch (error) {
        console.log(error); 
        return { error } as any;
    }
}

export type CreateTipoDeInspeccionData = Omit<Awaited<ReturnType<typeof createTipoDeInspeccion>>[0], "id">;

export async function updateTipoDeInspeccion(id: string, tipoDeInspeccion: Database['public']['Tables']['tipo_de_inspeccion']['Update']) {
    const supabase = await createClient();
    try {       
        const response = await supabase.from("tipo_de_inspeccion").update(tipoDeInspeccion).eq("id", id);
        revalidatePath("/dashboard/inspecciones/tipos_de_inspeccion");
        return response;
    } catch (error) {
        console.log(error); 
        return { error } as any;
    }
}

export type UpdateTipoDeInspeccionData = Omit<Awaited<ReturnType<typeof updateTipoDeInspeccion>>[0], "id">;


export async function deleteTipoDeInspeccion(id: string) {
    const supabase = await createClient();
    try {       
        const response = await supabase.from("tipo_de_inspeccion").delete().eq("id", id);
        revalidatePath("/dashboard/inspecciones/tipos_de_inspeccion");
        return response;
    } catch (error) {
        console.log(error); 
        return { error } as any;
    }
}
    
export async function getTipoDeInspeccion() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from("tipo_de_inspeccion").select("*");
        if (error) {
            console.log(error);
            return [];
        }
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export type TipoDeInspeccionType = Awaited<ReturnType<typeof getTipoDeInspeccion>>[0];