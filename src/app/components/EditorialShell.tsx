"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./editorial-shell.module.css";

type ShellVariant = "silence" | "moment" | "object" | "secret";

type EditorialShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  section?: string;
  variant?: ShellVariant;
  heroImage: string;
};

const links = [
  { href: "/", label: "HOME" },
  { href: "/menu", label: "MENU" },
  { href: "/nights", label: "NIGHTS" },
  { href: "/private-dining", label: "PRIVATE DINING" },
  { href: "/reservations", label: "RESERVATIONS" },
  { href: "/gift-cards", label: "GIFT CARDS" },
];

function getLondonTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function EditorialShell({
  children,
  eyebrow,
  title,
  intro,
  section = "01",
  variant = "moment",
  heroImage,
}: EditorialShellProps) {
  const [clock, setClock] = useState("--:--");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => setClock(getLondonTime());
    updateClock();
    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`${styles.page} ${styles[variant]}`}>
      <header className={styles.nav}>
        <Link href="/" className={styles.logo}>
          VELVET HOUR
        </Link>

        <div className={styles.navCenter}>
          <span>SOHO / LONDON</span>
          <span className={styles.divider}>-</span>
          <span>{clock} LDN</span>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
        >
          <span>MENU</span>
          <i aria-hidden="true">
            <b />
            <b />
          </i>
        </button>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroImage}>
            <Image src={heroImage} alt="" fill priority sizes="100vw" />
          </div>
          <div className={styles.heroTop}>
            <span>{section} / {eyebrow}</span>
            <span>LONDON / AFTER DARK</span>
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1>{title}</h1>
            <p className={styles.heroIntro}>{intro}</p>
          </div>
        </section>

        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.footerLogo}>
            VELVET <em>HOUR</em>
          </Link>
          <div className={styles.footerLinks}>
            <span>EXPLORE</span>
            {links.slice(0, 6).map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.footerMeta}>
            <span>SOHO / LONDON</span>
            <span>FOOD / WINE / MUSIC</span>
            <Link href="/the-velvet-list">THE VELVET LIST</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>GOOD FOOD. BAD HOURS.</span>
          <span>© 2026 VELVET HOUR</span>
        </div>
      </footer>

      <div
        className={`${styles.menuOverlay} ${menuOpen ? styles.menuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.menuInner}>
          <div className={styles.menuTop}>
            <span>VELVET HOUR / NAVIGATION</span>
            <button type="button" onClick={() => setMenuOpen(false)}>
              CLOSE <span className={styles.closeMark} aria-hidden="true" />
            </button>
          </div>
          <nav className={styles.overlayLinks} aria-label="Main navigation">
            {links.map((link, index) => (
              <Link href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
                <small>0{index + 1}</small>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={styles.menuBottom}>
            <span>THE ROOM / SOHO</span>
            <span>OPEN LATE / LONDON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
