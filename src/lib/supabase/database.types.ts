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
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
