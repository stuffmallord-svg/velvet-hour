"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (active && session) {
        router.replace("/admin");
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (signInError) {
      setError("ACCESS DENIED / CHECK YOUR CREDENTIALS");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginNoise} />

      <div className={styles.loginTop}>
        <span>VH</span>
        <span>PRIVATE HOUSE / LONDON</span>
        <span>001</span>
      </div>

      <section className={styles.loginShell}>
        <div className={styles.loginIntro}>
          <span className={styles.loginEyebrow}>
            VELVET HOUR / BACKSTAGE SYSTEM
          </span>

          <h1>
            THE
            <br />
            HOUSE<span>.</span>
          </h1>

          <p>
            Internal access for reservations, guest management and night
            operations.
          </p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.loginFormHeader}>
            <span>01</span>
            <strong>IDENTIFY</strong>
          </div>

          <label>
            <span>EMAIL ADDRESS</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>PASSWORD</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <div className={styles.loginError}>{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "AUTHENTICATING..." : "ENTER THE HOUSE ↗"}
          </button>

          <div className={styles.loginFormFooter}>
            <span>AUTHORIZED PERSONNEL ONLY</span>
            <span>SECURE CHANNEL</span>
          </div>
        </form>
      </section>

      <footer className={styles.loginFooter}>
        <span>VELVET HOUR</span>
        <span>EST. 00:17</span>
        <span>ALL NIGHT / EVERY NIGHT</span>
      </footer>
    </main>
  );
}