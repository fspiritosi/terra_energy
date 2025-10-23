import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";


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
    
export async function createTipoDeInspeccion(tipoDeInspeccion: Database['public']['Tables']['tipo_de_inspeccion']['Insert']) {
    const supabase = await createClient();
    try {
        const response = await supabase.from("tipo_de_inspeccion").insert(tipoDeInspeccion);
        return response;
    } catch (error) {
        console.log(error); 
        return error;
    }
}

    