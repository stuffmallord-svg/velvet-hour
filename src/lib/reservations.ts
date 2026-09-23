export const RESERVATION_TIMES = [
  "18:30",
  "20:00",
  "21:30",
  "23:00",
  "00:30",
] as const;

export type ReservationInput = {
  date: string;
  time: string;
  guests: string | number;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  idempotencyKey?: string;
};

export type ValidatedReservation = {
  date: string;
  time: string;
  guests: number;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  idempotencyKey: string;
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateReservationInput(
  value: unknown,
  idempotencyKey: string,
): { data?: ValidatedReservation; error?: string } {
  if (!value || typeof value !== "object") {
    return { error: "Reservation details are required." };
  }

  const input = value as Partial<ReservationInput>;
  const date = typeof input.date === "string" ? input.date.trim() : "";
  const time = typeof input.time === "string" ? input.time.trim() : "";
  const occasion = typeof input.occasion === "string" ? input.occasion.trim() : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const guests = Number(input.guests);

  if (!datePattern.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    return { error: "Choose a valid reservation date." };
  }
  if (!timePattern.test(time)) return { error: "Choose a valid reservation time." };
  if (!RESERVATION_TIMES.includes(time as (typeof RESERVATION_TIMES)[number])) {
    return { error: "That reservation time is not available." };
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    return { error: "Guest count must be between 1 and 20." };
  }
  if (!name || name.length > 120) return { error: "Enter a valid name." };
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return { error: "Enter a valid email address." };
  }
  if (phone.length < 3 || phone.length > 40) return { error: "Enter a valid phone number." };
  if (!occasion || occasion.length > 80) return { error: "Choose an occasion." };
  if (!uuidPattern.test(idempotencyKey)) return { error: "A valid request key is required." };

  return {
    data: { date, time, guests, occasion, name, email, phone, idempotencyKey },
  };
}
