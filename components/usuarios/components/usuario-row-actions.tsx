"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { UsuarioForm } from "./usuario-form"
import { updateUsuario, deleteUsuario } from "./usuario-actions"
import { getClientesActivos, Usuario } from "./actions"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"

interface UsuarioRowActionsProps {
    usuario: Usuario
}

export function UsuarioRowActions({ usuario }: UsuarioRowActionsProps) {
    const [showEditDialog, setShowEditDialog] = React.useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [clientes, setClientes] = React.useState<Awaited<ReturnType<typeof getClientesActivos>>>([])

    // Cargar clientes cuando se abre el modal de edición
    React.useEffect(() => {
        if (showEditDialog) {
            getClientesActivos().then(setClientes)
        }
    }, [showEditDialog])

    const handleEdit = async (data: { clienteIds: string[]; is_active: boolean }) => {
        setIsLoading(true)
        try {
            await updateUsuario({
                id: usuario.id!,
                clienteIds: data.clienteIds,
                is_active: data.is_active
            })
            toast.success("Usuario actualizado exitosamente")
        } catch (error) {
            toast.error("Error al actualizar el usuario")
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await deleteUsuario(usuario.id!)
            toast.success("Usuario eliminado exitosamente")
            setShowDeleteDialog(false)
        } catch {
            toast.error("Error al eliminar el usuario")
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
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal de edición */}
            <UsuarioForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                usuario={usuario}
                clientes={clientes}
                onSubmit={handleEdit}
                isLoading={isLoading}
            />

            {/* Modal de confirmación de eliminación */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{" "}
                            <strong>{usuario.nombre}</strong> y se perderá el acceso a su cuenta.
                            {usuario.clientes && usuario.clientes.length > 0 && (
                                <>
                                    <br /><br />
                                    <strong>Clientes asignados:</strong> {usuario.clientes.map(c => c.nombre).join(", ")}
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? "Eliminando..." : "Eliminar Usuario"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}