'use client'
import { z } from "zod"


const formSchema = z.object({
    codigo: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    descripcion: z.string().min(10, "La descripcion debe tener al menos 10 caracteres").optional(),
    is_active: z.boolean().optional(),
})


    