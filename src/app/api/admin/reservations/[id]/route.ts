import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isAdminAuthFailure, requireAdmin } from "@/lib/supabase/admin-auth";

const statuses = ["pending", "confirmed", "cancelled"] as const;
type ReservationStatus = (typeof statuses)[number];

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status },
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const auth = await requireAdmin();
  if (isAdminAuthFailure(auth)) return auth.response;

  const { id } = await params;

  if (!isUuid(id)) {
    return errorResponse(
      "Invalid reservation ID.",
      400,
      "VALIDATION_ERROR",
    );
  }

  const reservation = await auth.adminClient
    .from("reservations")
    .select(
      "id, guest_id, reservation_date, reservation_time, guests, occasion, phone, status, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (reservation.error) {
    console.error("Admin reservation detail failed");
    return errorResponse(
      "Reservation details are temporarily unavailable.",
      500,
      "RESERVATION_UNAVAILABLE",
    );
  }

  if (!reservation.data) {
    return errorResponse(
      "Reservation not found.",
      404,
      "NOT_FOUND",
    );
  }

  const [guest, audit] = await Promise.all([
    auth.adminClient
      .from("guests")
      .select("id, name, email, phone")
      .eq("id", reservation.data.guest_id)
      .maybeSingle(),

    auth.adminClient
      .from("reservation_status_audit")
      .select(
        "id, reservation_id, admin_user_id, old_status, new_status, created_at",
      )
      .eq("reservation_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (guest.error || audit.error) {
    console.error("Admin reservation related data lookup failed");
    return errorResponse(
      "Reservation details are temporarily unavailable.",
      500,
      "RESERVATION_UNAVAILABLE",
    );
  }

  return NextResponse.json({
    reservation: {
      ...reservation.data,
      guest: guest.data ?? null,
      audit: audit.data ?? [],
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const auth = await requireAdmin();
  if (isAdminAuthFailure(auth)) return auth.response;

  const { id } = await params;

  if (!isUuid(id)) {
    return errorResponse(
      "Invalid reservation ID.",
      400,
      "VALIDATION_ERROR",
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(
      "Request body must be valid JSON.",
      400,
      "INVALID_JSON",
    );
  }

  const status =
    body &&
    typeof body === "object" &&
    "status" in body
      ? (body as { status?: unknown }).status
      : undefined;

  if (
    typeof status !== "string" ||
    !statuses.includes(status as ReservationStatus)
  ) {
    return errorResponse(
      "Invalid reservation status.",
      400,
      "VALIDATION_ERROR",
    );
  }

  const reservationBeforeUpdate = await auth.adminClient
    .from("reservations")
    .select(
      "id, guest_id, reservation_date, reservation_time, guests, occasion, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (reservationBeforeUpdate.error) {
    console.error("Admin reservation lookup before update failed");
    return errorResponse(
      "Reservation could not be loaded.",
      500,
      "RESERVATION_UNAVAILABLE",
    );
  }

  if (!reservationBeforeUpdate.data) {
    return errorResponse(
      "Reservation not found.",
      404,
      "NOT_FOUND",
    );
  }

  const guest = await auth.adminClient
    .from("guests")
    .select("name, email")
    .eq("id", reservationBeforeUpdate.data.guest_id)
    .maybeSingle();

  if (guest.error) {
    console.error("Admin guest lookup before update failed");
    return errorResponse(
      "Guest details could not be loaded.",
      500,
      "GUEST_UNAVAILABLE",
    );
  }

  const updated = await auth.adminClient
    .rpc("admin_update_reservation_status", {
      p_reservation_id: id,
      p_admin_user_id: auth.user.id,
      p_new_status: status,
    })
    .single();

  if (updated.error) {
    if (updated.error.code === "P0002") {
      return errorResponse(
        "Reservation not found.",
        404,
        "NOT_FOUND",
      );
    }

    if (updated.error.code === "P0001") {
      return errorResponse(
        "Invalid reservation status transition.",
        409,
        "INVALID_STATUS_TRANSITION",
      );
    }

    if (updated.error.code === "42501") {
      return errorResponse(
        "Admin access required.",
        403,
        "FORBIDDEN",
      );
    }

    console.error("Admin reservation status update failed");
    return errorResponse(
      "Reservation status could not be updated.",
      500,
      "STATUS_UPDATE_FAILED",
    );
  }

  const wasAlreadyConfirmed =
    reservationBeforeUpdate.data.status === "confirmed";

  if (
    status === "confirmed" &&
    !wasAlreadyConfirmed &&
    guest.data?.email &&
    process.env.RESEND_API_KEY
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const guestName = escapeHtml(guest.data.name || "there");
    const reservationDate = escapeHtml(
      reservationBeforeUpdate.data.reservation_date,
    );
    const reservationTime = escapeHtml(
      reservationBeforeUpdate.data.reservation_time,
    );
    const guestsCount = String(
      reservationBeforeUpdate.data.guests,
    );
    const occasion = escapeHtml(
      reservationBeforeUpdate.data.occasion || "—",
    );

    const emailResult = await resend.emails.send({
      from: "Velvet Hour <onboarding@resend.dev>",
      to: [guest.data.email],
      subject: "Your Velvet Hour reservation is confirmed",
      html: `
        <div style="margin:0;padding:0;background:#f7f5f1;font-family:Arial,Helvetica,sans-serif;color:#171717;">
          <div style="max-width:620px;margin:0 auto;padding:56px 28px;">
            
            <div style="text-align:center;margin-bottom:48px;">
              <div style="font-size:12px;letter-spacing:0.32em;text-transform:uppercase;margin-bottom:18px;color:#777;">
                Velvet Hour
              </div>

              <h1 style="font-size:38px;line-height:1.15;font-weight:400;letter-spacing:-0.03em;margin:0;">
                Reservation confirmed
              </h1>
            </div>

            <p style="font-size:16px;line-height:1.8;margin:0 0 20px;">
              Hi ${guestName},
            </p>

            <p style="font-size:16px;line-height:1.8;margin:0 0 34px;">
              Your reservation at Velvet Hour has been confirmed.
              We look forward to welcoming you.
            </p>

            <div style="background:#ffffff;border:1px solid #dedbd5;padding:28px 26px;margin-bottom:34px;">
              
              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888;margin-bottom:8px;">
                Date
              </div>
              <div style="font-size:17px;margin-bottom:24px;">
                ${reservationDate}
              </div>

              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888;margin-bottom:8px;">
                Time
              </div>
              <div style="font-size:17px;margin-bottom:24px;">
                ${reservationTime}
              </div>

              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888;margin-bottom:8px;">
                Guests
              </div>
              <div style="font-size:17px;margin-bottom:24px;">
                ${guestsCount}
              </div>

              <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888;margin-bottom:8px;">
                Occasion
              </div>
              <div style="font-size:17px;">
                ${occasion}
              </div>

            </div>

            <p style="font-size:14px;line-height:1.7;color:#777;margin:0;">
              Velvet Hour
            </p>

          </div>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error(
        "Reservation confirmation email failed",
        emailResult.error,
      );
    } else {
      console.log(
        "Reservation confirmation email sent",
        emailResult.data?.id,
      );
    }
  } else if (status === "confirmed") {
    console.warn(
      "Reservation confirmed but confirmation email was not sent",
      {
        hasGuestEmail: Boolean(guest.data?.email),
        hasResendKey: Boolean(process.env.RESEND_API_KEY),
      },
    );
  }

  return NextResponse.json({
    reservation: updated.data,
  });
}
