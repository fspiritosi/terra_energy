import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";


export async function getTipoDeReparacion() {
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

export type TipoDeReparacionType = Awaited<ReturnType<typeof getTipoDeReparacion>>;
    

export async function createTipoDeReparacion(tipoDeReparacion: Database['public']['Tables']['tipo_de_inspeccion']['Insert']) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from("tipo_de_inspeccion").insert(tipoDeReparacion);
        if (error) {
            console.log(error);
            return null;
        }
        return data;
    } catch (error) {
        console.log(error); 
        return null;
    }
}

export async function updateTipoDeReparacion(id: string, tipoDeReparacion: Database['public']['Tables']['tipo_de_inspeccion']['Update']) {
    const supabase = await createClient();
    try {       
        const { data, error } = await supabase.from("tipo_de_inspeccion").update(tipoDeReparacion).eq("id", id);
        if (error) {
            console.log(error);
            return null;
        }
        return data;
    } catch (error) {
        console.log(error); 
        return null;
    }
}
    