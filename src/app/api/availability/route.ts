import { NextResponse } from "next/server";
import { RESERVATION_TIMES } from "@/lib/reservations";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServerConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function errorResponse(message: string, status: number, code: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? "";
  const guests = Number(url.searchParams.get("guests") ?? "2");

  if (!datePattern.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    return errorResponse("A valid date is required.", 400, "VALIDATION_ERROR");
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return errorResponse("Guest count must be between 1 and 20.", 400, "VALIDATION_ERROR");
  }
  if (!isSupabaseServerConfigured) {
    return errorResponse(
      "Availability is not connected yet. Add the Supabase server credentials to enable live slots.",
      503,
      "SUPABASE_NOT_CONFIGURED",
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const [tables, reservations] = await Promise.all([
      supabase.from("tables").select("id, capacity").eq("active", true).gte("capacity", guests),
      supabase
        .from("reservations")
        .select("reservation_time")
        .eq("reservation_date", date)
        .in("status", ["pending", "confirmed"]),
    ]);

    if (tables.error) throw tables.error;
    if (reservations.error) throw reservations.error;

    const capacity = tables.data.length;
    const reservedByTime = new Map<string, number>();
    reservations.data.forEach((reservation) => {
      const time = reservation.reservation_time.slice(0, 5);
      reservedByTime.set(time, (reservedByTime.get(time) ?? 0) + 1);
    });

    const slots = RESERVATION_TIMES.map((time) => ({
      time,
      available: (reservedByTime.get(time) ?? 0) < capacity,
    }));

    return NextResponse.json({ date, guests, capacity, slots });
  } catch (error) {
    console.error("Availability lookup failed", error);
    return errorResponse("Availability is temporarily unavailable.", 500, "AVAILABILITY_FAILED");
  }
}
