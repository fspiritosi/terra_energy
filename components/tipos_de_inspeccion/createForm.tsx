'use client'
import { z } from "zod"
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTipoDeInspeccion } from "./actionClient"
import { useState } from "react"

const formSchema = z.object({
    codigo: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    descripcion: z.string().min(10, "La descripcion debe tener al menos 10 caracteres").optional(),
    is_active: z.boolean().optional(),
})


export function CreateTipoDeInspeccion({ onSuccess }: { onSuccess?: () => void })    {
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            is_active: true,
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            setLoading(true)
            const { data, error } = await createTipoDeInspeccion(values) as any
            if (error) {
                console.log("Supabase insert error", error)
                return
            }
            console.log("Insert OK", data)
            form.reset()
            onSuccess?.()
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Codigo</FormLabel>
                            <FormControl>
                                <Input placeholder="codigo" {...field} />
                            </FormControl>
                            <FormDescription>
                                Codigo del tipo de inspeccion
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input placeholder="nombre" {...field} />
                            </FormControl>
                            <FormDescription>
                                Nombre del tipo de inspeccion
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripcion</FormLabel>
                            <FormControl>
                                <Input placeholder="descripcion" {...field} />
                            </FormControl>
                            <FormDescription>
                                Descripcion del tipo de inspeccion
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} aria-busy={loading}>
                    {loading ? "Creando..." : "Crear"}
                </Button>
            </form>
        </Form>
    )
}