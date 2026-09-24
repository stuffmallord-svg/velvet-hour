import { NextResponse } from "next/server";
import { Resend } from "resend";
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
    return errorResponse(
      validation.error ?? "Invalid reservation.",
      400,
      "VALIDATION_ERROR",
    );
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

    // Send notification email after successful reservation.
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailResult = await resend.emails.send({
        from: "Velvet Hour <onboarding@resend.dev>",
        to: ["stuffmallord@gmail.com"],
        subject: `New reservation — ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 24px; margin-bottom: 24px;">
              New Velvet Hour Reservation
            </h1>

            <div style="line-height: 1.8; font-size: 16px;">
              <p><strong>Guest:</strong> ${data.name}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Guests:</strong> ${data.guests}</p>
              <p><strong>Occasion:</strong> ${data.occasion || "—"}</p>
              <p><strong>Phone:</strong> ${data.phone || "—"}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Reservation ID:</strong> ${reservation.data.id}</p>
              <p><strong>Status:</strong> ${reservation.data.status}</p>
            </div>
          </div>
        `,
      });

      if (emailResult.error) {
        console.error("Reservation email failed", emailResult.error);
      }
    } else {
      console.error("RESEND_API_KEY is not configured");
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
    return errorResponse(
      "We could not hold that request. Please try again.",
      500,
      "RESERVATION_FAILED",
    );
  }
}