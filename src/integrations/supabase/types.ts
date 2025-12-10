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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          branch_name: string | null
          created_at: string
          id: string
          ifsc_code: string
          updated_at: string
          vendor_id: string
          verified: boolean | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          branch_name?: string | null
          created_at?: string
          id?: string
          ifsc_code: string
          updated_at?: string
          vendor_id: string
          verified?: boolean | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          branch_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string
          updated_at?: string
          vendor_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_bank_details_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_compliance: {
        Row: {
          certification_number: string | null
          certification_type: string
          created_at: string
          document_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          vendor_id: string
        }
        Insert: {
          certification_number?: string | null
          certification_type: string
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          vendor_id: string
        }
        Update: {
          certification_number?: string | null
          certification_type?: string
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_compliance_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_documents: {
        Row: {
          document_name: string
          document_type: string
          expiry_date: string | null
          file_url: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          uploaded_at: string
          vendor_id: string
        }
        Insert: {
          document_name: string
          document_type: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          uploaded_at?: string
          vendor_id: string
        }
        Update: {
          document_name?: string
          document_type?: string
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          uploaded_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_invitations: {
        Row: {
          accepted_at: string | null
          created_by: string
          expires_at: string
          id: string
          invitation_token: string
          required_documents: string[] | null
          sent_at: string
          status: Database["public"]["Enums"]["vendor_status"] | null
          vendor_email: string
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_by: string
          expires_at?: string
          id?: string
          invitation_token: string
          required_documents?: string[] | null
          sent_at?: string
          status?: Database["public"]["Enums"]["vendor_status"] | null
          vendor_email: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_by?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          required_documents?: string[] | null
          sent_at?: string
          status?: Database["public"]["Enums"]["vendor_status"] | null
          vendor_email?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_invitations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          category: string | null
          city: string | null
          company_name: string
          contact_person: string
          country: string | null
          created_at: string
          created_by: string | null
          delivery_score: number | null
          email: string
          gst_number: string | null
          id: string
          notes: string | null
          pan_number: string | null
          performance_score: number | null
          phone: string | null
          pincode: string | null
          quality_score: number | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          sla_score: number | null
          state: string | null
          status: Database["public"]["Enums"]["vendor_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          city?: string | null
          company_name: string
          contact_person: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          delivery_score?: number | null
          email: string
          gst_number?: string | null
          id?: string
          notes?: string | null
          pan_number?: string | null
          performance_score?: number | null
          phone?: string | null
          pincode?: string | null
          quality_score?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          sla_score?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string
          country?: string | null
          created_at?: string
          created_by?: string | null
          delivery_score?: number | null
          email?: string
          gst_number?: string | null
          id?: string
          notes?: string | null
          pan_number?: string | null
          performance_score?: number | null
          phone?: string | null
          pincode?: string | null
          quality_score?: number | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          sla_score?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_status: "pending" | "approved" | "rejected" | "expired"
      risk_level: "low" | "medium" | "high"
      vendor_status:
        | "pending"
        | "documents_pending"
        | "approved"
        | "rejected"
        | "active"
        | "inactive"
        | "blocked"
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
      document_status: ["pending", "approved", "rejected", "expired"],
      risk_level: ["low", "medium", "high"],
      vendor_status: [
        "pending",
        "documents_pending",
        "approved",
        "rejected",
        "active",
        "inactive",
        "blocked",
      ],
    },
  },
} as const
