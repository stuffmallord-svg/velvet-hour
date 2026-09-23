import "server-only";

import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "./admin";
import { createSupabaseServerClient } from "./server";

export type AdminContext = {
  user: User;
  adminClient: ReturnType<typeof createSupabaseAdminClient>;
};

export type AdminAuthFailure = {
  response: NextResponse;
};

export async function requireAdmin(): Promise<AdminContext | AdminAuthFailure> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      response: NextResponse.json(
        { error: { code: "UNAUTHENTICATED", message: "Authentication required." } },
        { status: 401 },
      ),
    };
  }

  const { data: adminUser, error: adminLookupError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminLookupError) {
    console.error("Admin authorization lookup failed");
    return {
      response: NextResponse.json(
        { error: { code: "AUTHORIZATION_UNAVAILABLE", message: "Authorization is temporarily unavailable." } },
        { status: 500 },
      ),
    };
  }

  if (!adminUser) {
    return {
      response: NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Admin access required." } },
        { status: 403 },
      ),
    };
  }

  return {
    user: data.user,
    adminClient: createSupabaseAdminClient(),
  };
}

export function isAdminAuthFailure(
  result: AdminContext | AdminAuthFailure,
): result is AdminAuthFailure {
  return "response" in result;
}
