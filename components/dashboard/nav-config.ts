import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  ClipboardCheck,
  Settings,
  FolderOpen,
  BarChart3,
  UserPlus,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  disabled?: boolean;
}

export const clienteNavItems: NavItem[] = [
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
    disabled: true,
  },
  {
    title: "Documentos",
    url: "/dashboard/documentos",
    icon: FolderOpen,
    disabled: true,
  },
];

export const operacionNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Solicitudes de Inspección",
    url: "/dashboard/solicitudes",
    icon: FileText,
  },
  {
    title: "Calendario",
    url: "/dashboard/calendario",
    icon: Calendar,
    disabled: true,
  },
  {
    title: "Inspecciones",
    url: "/dashboard/inspecciones",
    icon: ClipboardCheck,
    disabled: false,
  },
  {
    title: "Clientes",
    url: "/dashboard/clientes",
    icon: Users,
  },
  {
    title: "Usuarios",
    url: "/dashboard/usuarios",
    icon: UserPlus,
  },
  {
    title: "Reportes",
    url: "/dashboard/reportes",
    icon: BarChart3,
    disabled: true,
  },
  {
    title: "Configuración",
    url: "/dashboard/configuracion",
    icon: Settings,
    disabled: true,
  },
];
