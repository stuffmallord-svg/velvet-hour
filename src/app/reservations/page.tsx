"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import EditorialShell from "../components/EditorialShell";
import styles from "../components/editorial-shell.module.css";

const fallbackTimes = ["18:30", "20:00", "21:30", "23:00", "00:30"];

type Reservation = {
  date: string;
  time: string;
  guests: string;
  occasion: string;
  name: string;
  email: string;
  phone: string;
};

const initialReservation: Reservation = {
  date: "",
  time: "",
  guests: "2",
  occasion: "Dinner",
  name: "",
  email: "",
  phone: "",
};

export default function ReservationsPage() {
  const [reservation, setReservation] = useState(initialReservation);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availableTimes, setAvailableTimes] = useState(fallbackTimes);
  const requestKey = useRef<string | null>(null);

  const update = (field: keyof Reservation, value: string) => {
    setReservation((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    if (!reservation.date) return;

    const controller = new AbortController();

    fetch(`/api/availability?date=${reservation.date}&guests=${reservation.guests}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { slots?: { time: string; available: boolean }[] };
      })
      .then((result) => {
        if (!result?.slots) return;
        setAvailableTimes(result.slots.filter((slot) => slot.available).map((slot) => slot.time));
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [reservation.date, reservation.guests]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");
    requestKey.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestKey.current,
        },
        body: JSON.stringify({ ...reservation, idempotencyKey: requestKey.current }),
      });
      const result = (await response.json()) as { error?: { message?: string } };

      if (!response.ok) {
        throw new Error(result.error?.message ?? "We could not hold that request.");
      }

      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not hold that request. Please try again.",
      );
      requestKey.current = null;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EditorialShell
      section="01"
      eyebrow="Reservations"
      variant="moment"
      heroImage="/images/velvet/hero.jpg"
      title={<>Reserve<br /><em>a table.</em></>}
      intro="A table for dinner, a drink after midnight, or the first good decision of the evening."
    >
      <section className={styles.section}>
        {submitted ? (
          <div className={styles.confirmation}>
            <span className={styles.sectionLabel}>02 / REQUEST RECEIVED</span>
            <h2>The night<br /><em>is held.</em></h2>
            <p>Thank you, {reservation.name || "we have your name"}. We have received your request and will be in touch at {reservation.email || "your email address"} with the details.</p>
            <div className={styles.ctaRow}>
              <Link href="/nights" className={styles.cta}>SEE THE NIGHTS <span className={styles.arrow} aria-hidden="true" /></Link>
              <button type="button" className={styles.textButton} onClick={() => { requestKey.current = null; setSubmitted(false); }}>MAKE ANOTHER REQUEST</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>02 / FIND A TABLE</span>
              <div>
                <h2>Set the<br /><em>hour.</em></h2>
                <p>Requests are reviewed by the room, not a machine. We will confirm the table, the time and anything the evening needs.</p>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}><label htmlFor="date">Date</label><input id="date" type="date" required value={reservation.date} onChange={(event) => update("date", event.target.value)} /></div>
              <div className={styles.field}><label htmlFor="time">Time</label><select id="time" required value={reservation.time} onChange={(event) => update("time", event.target.value)}><option value="" disabled>Select a time</option>{availableTimes.map((time) => <option key={time}>{time}</option>)}</select></div>
              <div className={styles.field}><label htmlFor="guests">Guests</label><select id="guests" value={reservation.guests} onChange={(event) => update("guests", event.target.value)}>{["1", "2", "3", "4", "5", "6", "7+"] .map((value) => <option key={value}>{value}</option>)}</select></div>
              <div className={styles.field}><label htmlFor="occasion">Occasion</label><select id="occasion" value={reservation.occasion} onChange={(event) => update("occasion", event.target.value)}><option>Dinner</option><option>Drinks</option><option>Birthday</option><option>Private dining</option><option>Something else</option></select></div>
            </div>
            <div className={`${styles.sectionHeader} ${styles.full}`} style={{ marginTop: 110 }}>
              <span className={styles.sectionLabel}>03 / YOUR DETAILS</span>
              <div><h2>Leave<br /><em>a name.</em></h2></div>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}><label htmlFor="name">Name</label><input id="name" required placeholder="Your name" value={reservation.name} onChange={(event) => update("name", event.target.value)} /></div>
              <div className={styles.field}><label htmlFor="email">Email</label><input id="email" type="email" required placeholder="you@example.com" value={reservation.email} onChange={(event) => update("email", event.target.value)} /></div>
              <div className={styles.field}><label htmlFor="phone">Phone</label><input id="phone" type="tel" required placeholder="+44" value={reservation.phone} onChange={(event) => update("phone", event.target.value)} /></div>
            </div>
            <div className={styles.formFooter}><span>{error || "By requesting a table, you agree to be contacted about this reservation."}</span><button type="submit" className={styles.cta} disabled={submitting} aria-busy={submitting}>{submitting ? "SENDING REQUEST" : "REQUEST RESERVATION"} <span className={styles.arrow} aria-hidden="true" /></button></div>
          </form>
        )}
      </section>
      <section className={styles.statement}><div className={styles.statementInner}><span className={styles.sectionLabel}>04 / THE ROOM</span><h2>Come for dinner.<br /><em>Stay for the rest.</em></h2><div className={styles.ctaRow}><span>OPEN FROM MIDDAY / LATE</span><Link href="/private-dining" className={styles.cta}>PRIVATE DINING <span className={styles.arrow} aria-hidden="true" /></Link></div></div></section>
    </EditorialShell>
  );
}
