import { NextResponse } from "next/server";
import { isAdminAuthFailure, requireAdmin } from "@/lib/supabase/admin-auth";

const statuses = ["pending", "confirmed", "cancelled"] as const;
type ReservationStatus = (typeof statuses)[number];

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (isAdminAuthFailure(auth)) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return errorResponse("Invalid reservation ID.", 400, "VALIDATION_ERROR");

  const reservation = await auth.adminClient
    .from("reservations")
    .select("id, guest_id, reservation_date, reservation_time, guests, occasion, phone, status, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (reservation.error) {
    console.error("Admin reservation detail failed");
    return errorResponse("Reservation details are temporarily unavailable.", 500, "RESERVATION_UNAVAILABLE");
  }
  if (!reservation.data) return errorResponse("Reservation not found.", 404, "NOT_FOUND");

  const [guest, audit] = await Promise.all([
    auth.adminClient
      .from("guests")
      .select("id, name, email, phone")
      .eq("id", reservation.data.guest_id)
      .maybeSingle(),
    auth.adminClient
      .from("reservation_status_audit")
      .select("id, reservation_id, admin_user_id, old_status, new_status, created_at")
      .eq("reservation_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (guest.error || audit.error) {
    console.error("Admin reservation related data lookup failed");
    return errorResponse("Reservation details are temporarily unavailable.", 500, "RESERVATION_UNAVAILABLE");
  }

  return NextResponse.json({
    reservation: {
      ...reservation.data,
      guest: guest.data ?? null,
      audit: audit.data ?? [],
    },
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdmin();
  if (isAdminAuthFailure(auth)) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return errorResponse("Invalid reservation ID.", 400, "VALIDATION_ERROR");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400, "INVALID_JSON");
  }

  const status = body && typeof body === "object" && "status" in body
    ? (body as { status?: unknown }).status
    : undefined;
  if (typeof status !== "string" || !statuses.includes(status as ReservationStatus)) {
    return errorResponse("Invalid reservation status.", 400, "VALIDATION_ERROR");
  }

  const updated = await auth.adminClient
    .rpc("admin_update_reservation_status", {
      p_reservation_id: id,
      p_admin_user_id: auth.user.id,
      p_new_status: status,
    })
    .single();

  if (updated.error) {
    if (updated.error.code === "P0002") return errorResponse("Reservation not found.", 404, "NOT_FOUND");
    if (updated.error.code === "P0001") {
      return errorResponse("Invalid reservation status transition.", 409, "INVALID_STATUS_TRANSITION");
    }
    if (updated.error.code === "42501") return errorResponse("Admin access required.", 403, "FORBIDDEN");

    console.error("Admin reservation status update failed");
    return errorResponse("Reservation status could not be updated.", 500, "STATUS_UPDATE_FAILED");
  }

  return NextResponse.json({ reservation: updated.data });
}
