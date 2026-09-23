"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getNextPath = () => {
    if (typeof window === "undefined") return "/admin";
    return new URLSearchParams(window.location.search).get("next") || "/admin";
  };

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) router.replace(getNextPath());
      else setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [router]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError("The door did not open. Check your details and try again.");
      setSubmitting(false);
      return;
    }

    router.replace(getNextPath());
    router.refresh();
  };

  if (loading) {
    return <main className={styles.loginPage}><p className={styles.loginBrand}>CHECKING THE DOOR / VELVET HOUR</p></main>;
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginFrame}>
        <span className={styles.loginBrand}>VELVET HOUR / BACKSTAGE</span>
        <h1 className={styles.loginTitle}>Enter the<em>room.</em></h1>
        <form className={styles.loginForm} onSubmit={submit}>
          <div className={styles.loginField}>
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className={styles.loginField}>
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error && <p className={styles.loginError} role="alert">{error}</p>}
          <button className={styles.loginSubmit} type="submit" disabled={submitting}>
            {submitting ? "OPENING THE ROOM" : "ENTER BACKSTAGE"}
          </button>
        </form>
        <p className={styles.loginNote}>Private access / London / After hours</p>
      </section>
    </main>
  );
}
