import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";

export async function createTipoDeInspeccion(tipoDeInspeccion: Database['public']['Tables']['tipo_de_inspeccion']['Insert']) {
    const supabase =  createClient();
    console.log(tipoDeInspeccion)
    try {
        const response = await supabase.from("tipo_de_inspeccion").insert(tipoDeInspeccion);
        return response;
    } catch (error) {
        console.log(error); 
        return { error } as any;
    }
}

export async function updateTipoDeInspeccion(id: string, tipoDeInspeccion: Database['public']['Tables']['tipo_de_inspeccion']['Update']) {
    const supabase = createClient();
    try {       
        const response = await supabase.from("tipo_de_inspeccion").update(tipoDeInspeccion).eq("id", id);
        return response;
    } catch (error) {
        console.log(error); 
        return { error } as any;
    }
}