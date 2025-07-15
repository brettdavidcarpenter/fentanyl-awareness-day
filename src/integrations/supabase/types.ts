export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      button_clicks: {
        Row: {
          additional_data: Json | null
          button_category: string
          button_name: string
          clicked_at: string
          created_at: string
          id: string
          page_location: string
          user_session_id: string
        }
        Insert: {
          additional_data?: Json | null
          button_category: string
          button_name: string
          clicked_at?: string
          created_at?: string
          id?: string
          page_location: string
          user_session_id: string
        }
        Update: {
          additional_data?: Json | null
          button_category?: string
          button_name?: string
          clicked_at?: string
          created_at?: string
          id?: string
          page_location?: string
          user_session_id?: string
        }
        Relationships: []
      }
      day_of_experience_posts: {
        Row: {
          created_at: string | null
          id: string
          persona_type: string | null
          post_type: string | null
          template_used: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          persona_type?: string | null
          post_type?: string | null
          template_used?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          persona_type?: string | null
          post_type?: string | null
          template_used?: string | null
        }
        Relationships: []
      }
      email_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          reminder_offset_minutes: number | null
          reminder_sent_2_months_before: boolean | null
          reminder_sent_3_days_before: boolean | null
          reminder_sent_45_days_before: boolean | null
          reminder_sent_day_of: boolean | null
          reminder_sent_week_before: boolean | null
          source: string | null
          test_mode: boolean | null
          test_target_date: string | null
          timezone: string | null
          unsubscribe_token: string | null
          unsubscribed: boolean | null
          welcome_email_sent: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          reminder_offset_minutes?: number | null
          reminder_sent_2_months_before?: boolean | null
          reminder_sent_3_days_before?: boolean | null
          reminder_sent_45_days_before?: boolean | null
          reminder_sent_day_of?: boolean | null
          reminder_sent_week_before?: boolean | null
          source?: string | null
          test_mode?: boolean | null
          test_target_date?: string | null
          timezone?: string | null
          unsubscribe_token?: string | null
          unsubscribed?: boolean | null
          welcome_email_sent?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          reminder_offset_minutes?: number | null
          reminder_sent_2_months_before?: boolean | null
          reminder_sent_3_days_before?: boolean | null
          reminder_sent_45_days_before?: boolean | null
          reminder_sent_day_of?: boolean | null
          reminder_sent_week_before?: boolean | null
          source?: string | null
          test_mode?: boolean | null
          test_target_date?: string | null
          timezone?: string | null
          unsubscribe_token?: string | null
          unsubscribed?: boolean | null
          welcome_email_sent?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
