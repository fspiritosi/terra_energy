import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  UserPlus,
  Wrench,
  List,
  Tags,
  Settings2,
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
    title: "Inspecciones",
    icon: ClipboardCheck,
    items: [
      {
        title: "Solicitudes",
        url: "/dashboard/solicitudes",
        icon: FileText,
      },
      {
        title: "Listado de Inspecciones",
        url: "/dashboard/inspecciones",
        icon: List,
      },
      {
        title: "Calendario",
        url: "/dashboard/calendario",
        icon: Calendar,
        disabled: false,
      },
    ],
  },

  {
    title: "Administración",
    icon: Settings2,
    items: [
      {
        title: "Usuarios",
        url: "/dashboard/usuarios",
        icon: UserPlus,
      },
      {
        title: "Clientes",
        url: "/dashboard/clientes",
        icon: Users,
      },
      {
        title: "Tipos de Inspecciones",
        url: "/dashboard/inspecciones/tipos_de_inspeccion",
        icon: Tags,
      },
      {
        title: "Equipos de Inspecciones",
        url: "/dashboard/equipos",
        icon: Wrench,
      },
    ],
  },
  {
    title: "Reportes",
    url: "/dashboard/reportes",
    icon: BarChart3,
    disabled: true,
  },
];
