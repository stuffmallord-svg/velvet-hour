"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "./admin.module.css";

type ReservationStatus = "pending" | "confirmed" | "cancelled";

type Reservation = {
  id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  occasion: string | null;
  phone: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
  guest: {
    name: string;
    email: string;
    phone: string | null;
  } | null;
};

type AuditEntry = {
  id: string;
  old_status: ReservationStatus;
  new_status: ReservationStatus;
  created_at: string;
};

type ReservationDetail = Reservation & {
  audit: AuditEntry[];
};

const supabase = createSupabaseBrowserClient();

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function statusLabel(status: ReservationStatus) {
  return status === "confirmed"
    ? "CONFIRMED"
    : status === "cancelled"
      ? "CANCELLED"
      : "PENDING";
}

function statusClass(status: ReservationStatus) {
  return {
    confirmed: styles.statusConfirmed,
    pending: styles.statusPending,
    cancelled: styles.statusCancelled,
  }[status];
}

function isPast(date: string, time: string) {
  return new Date(`${date}T${time}`) < new Date();
}

export default function AdminPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<ReservationDetail | null>(null);

  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");

  const [statusFilter, setStatusFilter] = useState<
    "all" | ReservationStatus
  >("all");

  const [selectedDate, setSelectedDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [clock, setClock] = useState(new Date());

  /*
   * LIVE CLOCK
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /*
   * LOAD RESERVATIONS
   */
  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      params.set("scope", filter);

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      if (selectedDate) {
        params.set("date", selectedDate);
      }

      const response = await fetch(
        `/api/admin/reservations?${params.toString()}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load reservations.");
      }

      setReservations(data.reservations ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load reservations.",
      );
    } finally {
      setLoading(false);
    }
  }, [filter, statusFilter, selectedDate]);

  /*
   * INITIAL / FILTERED LOAD
   *
   * Delayed one tick so React does not flag the
   * synchronous state updates performed by loadReservations().
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReservations();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadReservations]);

  /*
   * OPEN RESERVATION DOSSIER
   */
  async function openReservation(id: string) {
    setDetailLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load reservation.");
      }

      setSelected(data.reservation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load reservation.",
      );
    } finally {
      setDetailLoading(false);
    }
  }

  /*
   * UPDATE RESERVATION STATUS
   */
  async function updateStatus(newStatus: ReservationStatus) {
    if (!selected) return;

    const reservationId = selected.id;

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/reservations/${reservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update reservation.");
      }

      await openReservation(reservationId);
      await loadReservations();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update reservation.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  /*
   * LOGOUT
   */
  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  /*
   * DASHBOARD STATS
   */
  const stats = useMemo(() => {
    const active = reservations.filter(
      (item) => item.status !== "cancelled",
    );

    return {
      total: reservations.length,
      guests: active.reduce((sum, item) => sum + item.guests, 0),
      pending: reservations.filter(
        (item) => item.status === "pending",
      ).length,
      confirmed: reservations.filter(
        (item) => item.status === "confirmed",
      ).length,
    };
  }, [reservations]);

  /*
   * GROUP RESERVATIONS BY DATE
   */
  const grouped = useMemo(() => {
    const map = new Map<string, Reservation[]>();

    reservations.forEach((reservation) => {
      const current = map.get(reservation.reservation_date) ?? [];

      current.push(reservation);

      map.set(reservation.reservation_date, current);
    });

    return Array.from(map.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [reservations]);

  /*
   * CURRENT TIME
   */
  const currentDate = clock.toISOString().slice(0, 10);
  const currentTime = clock.toTimeString().slice(0, 5);

  /*
   * TONIGHT
   */
  const tonightReservations = reservations.filter(
    (item) => item.reservation_date === currentDate,
  );

  const tonightGuests = tonightReservations
    .filter((item) => item.status !== "cancelled")
    .reduce((sum, item) => sum + item.guests, 0);

  return (
    <main className={styles.controlRoom}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>VH</span>
          <span>VELVET HOUR</span>
        </div>

        <div className={styles.location}>
          PRIVATE HOUSE
          <span>/</span>
          LONDON
        </div>

        <div className={styles.topRight}>
          <span className={styles.liveDot} />
          <span>LIVE</span>

          <button
            type="button"
            onClick={logout}
            className={styles.logout}
          >
            EXIT
          </button>
        </div>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            NIGHT OPERATIONS / 001
          </p>

          <h1>
            THE
            <br />
            DOOR
            <br />
            LIST<span>.</span>
          </h1>
        </div>

        <div className={styles.clockBlock}>
          <div className={styles.clock}>
            {currentTime}
          </div>

          <div className={styles.clockMeta}>
            <span>
              {clock.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </span>

            <span>GMT +01</span>
          </div>
        </div>
      </section>

      <section className={styles.signalBar}>
        <div>
          <span className={styles.signalLabel}>TONIGHT</span>

          <strong>
            {tonightReservations.length
              .toString()
              .padStart(2, "0")}
          </strong>

          <span>RESERVATIONS</span>
        </div>

        <div>
          <span className={styles.signalLabel}>GUESTS</span>

          <strong>
            {tonightGuests.toString().padStart(2, "0")}
          </strong>

          <span>EXPECTED</span>
        </div>

        <div>
          <span className={styles.signalLabel}>PENDING</span>

          <strong>
            {stats.pending.toString().padStart(2, "0")}
          </strong>

          <span>TO REVIEW</span>
        </div>

        <div>
          <span className={styles.signalLabel}>CONFIRMED</span>

          <strong>
            {stats.confirmed.toString().padStart(2, "0")}
          </strong>

          <span>ON THE LIST</span>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.listColumn}>
          <div className={styles.listHeader}>
            <div>
              <span className={styles.sectionNumber}>01</span>
              <h2>NIGHT FLOW</h2>
            </div>

            <div className={styles.controls}>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={
                    filter === "upcoming"
                      ? styles.activeControl
                      : ""
                  }
                  onClick={() => setFilter("upcoming")}
                >
                  UPCOMING
                </button>

                <button
                  type="button"
                  className={
                    filter === "all"
                      ? styles.activeControl
                      : ""
                  }
                  onClick={() => setFilter("all")}
                >
                  ALL
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "all"
                      | ReservationStatus,
                  )
                }
              >
                <option value="all">ALL STATUS</option>
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="cancelled">CANCELLED</option>
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
                aria-label="Filter by date"
              />
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              READING THE DOOR...
            </div>
          ) : grouped.length === 0 ? (
            <div className={styles.empty}>
              <span>NO MOVEMENT</span>

              <p>
                There are no reservations matching this
                view.
              </p>
            </div>
          ) : (
            <div className={styles.timeline}>
              {grouped.map(([date, items]) => (
                <div className={styles.day} key={date}>
                  <div className={styles.dayRail}>
                    <span>{formatDate(date)}</span>
                    <i />
                  </div>

                  <div className={styles.entries}>
                    {items.map((reservation, index) => {
                      const active =
                        selected?.id === reservation.id;

                      const past = isPast(
                        reservation.reservation_date,
                        reservation.reservation_time,
                      );

                      return (
                        <button
                          type="button"
                          key={reservation.id}
                          className={`${styles.reservationRow} ${
                            active
                              ? styles.selectedRow
                              : ""
                          } ${
                            past ? styles.pastRow : ""
                          }`}
                          onClick={() =>
                            void openReservation(
                              reservation.id,
                            )
                          }
                        >
                          <span
                            className={styles.rowIndex}
                          >
                            {(index + 1)
                              .toString()
                              .padStart(2, "0")}
                          </span>

                          <span
                            className={styles.rowTime}
                          >
                            {formatTime(
                              reservation.reservation_time,
                            )}
                          </span>

                          <span
                            className={styles.rowGuest}
                          >
                            <strong>
                              {reservation.guest
                                ?.name ||
                                "Unknown guest"}
                            </strong>

                            <small>
                              {reservation.guests}{" "}
                              {reservation.guests === 1
                                ? "GUEST"
                                : "GUESTS"}

                              {reservation.occasion
                                ? ` / ${reservation.occasion.toUpperCase()}`
                                : ""}
                            </small>
                          </span>

                          <span
                            className={`${styles.rowStatus} ${statusClass(
                              reservation.status,
                            )}`}
                          >
                            {statusLabel(
                              reservation.status,
                            )}
                          </span>

                          <span
                            className={styles.rowArrow}
                          >
                            ↗
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={styles.dossier}>
          {!selected ? (
            <div className={styles.dossierEmpty}>
              <div className={styles.dossierNumber}>
                02
              </div>

              <div className={styles.dossierPrompt}>
                <span>SELECT A GUEST</span>

                <strong>
                  TO OPEN
                  <br />
                  THE DOSSIER
                </strong>
              </div>

              <div className={styles.dossierCross}>
                <span />
                <span />
              </div>

              <p>
                Private information appears here when a
                reservation is selected.
              </p>
            </div>
          ) : detailLoading ? (
            <div className={styles.loading}>
              OPENING DOSSIER...
            </div>
          ) : (
            <div className={styles.dossierContent}>
              <div className={styles.dossierTop}>
                <span
                  className={styles.sectionNumber}
                >
                  02
                </span>

                <span>GUEST DOSSIER</span>

                <button
                  type="button"
                  className={styles.closeDossier}
                  onClick={() => setSelected(null)}
                  aria-label="Close dossier"
                >
                  ×
                </button>
              </div>

              <div className={styles.guestIdentity}>
                <span className={styles.guestCode}>
                  {selected.id.slice(0, 8).toUpperCase()}
                </span>

                <h2>
                  {selected.guest?.name ||
                    "Unknown guest"}
                </h2>

                <span
                  className={`${styles.largeStatus} ${statusClass(
                    selected.status,
                  )}`}
                >
                  {statusLabel(selected.status)}
                </span>
              </div>

              <div className={styles.arrival}>
                <span>ARRIVAL</span>

                <strong>
                  {formatTime(
                    selected.reservation_time,
                  )}
                </strong>

                <small>
                  {formatFullDate(
                    selected.reservation_date,
                  )}
                </small>
              </div>

              <div className={styles.dossierGrid}>
                <div>
                  <span>PARTY</span>
                  <strong>{selected.guests}</strong>
                </div>

                <div>
                  <span>OCCASION</span>
                  <strong>
                    {selected.occasion || "—"}
                  </strong>
                </div>

                <div>
                  <span>EMAIL</span>
                  <strong>
                    {selected.guest?.email || "—"}
                  </strong>
                </div>

                <div>
                  <span>PHONE</span>
                  <strong>
                    {selected.phone ||
                      selected.guest?.phone ||
                      "—"}
                  </strong>
                </div>
              </div>

              <div className={styles.actions}>
                {selected.status === "pending" && (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void updateStatus("confirmed")
                      }
                      className={
                        styles.confirmButton
                      }
                    >
                      CONFIRM ARRIVAL
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void updateStatus("cancelled")
                      }
                      className={styles.cancelButton}
                    >
                      CANCEL
                    </button>
                  </>
                )}

                {selected.status === "confirmed" && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      void updateStatus("cancelled")
                    }
                    className={styles.cancelButton}
                  >
                    CANCEL RESERVATION
                  </button>
                )}

                {selected.status === "cancelled" && (
                  <div
                    className={
                      styles.cancelledNotice
                    }
                  >
                    THIS RESERVATION IS CLOSED.
                  </div>
                )}
              </div>

              <div className={styles.audit}>
                <div className={styles.auditTitle}>
                  <span>03</span>
                  <strong>ACTIVITY</strong>
                </div>

                {selected.audit?.length ? (
                  selected.audit.map((entry) => (
                    <div
                      className={styles.auditEntry}
                      key={entry.id}
                    >
                      <span>
                        {new Date(
                          entry.created_at,
                        ).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>

                      <p>
                        <b>
                          {entry.old_status.toUpperCase()}
                        </b>

                        <i>→</i>

                        <b>
                          {entry.new_status.toUpperCase()}
                        </b>
                      </p>
                    </div>
                  ))
                ) : (
                  <div className={styles.noAudit}>
                    NO STATUS MOVEMENT
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </section>

      <footer className={styles.footer}>
        <span>
          VELVET HOUR / BACKSTAGE SYSTEM
        </span>

        <span>
          PRIVATE HOUSE — LONDON
        </span>

        <span>
          RESERVATIONS{" "}
          {stats.total.toString().padStart(2, "0")}
        </span>
      </footer>
    </main>
  );
}