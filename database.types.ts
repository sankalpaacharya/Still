export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          amount: number | null;
          created_at: string;
          id: string;
          name: string | null;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          category_group_id: string | null;
          created_at: string;
          id: string;
          is_hidden: boolean | null;
          name: string | null;
        };
        Insert: {
          category_group_id?: string | null;
          created_at?: string;
          id?: string;
          is_hidden?: boolean | null;
          name?: string | null;
        };
        Update: {
          category_group_id?: string | null;
          created_at?: string;
          id?: string;
          is_hidden?: boolean | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "categories_category_group_id_fkey";
            columns: ["category_group_id"];
            isOneToOne: false;
            referencedRelation: "category_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      category: {
        Row: {
          budget: number | null;
          color: string | null;
          created_at: string;
          icon: string | null;
          id: string;
          name: string | null;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          budget?: number | null;
          color?: string | null;
          created_at?: string;
          icon?: string | null;
          id?: string;
          name?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          budget?: number | null;
          color?: string | null;
          created_at?: string;
          icon?: string | null;
          id?: string;
          name?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "category_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      category_groups: {
        Row: {
          created_at: string;
          id: string;
          is_hidden: boolean | null;
          name: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_hidden?: boolean | null;
          name?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_hidden?: boolean | null;
          name?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "category_groups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      category_months: {
        Row: {
          activity: number | null;
          assign: number | null;
          available: number | null;
          category_id: string | null;
          created_at: string;
          id: string;
          month: string | null;
        };
        Insert: {
          activity?: number | null;
          assign?: number | null;
          available?: number | null;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          month?: string | null;
        };
        Update: {
          activity?: number | null;
          assign?: number | null;
          available?: number | null;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          month?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "category_months_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      category_targets: {
        Row: {
          amount: number | null;
          category_id: string | null;
          created_at: string;
          id: string;
          monthly: number | null;
          type: string | null;
          weekly: string | null;
          yearly: string | null;
        };
        Insert: {
          amount?: number | null;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          monthly?: number | null;
          type?: string | null;
          weekly?: string | null;
          yearly?: string | null;
        };
        Update: {
          amount?: number | null;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          monthly?: number | null;
          type?: string | null;
          weekly?: string | null;
          yearly?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "category_targets_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      transaction: {
        Row: {
          amount: number | null;
          category_id: string | null;
          created_at: string;
          date: string | null;
          description: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          amount?: number | null;
          category_id?: string | null;
          created_at?: string;
          date?: string | null;
          description?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          amount?: number | null;
          category_id?: string | null;
          created_at?: string;
          date?: string | null;
          description?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transaction_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "category";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transaction_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          account_id: string | null;
          amount: number | null;
          category: string | null;
          category_group: string | null;
          category_id: string | null;
          created_at: string;
          date: string | null;
          description: string | null;
          id: string;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          account_id?: string | null;
          amount?: number | null;
          category?: string | null;
          category_group?: string | null;
          category_id?: string | null;
          created_at?: string;
          date?: string | null;
          description?: string | null;
          id?: string;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          account_id?: string | null;
          amount?: number | null;
          category?: string | null;
          category_group?: string | null;
          category_id?: string | null;
          created_at?: string;
          date?: string | null;
          description?: string | null;
          id?: string;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "expense_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expenses_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id: string;
          name?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
