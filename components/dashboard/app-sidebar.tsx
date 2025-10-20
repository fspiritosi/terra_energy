"use client";

import * as React from "react";
import {
    LayoutDashboard,
    Zap,
    FileText,
    Calendar,
    Users,
    ClipboardCheck,
    Settings,
    FolderOpen,
    BarChart3,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

// TODO: Obtener del usuario autenticado desde Supabase
// Por ahora hardcodeado para desarrollo
const USER_TYPE: "cliente" | "operacion" = "operacion"; // Cambiar a "cliente" para probar

const clienteNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Mis Solicitudes",
        url: "/dashboard/solicitudes",
        icon: FileText,
    },
    {
        title: "Nueva Solicitud",
        url: "/dashboard/solicitudes/nueva",
        icon: ClipboardCheck,
    },
    {
        title: "Documentos",
        url: "/dashboard/documentos",
        icon: FolderOpen,
    },
];

const operacionNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Solicitudes Pendientes",
        url: "/dashboard/solicitudes",
        icon: FileText,
    },
    {
        title: "Calendario",
        url: "/dashboard/calendario",
        icon: Calendar,
    },
    {
        title: "Inspecciones",
        url: "/dashboard/inspecciones",
        icon: ClipboardCheck,
    },
    {
        title: "Clientes",
        url: "/dashboard/clientes",
        icon: Users,
    },
    {
        title: "Reportes",
        url: "/dashboard/reportes",
        icon: BarChart3,
    },
    {
        title: "Configuración",
        url: "/dashboard/configuracion",
        icon: Settings,
    },
];

const data = {
    user: {
        name: "Usuario",
        email: "usuario@terraenergy.com",
        avatar: "/avatars/user.jpg",
    },
    teams: [
        {
            name: "Terra Energy",
            logo: Zap,
            plan: "Enterprise",
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const navItems = USER_TYPE === "cliente" ? clienteNavItems : operacionNavItems;

    return (

        <Sidebar {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
