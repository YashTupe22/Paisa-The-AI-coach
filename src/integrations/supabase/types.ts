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
      ai_insights: {
        Row: {
          body: string
          created_at: string
          cta_label: string | null
          cta_url: string | null
          heading: string
          id: string
          is_read: boolean
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          heading: string
          id?: string
          is_read?: boolean
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          heading?: string
          id?: string
          is_read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_type: Database["public"]["Enums"]["account_type"]
          balance: number
          bank_name: string | null
          created_at: string
          credit_limit: number | null
          due_day: number | null
          id: string
          last_synced: string | null
          last4: string | null
          outstanding_balance: number | null
          statement_day: number | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_type?: Database["public"]["Enums"]["account_type"]
          balance?: number
          bank_name?: string | null
          created_at?: string
          credit_limit?: number | null
          due_day?: number | null
          id?: string
          last_synced?: string | null
          last4?: string | null
          outstanding_balance?: number | null
          statement_day?: number | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: Database["public"]["Enums"]["account_type"]
          balance?: number
          bank_name?: string | null
          created_at?: string
          credit_limit?: number | null
          due_day?: number | null
          id?: string
          last_synced?: string | null
          last4?: string | null
          outstanding_balance?: number | null
          statement_day?: number | null
          user_id?: string
        }
        Relationships: []
      }
      budget_allocations: {
        Row: {
          category: string
          created_at: string
          id: string
          month_year: string
          monthly_limit: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          month_year: string
          monthly_limit: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          month_year?: string
          monthly_limit?: number
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["chat_role"]
          session_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["chat_role"]
          session_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["chat_role"]
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_health_scores: {
        Row: {
          calculated_at: string
          debt_score: number
          emergency_score: number
          id: string
          investment_score: number
          savings_score: number
          total_score: number
          user_id: string
        }
        Insert: {
          calculated_at?: string
          debt_score: number
          emergency_score: number
          id?: string
          investment_score: number
          savings_score: number
          total_score: number
          user_id: string
        }
        Update: {
          calculated_at?: string
          debt_score?: number
          emergency_score?: number
          id?: string
          investment_score?: number
          savings_score?: number
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
      goal_contributions: {
        Row: {
          amount: number
          created_at: string
          date: string
          goal_id: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          goal_id: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          goal_id?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          current_amount: number
          deadline: string | null
          icon: string | null
          id: string
          monthly_contribution: number | null
          name: string
          target_amount: number
          type: Database["public"]["Enums"]["goal_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string | null
          id?: string
          monthly_contribution?: number | null
          name: string
          target_amount: number
          type?: Database["public"]["Enums"]["goal_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string | null
          id?: string
          monthly_contribution?: number | null
          name?: string
          target_amount?: number
          type?: Database["public"]["Enums"]["goal_type"]
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          avg_buy_price: number | null
          created_at: string
          current_value: number
          id: string
          invested_amount: number
          name: string
          sip_amount: number | null
          sip_date: number | null
          type: Database["public"]["Enums"]["investment_type"]
          units: number | null
          user_id: string
        }
        Insert: {
          avg_buy_price?: number | null
          created_at?: string
          current_value?: number
          id?: string
          invested_amount?: number
          name: string
          sip_amount?: number | null
          sip_date?: number | null
          type: Database["public"]["Enums"]["investment_type"]
          units?: number | null
          user_id: string
        }
        Update: {
          avg_buy_price?: number | null
          created_at?: string
          current_value?: number
          id?: string
          invested_amount?: number
          name?: string
          sip_amount?: number | null
          sip_date?: number | null
          type?: Database["public"]["Enums"]["investment_type"]
          units?: number | null
          user_id?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          created_at: string
          emi_amount: number
          emi_day: number
          id: string
          interest_rate: number | null
          lender: string | null
          months_remaining: number | null
          name: string
          next_due: string | null
          outstanding: number
          principal: number
          tenure_months: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emi_amount: number
          emi_day?: number
          id?: string
          interest_rate?: number | null
          lender?: string | null
          months_remaining?: number | null
          name: string
          next_due?: string | null
          outstanding: number
          principal: number
          tenure_months?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          emi_amount?: number
          emi_day?: number
          id?: string
          interest_rate?: number | null
          lender?: string | null
          months_remaining?: number | null
          name?: string
          next_due?: string | null
          outstanding?: number
          principal?: number
          tenure_months?: number | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          currency: string
          external_id: string | null
          id: string
          purpose: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          external_id?: string | null
          id?: string
          purpose?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          external_id?: string | null
          id?: string
          purpose?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          employer: string | null
          financial_goals: string[] | null
          id: string
          monthly_income: number | null
          name: string | null
          occupation: string | null
          onboarding_complete: boolean | null
          phone: string | null
          risk_appetite: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          employer?: string | null
          financial_goals?: string[] | null
          id: string
          monthly_income?: number | null
          name?: string | null
          occupation?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          risk_appetite?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          employer?: string | null
          financial_goals?: string[] | null
          id?: string
          monthly_income?: number | null
          name?: string | null
          occupation?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          risk_appetite?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transaction_categories: {
        Row: {
          color: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string | null
          ai_category: string | null
          amount: number
          category: string | null
          created_at: string
          date: string
          id: string
          merchant_name: string
          notes: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Insert: {
          account_id?: string | null
          ai_category?: string | null
          amount: number
          category?: string | null
          created_at?: string
          date: string
          id?: string
          merchant_name: string
          notes?: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Update: {
          account_id?: string | null
          ai_category?: string | null
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          merchant_name?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      upi_accounts: {
        Row: {
          id: string
          linked_at: string
          provider: string
          upi_id: string
          user_id: string
        }
        Insert: {
          id?: string
          linked_at?: string
          provider: string
          upi_id: string
          user_id: string
        }
        Update: {
          id?: string
          linked_at?: string
          provider?: string
          upi_id?: string
          user_id?: string
        }
        Relationships: []
      }
      uploaded_statements: {
        Row: {
          file_name: string
          file_path: string | null
          id: string
          status: Database["public"]["Enums"]["statement_status"]
          uploaded_at: string
          user_id: string
        }
        Insert: {
          file_name: string
          file_path?: string | null
          id?: string
          status?: Database["public"]["Enums"]["statement_status"]
          uploaded_at?: string
          user_id: string
        }
        Update: {
          file_name?: string
          file_path?: string | null
          id?: string
          status?: Database["public"]["Enums"]["statement_status"]
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "savings" | "current" | "credit_card" | "wallet"
      app_role: "admin" | "user"
      chat_role: "user" | "assistant"
      goal_type:
        | "emergency_fund"
        | "retirement"
        | "home"
        | "education"
        | "vacation"
        | "debt_payoff"
        | "wealth_building"
        | "other"
      investment_type:
        | "mutual_fund"
        | "stock"
        | "fd"
        | "gold"
        | "ppf"
        | "nps"
        | "etf"
      statement_status: "processing" | "done" | "failed"
      txn_type: "debit" | "credit"
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
      account_type: ["savings", "current", "credit_card", "wallet"],
      app_role: ["admin", "user"],
      chat_role: ["user", "assistant"],
      goal_type: [
        "emergency_fund",
        "retirement",
        "home",
        "education",
        "vacation",
        "debt_payoff",
        "wealth_building",
        "other",
      ],
      investment_type: [
        "mutual_fund",
        "stock",
        "fd",
        "gold",
        "ppf",
        "nps",
        "etf",
      ],
      statement_status: ["processing", "done", "failed"],
      txn_type: ["debit", "credit"],
    },
  },
} as const
