'use client'

import * as React from "react"
import { MoreHorizontal, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {  TipoDeInspeccionType } from "./actionServer"
import { toast } from "sonner"
import { updateTipoDeInspeccion, deleteTipoDeInspeccion, UpdateTipoDeInspeccionData } from "./actionClient"
import { TipoDeInspeccionForm } from "./tipe-inspection-form"

interface TipoDeInspeccionRowActionsProps {
    tipoDeInspeccion: TipoDeInspeccionType
}

export function TipoDeInspeccionRowActions({ tipoDeInspeccion }: TipoDeInspeccionRowActionsProps) {
    const [editOpen, setEditOpen] = React.useState(false)
    const [deleteOpen, setDeleteOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleEdit = async (data: Omit<UpdateTipoDeInspeccionData, "id">) => {
        setIsLoading(true)
        try {
            await updateTipoDeInspeccion(tipoDeInspeccion.id, { ...data })
            toast.success("Tipo de inspección actualizado exitosamente")
        } catch (error) {
            toast.error("Error al actualizar el tipo de inspección")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await deleteTipoDeInspeccion(tipoDeInspeccion.id)
            toast.success("Tipo de inspección eliminado exitosamente")
            setDeleteOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Error al eliminar el tipo de inspección")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">

                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

           
                       <TipoDeInspeccionForm
                           open={editOpen}
                           onOpenChange={setEditOpen}
                           tipoDeInspeccion={tipoDeInspeccion}
                           onSubmit={handleEdit}
                           isLoading={isLoading}
                       />
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el cliente{" "}
                            <strong>{tipoDeInspeccion?.nombre}</strong> y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                           onClick={handleDelete}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}