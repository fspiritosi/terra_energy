import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  ClipboardCheck,
  Settings,
  FolderOpen,
  BarChart3,
} from "lucide-react";

export const clienteNavItems = [
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

export const operacionNavItems = [
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
