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
  Wrench,
  List,
  Tags,
} from "lucide-react";

export interface NavItem {
  title: string;
  url?: string;
  icon: React.ComponentType;
  disabled?: boolean;
  items?: NavItem[];
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
    disabled: false,
  },
  {
    title: "Inspecciones",
    icon: ClipboardCheck,
    items: [
      {
        title: "Equipos de Inspecciones",
        url: "/dashboard/equipos",
        icon: Wrench,
      },
      {
        title: "Listado de Inspecciones",
        url: "/dashboard/inspecciones",
        icon: List,
      },
      {
        title: "Tipos de Inspecciones",
        url: "/dashboard/inspecciones/tipos_de_inspeccion",
        icon: Tags,
      },
    ],
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
