"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useUserType } from "@/hooks/use-user-type"
import { useUserClienteInfo } from "@/hooks/use-user-cliente"

export function PageHeader() {
    const pathname = usePathname()
    const { userProfile } = useUserType()
    const { clienteInfo, isLoading: isLoadingCliente } = useUserClienteInfo()

    // Obtener el último segmento del path y capitalizarlo
    const getPageTitle = (path: string) => {
        const segments = path.split('/').filter(Boolean)
        const lastSegment = segments[segments.length - 1] || 'dashboard'

        // Casos especiales para nombres más amigables
        const specialCases: Record<string, string> = {
            'dashboard': 'Dashboard',
            'clientes': 'Clientes',
            'solicitudes': 'Solicitudes',
            'inspecciones': 'Inspecciones',
            'calendario': 'Calendario',
            'reportes': 'Reportes',
            'configuracion': 'Configuración',
            'documentos': 'Documentos',
            'nueva': 'Nueva Solicitud',
        }

        // Si hay un caso especial, usarlo
        if (specialCases[lastSegment]) {
            return specialCases[lastSegment]
        }

        // Capitalizar la primera letra y reemplazar guiones con espacios
        return lastSegment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const pageTitle = getPageTitle(pathname)
    const isCliente = userProfile?.user_type === "cliente"

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white px-4 bg-primary text-primary-foreground">
            <SidebarTrigger className="-ml-1 text-primary-foreground hover:bg-primary-foreground/10" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-primary-foreground/20" />
            <div className="flex items-center gap-3 flex-1">
                <h1 className="text-lg font-semibold text-primary-foreground">{pageTitle}</h1>
                {isCliente && (
                    <>
                        <span >
                            |
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary-foreground">
                                {isLoadingCliente ? "Cargando..." : clienteInfo?.nombre || "No asignado"}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}