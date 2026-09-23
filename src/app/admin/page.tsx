"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "./admin.module.css";

type Status = "pending" | "confirmed" | "cancelled";
type Scope = "upcoming" | "all";

type Reservation = {
  id: string;
  guest_id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  occasion: string;
  phone: string;
  status: Status;
  created_at: string;
  updated_at: string;
  guest: { id: string; name: string; email: string; phone: string | null } | null;
};

type ReservationDetail = Reservation & {
  audit: {
    id: string;
    reservation_id: string;
    admin_user_id: string;
    old_status: Status;
    new_status: Status;
    created_at: string;
  }[];
};

const statusLabels: Record<Status, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  cancelled: "CANCELLED",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function statusClass(status: Status) {
  return status === "pending" ? styles.statusPending : status === "confirmed" ? styles.statusConfirmed : styles.statusCancelled;
}

export default function AdminPage() {
  const router = useRouter();
  const [scope, setScope] = useState<Scope>("upcoming");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"" | Status>("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const handleUnauthorized = useCallback((response: Response) => {
    if (response.status === 401) {
      router.replace("/admin/login?next=/admin");
      return true;
    }
    if (response.status === 403) {
      setAccessDenied(true);
      return true;
    }
    return false;
  }, [router]);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ scope });
    if (date) params.set("date", date);
    if (status) params.set("status", status);

    try {
      const response = await fetch(`/api/admin/reservations?${params.toString()}`, { cache: "no-store" });
      if (handleUnauthorized(response)) return;
      const result = (await response.json()) as { reservations?: Reservation[]; error?: { message?: string } };
      if (!response.ok) throw new Error(result.error?.message ?? "Reservations could not be loaded.");
      setReservations(result.reservations ?? []);
    } catch (loadError) {
      if (loadError instanceof Error) setError(loadError.message);
      else setError("Reservations could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [date, handleUnauthorized, scope, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReservations();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadReservations]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, { cache: "no-store" });
      if (handleUnauthorized(response)) return;
      const result = (await response.json()) as { reservation?: ReservationDetail; error?: { message?: string } };
      if (!response.ok || !result.reservation) throw new Error(result.error?.message ?? "Reservation details could not be loaded.");
      setSelected(result.reservation);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Reservation details could not be loaded.");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (reservation: Reservation | ReservationDetail, nextStatus: "confirmed" | "cancelled") => {
    setActionId(reservation.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (handleUnauthorized(response)) return;
      const result = (await response.json()) as { reservation?: { status: Status }; error?: { message?: string } };
      if (!response.ok) throw new Error(result.error?.message ?? "Reservation status could not be updated.");
      setReservations((current) => current.map((item) => item.id === reservation.id ? { ...item, status: nextStatus } : item));
      if (selected?.id === reservation.id) {
        await openDetail(reservation.id);
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Reservation status could not be updated.");
    } finally {
      setActionId("");
    }
  };

  const logout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  if (accessDenied) {
    return <main className={styles.page}><section className={styles.accessDenied}><span className={styles.eyebrow}>403 / BACKSTAGE</span><h1>Access<br /><em>denied.</em></h1><p>Your account is authenticated, but it is not on the VELVET HOUR admin list.</p><button className={styles.logout} type="button" onClick={logout}>SIGN OUT</button></section></main>;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>VELVET HOUR / CONTROL ROOM</span>
        <div className={styles.headerMeta}><span>SOHO / LONDON</span><span>PRIVATE ACCESS</span><button className={styles.logout} type="button" onClick={logout}>SIGN OUT</button></div>
      </header>
      <div className={styles.main}>
        <section className={styles.intro}>
          <div><span className={styles.eyebrow}>01 / RESERVATIONS</span><h1 className={styles.title}>The<br /><em>room list.</em></h1></div>
          <p className={styles.introCopy}>A quiet view of who is coming through the door. Keep the room moving, one table at a time.</p>
        </section>
        <section className={styles.controls} aria-label="Reservation filters">
          <div className={styles.filterGroup}><span className={styles.filterLabel}>VIEW</span><button className={`${styles.filterButton} ${scope === "upcoming" ? styles.filterButtonActive : ""}`} type="button" onClick={() => setScope("upcoming")}>UPCOMING</button><button className={`${styles.filterButton} ${scope === "all" ? styles.filterButtonActive : ""}`} type="button" onClick={() => setScope("all")}>ALL</button></div>
          <div className={styles.filterGroup}><label className={styles.filterLabel} htmlFor="admin-date">DATE</label><input className={styles.dateInput} id="admin-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><label className={styles.filterLabel} htmlFor="admin-status">STATUS</label><select className={styles.statusSelect} id="admin-status" value={status} onChange={(event) => setStatus(event.target.value as "" | Status)}><option value="">ALL</option><option value="pending">PENDING</option><option value="confirmed">CONFIRMED</option><option value="cancelled">CANCELLED</option></select></div>
        </section>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.body}>
          <section aria-live="polite">
            {!loading && reservations.length > 0 && <div className={styles.listHeader}><span>DATE</span><span>GUEST</span><span>GUESTS</span><span>OCCASION</span><span>STATUS</span></div>}
            {loading ? <p className={styles.loading}>READING THE ROOM...</p> : reservations.length === 0 ? <p className={styles.empty}>No reservations in this view.</p> : <div className={styles.reservationList}>{reservations.map((reservation) => <button type="button" className={`${styles.reservationRow} ${selected?.id === reservation.id ? styles.reservationRowSelected : ""}`} key={reservation.id} onClick={() => void openDetail(reservation.id)}><span className={styles.date}>{formatDate(reservation.reservation_date)}<br />{formatTime(reservation.reservation_time)}</span><span className={styles.guest}><strong className={styles.guestName}>{reservation.guest?.name ?? "Unknown guest"}</strong><small className={styles.guestEmail}>{reservation.guest?.email ?? "No email"}</small></span><span className={styles.guestCount}>{reservation.guests}</span><span className={styles.occasion}>{reservation.occasion}</span><span className={`${styles.status} ${statusClass(reservation.status)}`}>{statusLabels[reservation.status]}</span></button>)}</div>}
          </section>
          {selected && <aside className={styles.detail} aria-label="Reservation details"><div className={styles.detailInner}><div className={styles.detailHeader}><div><span className={styles.eyebrow}>02 / DETAIL</span><h2 className={styles.detailTitle}>{selected.guest?.name ?? "Unknown"}<br /><em>{statusLabels[selected.status].toLowerCase()}.</em></h2></div><button type="button" className={styles.detailClose} onClick={() => setSelected(null)}>CLOSE</button></div>{detailLoading ? <p className={styles.loading}>LOADING...</p> : <><div className={styles.detailGrid}><div className={styles.detailItem}><span className={styles.label}>DATE / TIME</span><span className={`${styles.detailValue} ${styles.detailValueMono}`}>{formatDate(selected.reservation_date)} / {formatTime(selected.reservation_time)}</span></div><div className={styles.detailItem}><span className={styles.label}>GUESTS</span><span className={styles.detailValue}>{selected.guests}</span></div><div className={styles.detailItem}><span className={styles.label}>EMAIL</span><span className={styles.detailValue}>{selected.guest?.email ?? "-"}</span></div><div className={styles.detailItem}><span className={styles.label}>PHONE</span><span className={styles.detailValue}>{selected.guest?.phone ?? selected.phone ?? "-"}</span></div><div className={styles.detailItem}><span className={styles.label}>OCCASION</span><span className={styles.detailValue}>{selected.occasion}</span></div><div className={styles.detailItem}><span className={styles.label}>STATUS</span><span className={`${styles.detailValue} ${styles.status} ${statusClass(selected.status)}`}>{statusLabels[selected.status]}</span></div></div><div className={styles.detailActions}>{selected.status === "pending" && <><button className={styles.action} type="button" disabled={actionId === selected.id} onClick={() => void updateStatus(selected, "confirmed")}>CONFIRM</button><button className={styles.action} type="button" disabled={actionId === selected.id} onClick={() => void updateStatus(selected, "cancelled")}>CANCEL</button></>}{selected.status === "confirmed" && <button className={styles.action} type="button" disabled={actionId === selected.id} onClick={() => void updateStatus(selected, "cancelled")}>CANCEL</button>}</div><div className={styles.audit}><span className={styles.label}>STATUS HISTORY</span>{selected.audit.length === 0 ? <p className={styles.empty}>No changes recorded.</p> : <div className={styles.auditList}>{selected.audit.map((entry) => <div className={styles.auditItem} key={entry.id}><div className={styles.auditChange}><span>{entry.old_status}</span> / {entry.new_status}</div><div className={styles.auditMeta}>{entry.admin_user_id.slice(0, 8)}<br />{new Date(entry.created_at).toLocaleString("en-GB")}</div></div>)}</div>}</div></>}</div></aside>}
        </div>
      </div>
    </main>
  );
}
