import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServerConfigured } from "@/lib/supabase/config";
import { validateReservationInput } from "@/lib/reservations";

export const runtime = "nodejs";

function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  const idempotencyKey =
    request.headers.get("Idempotency-Key") ??
    (crypto.randomUUID ? crypto.randomUUID() : "");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400, "INVALID_JSON");
  }

  const validation = validateReservationInput(body, idempotencyKey);
  if (validation.error || !validation.data) {
    return errorResponse(validation.error ?? "Invalid reservation.", 400, "VALIDATION_ERROR");
  }

  if (!isSupabaseServerConfigured) {
    return errorResponse(
      "Reservations are not connected yet. Add the Supabase server credentials to enable requests.",
      503,
      "SUPABASE_NOT_CONFIGURED",
    );
  }

  const supabase = createSupabaseAdminClient();
  const data = validation.data;

  try {
    const reservation = await supabase
      .rpc("create_reservation", {
        p_guest_name: data.name,
        p_guest_email: data.email,
        p_guest_phone: data.phone,
        p_reservation_date: data.date,
        p_reservation_time: data.time,
        p_guests: data.guests,
        p_occasion: data.occasion,
        p_idempotency_key: data.idempotencyKey,
      })
      .single();

    if (reservation.error) {
      if (reservation.error.code === "P0001") {
        return errorResponse(
          "That time is no longer available. Please choose another slot.",
          409,
          "RESERVATION_UNAVAILABLE",
        );
      }

      throw reservation.error;
    }

    return NextResponse.json(
      {
        reservation: {
          id: reservation.data.id,
          status: reservation.data.status,
          reservation_date: reservation.data.reservation_date,
          reservation_time: reservation.data.reservation_time,
        },
        ...(reservation.data.duplicate ? { duplicate: true } : {}),
      },
      { status: reservation.data.duplicate ? 200 : 201 },
    );
  } catch (error) {
    console.error("Reservation request failed", error);
    return errorResponse("We could not hold that request. Please try again.", 500, "RESERVATION_FAILED");
  }
}
