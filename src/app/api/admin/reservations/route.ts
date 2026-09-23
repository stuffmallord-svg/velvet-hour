import { NextResponse } from "next/server";
import { isAdminAuthFailure, requireAdmin } from "@/lib/supabase/admin-auth";

const statuses = ["pending", "confirmed", "cancelled"] as const;
type ReservationStatus = (typeof statuses)[number];

function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (isAdminAuthFailure(auth)) return auth.response;

  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  const status = url.searchParams.get("status");
  const scope = url.searchParams.get("scope") ?? "upcoming";

  if (date && !isValidDate(date)) {
    return errorResponse("A valid date is required.", 400, "VALIDATION_ERROR");
  }
  if (status && !statuses.includes(status as ReservationStatus)) {
    return errorResponse("Invalid reservation status.", 400, "VALIDATION_ERROR");
  }
  if (scope !== "upcoming" && scope !== "all") {
    return errorResponse("Invalid reservation scope.", 400, "VALIDATION_ERROR");
  }

  const today = new Date().toISOString().slice(0, 10);
  let query = auth.adminClient
    .from("reservations")
    .select("id, guest_id, reservation_date, reservation_time, guests, occasion, phone, status, created_at, updated_at")
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true });

  query = date
    ? query.eq("reservation_date", date)
    : scope === "all"
      ? query
      : query.gte("reservation_date", today);
  if (status) query = query.eq("status", status as ReservationStatus);

  const reservations = await query;
  if (reservations.error) {
    console.error("Admin reservation list failed");
    return errorResponse("Reservations are temporarily unavailable.", 500, "RESERVATIONS_UNAVAILABLE");
  }

  const guestIds = [...new Set(reservations.data.map((reservation) => reservation.guest_id))];
  const guests = guestIds.length
    ? await auth.adminClient.from("guests").select("id, name, email, phone").in("id", guestIds)
    : { data: [], error: null };

  if (guests.error) {
    console.error("Admin guest lookup failed");
    return errorResponse("Reservation contacts are temporarily unavailable.", 500, "GUESTS_UNAVAILABLE");
  }

  const guestById = new Map((guests.data ?? []).map((guest) => [guest.id, guest]));
  return NextResponse.json({
    reservations: reservations.data.map((reservation) => ({
      ...reservation,
      guest: guestById.get(reservation.guest_id) ?? null,
    })),
  });
}
