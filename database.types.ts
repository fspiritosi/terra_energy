export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      checklist_requisitos: {
        Row: {
          created_at: string | null
          descripcion: string
          id: string
          norma_aplicable: string | null
          orden: number
          seccion_id: string | null
          subcategoria_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion: string
          id?: string
          norma_aplicable?: string | null
          orden?: number
          seccion_id?: string | null
          subcategoria_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string
          id?: string
          norma_aplicable?: string | null
          orden?: number
          seccion_id?: string | null
          subcategoria_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_requisitos_seccion_id_fkey"
            columns: ["seccion_id"]
            isOneToOne: false
            referencedRelation: "checklist_secciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_requisitos_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "checklist_subcategorias"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_secciones: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
          orden: number
          tipo_inspeccion_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
          orden?: number
          tipo_inspeccion_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
          orden?: number
          tipo_inspeccion_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_secciones_tipo_inspeccion_id_fkey"
            columns: ["tipo_inspeccion_id"]
            isOneToOne: false
            referencedRelation: "tipos_inspeccion_checklist"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_subcategorias: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
          norma_aplicable: string | null
          orden: number
          seccion_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
          norma_aplicable?: string | null
          orden?: number
          seccion_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
          norma_aplicable?: string | null
          orden?: number
          seccion_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_subcategorias_seccion_id_fkey"
            columns: ["seccion_id"]
            isOneToOne: false
            referencedRelation: "checklist_secciones"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          cuit: string
          direccion: string | null
          email: string | null
          id: string
          is_active: boolean
          logo: string | null
          moneda: Database["public"]["Enums"]["moneda"]
          nombre: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          cuit: string
          direccion?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          logo?: string | null
          moneda?: Database["public"]["Enums"]["moneda"]
          nombre: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          cuit?: string
          direccion?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          logo?: string | null
          moneda?: Database["public"]["Enums"]["moneda"]
          nombre?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      equipos_inspeccion: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inspeccion_respuestas: {
        Row: {
          created_at: string | null
          id: string
          inspeccion_id: string
          requisito_id: string
          tipo_respuesta_id: string
          updated_at: string | null
          valor_booleano: boolean | null
          valor_fecha: string | null
          valor_numero: number | null
          valor_texto: string | null
          valor_tiempo: unknown
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspeccion_id: string
          requisito_id: string
          tipo_respuesta_id: string
          updated_at?: string | null
          valor_booleano?: boolean | null
          valor_fecha?: string | null
          valor_numero?: number | null
          valor_texto?: string | null
          valor_tiempo?: unknown
        }
        Update: {
          created_at?: string | null
          id?: string
          inspeccion_id?: string
          requisito_id?: string
          tipo_respuesta_id?: string
          updated_at?: string | null
          valor_booleano?: boolean | null
          valor_fecha?: string | null
          valor_numero?: number | null
          valor_texto?: string | null
          valor_tiempo?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "inspeccion_respuestas_inspeccion_id_fkey"
            columns: ["inspeccion_id"]
            isOneToOne: false
            referencedRelation: "inspecciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspeccion_respuestas_requisito_id_fkey"
            columns: ["requisito_id"]
            isOneToOne: false
            referencedRelation: "checklist_requisitos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspeccion_respuestas_tipo_respuesta_id_fkey"
            columns: ["tipo_respuesta_id"]
            isOneToOne: false
            referencedRelation: "tipos_respuesta"
            referencedColumns: ["id"]
          },
        ]
      }
      inspecciones: {
        Row: {
          cliente_id: string
          cliente_nombre: string
          created_at: string | null
          equipo: string
          estado: Database["public"]["Enums"]["estado_inspeccion"] | null
          fecha_completada: string | null
          fecha_programada: string
          id: string
          inspector_asignado_id: string | null
          lugar: string
          numero_inspeccion: string
          observaciones: string | null
          responsable: string
          solicitud_id: string
          updated_at: string | null
        }
        Insert: {
          cliente_id: string
          cliente_nombre: string
          created_at?: string | null
          equipo: string
          estado?: Database["public"]["Enums"]["estado_inspeccion"] | null
          fecha_completada?: string | null
          fecha_programada: string
          id?: string
          inspector_asignado_id?: string | null
          lugar: string
          numero_inspeccion: string
          observaciones?: string | null
          responsable: string
          solicitud_id: string
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string
          cliente_nombre?: string
          created_at?: string | null
          equipo?: string
          estado?: Database["public"]["Enums"]["estado_inspeccion"] | null
          fecha_completada?: string | null
          fecha_programada?: string
          id?: string
          inspector_asignado_id?: string | null
          lugar?: string
          numero_inspeccion?: string
          observaciones?: string | null
          responsable?: string
          solicitud_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspecciones_inspector_asignado_id_fkey"
            columns: ["inspector_asignado_id"]
            isOneToOne: false
            referencedRelation: "usuarios_auth"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspecciones_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_inspeccion"
            referencedColumns: ["id"]
          },
        ]
      }
      item_inspection_types: {
        Row: {
          codigo: string
          created_at: string | null
          descripcion: string | null
          id: string
          is_active: boolean | null
          nombre: string
          orden: number
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          is_active?: boolean | null
          nombre: string
          orden?: number
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          is_active?: boolean | null
          nombre?: string
          orden?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      requisito_tipos_respuesta: {
        Row: {
          created_at: string | null
          id: string
          orden: number
          requisito_id: string
          tipo_respuesta_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          orden?: number
          requisito_id: string
          tipo_respuesta_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          orden?: number
          requisito_id?: string
          tipo_respuesta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requisito_tipos_respuesta_requisito_id_fkey"
            columns: ["requisito_id"]
            isOneToOne: false
            referencedRelation: "checklist_requisitos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requisito_tipos_respuesta_tipo_respuesta_id_fkey"
            columns: ["tipo_respuesta_id"]
            isOneToOne: false
            referencedRelation: "tipos_respuesta"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitud_imagenes: {
        Row: {
          created_at: string | null
          id: string
          imagen_url: string
          nombre_archivo: string
          orden: number | null
          solicitud_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          imagen_url: string
          nombre_archivo: string
          orden?: number | null
          solicitud_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          imagen_url?: string
          nombre_archivo?: string
          orden?: number | null
          solicitud_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitud_imagenes_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_inspeccion"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitud_item_inspections: {
        Row: {
          created_at: string | null
          id: string
          inspection_type_id: string
          observaciones: string | null
          solicitud_item_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspection_type_id: string
          observaciones?: string | null
          solicitud_item_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inspection_type_id?: string
          observaciones?: string | null
          solicitud_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitud_item_inspections_inspection_type_id_fkey"
            columns: ["inspection_type_id"]
            isOneToOne: false
            referencedRelation: "item_inspection_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_item_inspections_solicitud_item_id_fkey"
            columns: ["solicitud_item_id"]
            isOneToOne: false
            referencedRelation: "solicitud_items"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitud_items: {
        Row: {
          cantidad: number
          created_at: string
          descripcion: string
          id: string
          orden: number
          solicitud_id: string
        }
        Insert: {
          cantidad: number
          created_at?: string
          descripcion: string
          id?: string
          orden?: number
          solicitud_id: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          descripcion?: string
          id?: string
          orden?: number
          solicitud_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitud_items_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_inspeccion"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitud_trabajos: {
        Row: {
          created_at: string
          id: string
          solicitud_id: string
          tipo_inspeccion_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          solicitud_id: string
          tipo_inspeccion_id: string
        }
        Update: {
          created_at?: string
          id?: string
          solicitud_id?: string
          tipo_inspeccion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitud_trabajos_solicitud_id_fkey"
            columns: ["solicitud_id"]
            isOneToOne: false
            referencedRelation: "solicitudes_inspeccion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitud_trabajos_tipo_inspeccion_id_fkey"
            columns: ["tipo_inspeccion_id"]
            isOneToOne: false
            referencedRelation: "tipo_de_inspeccion"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_inspeccion: {
        Row: {
          aprobada_por: string | null
          cliente_id: string
          comentarios_aprobacion: string | null
          created_at: string
          equipo: string
          estado: string
          fecha_aprobacion: string | null
          fecha_entrega_deseada: string
          fecha_solicitud: string
          id: string
          lugar: string
          numero_solicitud: string
          requisitos_adicionales: string | null
          responsable: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          aprobada_por?: string | null
          cliente_id: string
          comentarios_aprobacion?: string | null
          created_at?: string
          equipo: string
          estado?: string
          fecha_aprobacion?: string | null
          fecha_entrega_deseada: string
          fecha_solicitud?: string
          id?: string
          lugar: string
          numero_solicitud: string
          requisitos_adicionales?: string | null
          responsable: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          aprobada_por?: string | null
          cliente_id?: string
          comentarios_aprobacion?: string | null
          created_at?: string
          equipo?: string
          estado?: string
          fecha_aprobacion?: string | null
          fecha_entrega_deseada?: string
          fecha_solicitud?: string
          id?: string
          lugar?: string
          numero_solicitud?: string
          requisitos_adicionales?: string | null
          responsable?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_inspeccion_aprobada_por_fkey"
            columns: ["aprobada_por"]
            isOneToOne: false
            referencedRelation: "usuarios_auth"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_inspeccion_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_inspeccion_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_auth"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_de_inspeccion: {
        Row: {
          codigo: string
          created_at: string
          descripcion: string | null
          id: string
          is_active: boolean
          nombre: string
        }
        Insert: {
          codigo: string
          created_at?: string
          descripcion?: string | null
          id?: string
          is_active?: boolean
          nombre: string
        }
        Update: {
          codigo?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          is_active?: boolean
          nombre?: string
        }
        Relationships: []
      }
      tipos_inspeccion_checklist: {
        Row: {
          codigo: string
          created_at: string | null
          descripcion: string | null
          id: string
          is_active: boolean | null
          nombre: string
          orden: number
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          is_active?: boolean | null
          nombre: string
          orden?: number
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          is_active?: boolean | null
          nombre?: string
          orden?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tipos_respuesta: {
        Row: {
          codigo: string
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          tipo_dato: string
          updated_at: string | null
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          tipo_dato: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          tipo_dato?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios_clientes: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          is_active: boolean
          user_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_clientes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_clientes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "usuarios_auth"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      usuarios_auth: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          email_confirmed: boolean | null
          id: string | null
          nombre: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: never
          created_at?: string | null
          email?: string | null
          email_confirmed?: never
          id?: string | null
          nombre?: never
          updated_at?: string | null
          user_type?: never
        }
        Update: {
          avatar_url?: never
          created_at?: string | null
          email?: string | null
          email_confirmed?: never
          id?: string | null
          nombre?: never
          updated_at?: string | null
          user_type?: never
        }
        Relationships: []
      }
    }
    Functions: {
      generate_client_initials: {
        Args: { client_name: string }
        Returns: string
      }
      generate_numero_inspeccion: { Args: never; Returns: string }
      generate_numero_solicitud:
        | { Args: never; Returns: string }
        | { Args: { cliente_id_param: string }; Returns: string }
      get_tipo_inspeccion_checklist_completo: {
        Args: { tipo_id: string }
        Returns: Json
      }
      get_tipos_inspeccion_checklist_activos: {
        Args: never
        Returns: {
          codigo: string
          descripcion: string
          id: string
          nombre: string
          orden: number
        }[]
      }
      get_tipos_respuesta: {
        Args: never
        Returns: {
          codigo: string
          descripcion: string
          id: string
          nombre: string
          tipo_dato: string
        }[]
      }
      log_debug_solicitud: { Args: { mensaje: string }; Returns: boolean }
    }
    Enums: {
      estado_inspeccion:
        | "programada"
        | "en_progreso"
        | "completada"
        | "cancelada"
      moneda: "ARS" | "USD"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_inspeccion: [
        "programada",
        "en_progreso",
        "completada",
        "cancelada",
      ],
      moneda: ["ARS", "USD"],
    },
  },
} as const
