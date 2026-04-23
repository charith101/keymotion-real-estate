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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      exchange_rates_cache: {
        Row: {
          base: string
          eur_rate: number
          fetched_at: string
          id: string
          usd_rate: number
        }
        Insert: {
          base: string
          eur_rate: number
          fetched_at?: string
          id?: string
          usd_rate: number
        }
        Update: {
          base?: string
          eur_rate?: number
          fetched_at?: string
          id?: string
          usd_rate?: number
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          admin_notes: string | null
          country: string | null
          created_at: string
          deleted_at: string | null
          email: string
          id: string
          inquiry_type: Database["public"]["Enums"]["inquiry_type_enum"]
          message: string | null
          name: string
          phone: string | null
          property_id: string | null
          status: Database["public"]["Enums"]["inquiry_status_enum"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          id?: string
          inquiry_type?: Database["public"]["Enums"]["inquiry_type_enum"]
          message?: string | null
          name: string
          phone?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["inquiry_status_enum"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          country?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          id?: string
          inquiry_type?: Database["public"]["Enums"]["inquiry_type_enum"]
          message?: string | null
          name?: string
          phone?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["inquiry_status_enum"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      nearby_attractions: {
        Row: {
          category: Database["public"]["Enums"]["attraction_category_enum"]
          display_order: number
          distance_km: number | null
          id: string
          name: string
          property_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["attraction_category_enum"]
          display_order?: number
          distance_km?: number | null
          id?: string
          name: string
          property_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["attraction_category_enum"]
          display_order?: number
          distance_km?: number | null
          id?: string
          name?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nearby_attractions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role_enum"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          created_at: string
          deleted_at: string | null
          description: string | null
          district: string
          featured: boolean
          floor_area_sqft: number | null
          id: string
          land_area_acres: number | null
          land_area_perches: number | null
          latitude: number | null
          listing_type: Database["public"]["Enums"]["listing_type_enum"]
          longitude: number | null
          price_lkr: number
          price_period: string | null
          property_type: Database["public"]["Enums"]["property_type_enum"]
          search_vector: unknown
          slug: string
          status: Database["public"]["Enums"]["property_status_enum"]
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          district: string
          featured?: boolean
          floor_area_sqft?: number | null
          id?: string
          land_area_acres?: number | null
          land_area_perches?: number | null
          latitude?: number | null
          listing_type: Database["public"]["Enums"]["listing_type_enum"]
          longitude?: number | null
          price_lkr: number
          price_period?: string | null
          property_type: Database["public"]["Enums"]["property_type_enum"]
          search_vector?: unknown
          slug: string
          status?: Database["public"]["Enums"]["property_status_enum"]
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          address?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          district?: string
          featured?: boolean
          floor_area_sqft?: number | null
          id?: string
          land_area_acres?: number | null
          land_area_perches?: number | null
          latitude?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type_enum"]
          longitude?: number | null
          price_lkr?: number
          price_period?: string | null
          property_type?: Database["public"]["Enums"]["property_type_enum"]
          search_vector?: unknown
          slug?: string
          status?: Database["public"]["Enums"]["property_status_enum"]
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          id: string
          is_public: boolean
          label: string
          property_id: string
          storage_path: string
        }
        Insert: {
          id?: string
          is_public?: boolean
          label: string
          property_id: string
          storage_path: string
        }
        Update: {
          id?: string
          is_public?: boolean
          label?: string
          property_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_facts: {
        Row: {
          display_order: number
          icon: string | null
          id: string
          label: string
          property_id: string
          value: string
        }
        Insert: {
          display_order?: number
          icon?: string | null
          id?: string
          label: string
          property_id: string
          value: string
        }
        Update: {
          display_order?: number
          icon?: string | null
          id?: string
          label?: string
          property_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_facts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          alt_text: string | null
          blur_data_url: string | null
          display_order: number
          id: string
          is_cover: boolean
          property_id: string
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          blur_data_url?: string | null
          display_order?: number
          id?: string
          is_cover?: boolean
          property_id: string
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          blur_data_url?: string | null
          display_order?: number
          id?: string
          is_cover?: boolean
          property_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_view_logs: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          viewed_at: string
          viewed_date: string | null
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          viewed_at?: string
          viewed_date?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          viewed_at?: string
          viewed_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_view_logs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          property_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          property_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          property_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      increment_property_views: { Args: { p_slug: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_admin_strict: { Args: never; Returns: boolean }
    }
    Enums: {
      attraction_category_enum:
        | "beach"
        | "supermarket"
        | "hospital"
        | "school"
        | "restaurant"
        | "airport"
        | "transport"
        | "other"
      inquiry_status_enum: "new" | "read" | "replied"
      inquiry_type_enum: "general" | "site_visit" | "document_request"
      listing_type_enum: "sale" | "rent" | "lease"
      property_status_enum: "active" | "draft" | "sold" | "rented"
      property_type_enum:
        | "land"
        | "house"
        | "apartment"
        | "commercial"
        | "agricultural"
      user_role_enum: "user" | "admin"
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
      attraction_category_enum: [
        "beach",
        "supermarket",
        "hospital",
        "school",
        "restaurant",
        "airport",
        "transport",
        "other",
      ],
      inquiry_status_enum: ["new", "read", "replied"],
      inquiry_type_enum: ["general", "site_visit", "document_request"],
      listing_type_enum: ["sale", "rent", "lease"],
      property_status_enum: ["active", "draft", "sold", "rented"],
      property_type_enum: [
        "land",
        "house",
        "apartment",
        "commercial",
        "agricultural",
      ],
      user_role_enum: ["user", "admin"],
    },
  },
} as const
