export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guests"]["Insert"]>;
        Relationships: [];
      };
      tables: {
        Row: {
          id: string;
          name: string;
          capacity: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          capacity: number;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tables"]["Insert"]>;
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          guest_id: string;
          reservation_date: string;
          reservation_time: string;
          guests: number;
          occasion: string;
          phone: string;
          status: "pending" | "confirmed" | "cancelled";
          idempotency_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          guest_id: string;
          reservation_date: string;
          reservation_time: string;
          guests: number;
          occasion: string;
          phone: string;
          status?: "pending" | "confirmed" | "cancelled";
          idempotency_key: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reservations_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      reservation_status_audit: {
        Row: {
          id: string;
          reservation_id: string;
          admin_user_id: string;
          old_status: "pending" | "confirmed" | "cancelled";
          new_status: "pending" | "confirmed" | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          admin_user_id: string;
          old_status: "pending" | "confirmed" | "cancelled";
          new_status: "pending" | "confirmed" | "cancelled";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reservation_status_audit"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reservation_status_audit_reservation_id_fkey";
            columns: ["reservation_id"];
            isOneToOne: false;
            referencedRelation: "reservations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_reservation: {
        Args: {
          p_guest_name: string;
          p_guest_email: string;
          p_guest_phone: string;
          p_reservation_date: string;
          p_reservation_time: string;
          p_guests: number;
          p_occasion: string;
          p_idempotency_key: string;
        };
        Returns: {
          id: string;
          status: "pending" | "confirmed" | "cancelled";
          reservation_date: string;
          reservation_time: string;
          duplicate: boolean;
        }[];
      };
      admin_update_reservation_status: {
        Args: {
          p_reservation_id: string;
          p_admin_user_id: string;
          p_new_status: string;
        };
        Returns: {
          id: string;
          status: "pending" | "confirmed" | "cancelled";
          reservation_date: string;
          reservation_time: string;
          old_status: "pending" | "confirmed" | "cancelled";
          new_status: "pending" | "confirmed" | "cancelled";
          updated_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
