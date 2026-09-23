"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const nights = [
  {
    id: "velvet",
    day: "26",
    month: "SEP",
    year: "2026",
    type: "VELVET HOUR",
    title: "M. SAINT",
    subtitle: "DJ SET / ALL NIGHT",
    time: "00:00 — 03:30",
    room: "THE MAIN ROOM",
    description:
      "The room changes after midnight. Low light, heavy bass, slow pours and no reason to leave early.",
    image:
      "https://images.unsplash.com/photo-1571266028243-d220c9c3b8a7?auto=format&fit=crop&w=2400&q=90",
    accent: "rgba(142, 38, 52, .32)",
  },
  {
    id: "after",
    day: "27",
    month: "SEP",
    year: "2026",
    type: "AFTER DARK",
    title: "NIGHT SERVICE",
    subtitle: "LIVE / DJ",
    time: "23:00 — 04:00",
    room: "THE WHOLE HOUSE",
    description:
      "Dinner turns into drinks, drinks turn into music. A late service built around movement, conversation and sound.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2400&q=90",
    accent: "rgba(98, 22, 40, .34)",
  },
  {
    id: "noir",
    day: "02",
    month: "OCT",
    year: "2026",
    type: "NOIR DINNER",
    title: "TBA",
    subtitle: "DINNER / SOUND",
    time: "20:00 — LATE",
    room: "THE DINING ROOM",
    description:
      "A darker table. A slower service. Wine, candlelight and a soundtrack that stays deliberately below the conversation.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2400&q=90",
    accent: "rgba(126, 32, 45, .26)",
  },
  {
    id: "sunday",
    day: "04",
    month: "OCT",
    year: "2026",
    type: "SUNDAY SLOW",
    title: "OPEN HOUSE",
    subtitle: "FOOD / WINE / RECORDS",
    time: "12:00 — 21:00",
    room: "THE HOUSE",
    description:
      "A slower version of the room. Long lunch, natural wine and records from noon until the city gets dark.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=90",
    accent: "rgba(100, 38, 35, .25)",
  },
];

export default function NightsPage() {
  const [active, setActive] = useState(0);
  const [clock, setClock] = useState("--:--");

  const current = nights[active];

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };

    updateClock();

    const interval = window.setInterval(updateClock, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        setActive((value) => (value + 1) % nights.length);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        setActive((value) => (value - 1 + nights.length) % nights.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main
      className="nights-page"
      style={
        {
          "--night-image": `url("${current.image}")`,
          "--night-accent": current.accent,
        } as React.CSSProperties
      }
    >
      <div className="nights-atmosphere" />

      {/* HEADER */}
      <header className="nights-header">
        <Link href="/" className="nights-brand">
          VELVET HOUR
        </Link>

        <div className="nights-meta">
          <span>SOHO / LONDON</span>
          <span>{clock} GMT</span>
        </div>

        <Link href="/" className="nights-close">
          CLOSE ×
        </Link>
      </header>

      {/* HERO */}
      <section className="nights-hero">
        <div className="nights-hero-bg" key={current.id} />

        <div className="nights-hero-overlay" />

        <div className="nights-topline">
          <span>04 / NIGHTS</span>
          <span>THE ROOM AFTER DARK</span>
        </div>

        <div className="nights-hero-content">
          <div className="nights-date-large">
            <span>{current.month}</span>
            <strong>{current.day}</strong>
            <span>{current.year}</span>
          </div>

          <div className="nights-title">
            <p>{current.type}</p>

            <h1>
              {current.title}
              <em>.</em>
            </h1>

            <span>{current.subtitle}</span>
          </div>
        </div>

        <div className="nights-hero-bottom">
          <div>
            <span>TIME</span>
            <strong>{current.time}</strong>
          </div>

          <div>
            <span>ROOM</span>
            <strong>{current.room}</strong>
          </div>

          <div>
            <span>18 D&apos;ARBLAY STREET</span>
            <strong>SOHO / W1F</strong>
          </div>

          <div className="nights-counter">
            <span>
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(nights.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="nights-intro">
        <div className="nights-intro-index">
          THE HOUSE / AFTER HOURS
        </div>

        <div className="nights-intro-copy">
          <p className="nights-kicker">
            THE NIGHT DOESN&apos;T END AT DINNER.
          </p>

          <h2>
            SOME NIGHTS ARE
            <br />
            <em>BUILT TO STAY.</em>
          </h2>

          <p className="nights-intro-description">
            VELVET HOUR moves through the night in phases. Dinner is only the
            beginning. As the lights drop, the room gets louder, the tables
            get smaller and the distinction between bar, club and restaurant
            starts to disappear.
          </p>
        </div>
      </section>

      {/* NIGHT SELECTOR */}
      <section className="night-selector">
        <div className="night-selector-head">
          <span>UPCOMING / 2026</span>
          <span>SELECT A NIGHT</span>
        </div>

        <div className="night-list">
          {nights.map((night, index) => {
            const isActive = index === active;

            return (
              <button
                type="button"
                key={night.id}
                className={`night-row ${isActive ? "active" : ""}`}
                onClick={() => setActive(index)}
              >
                <span className="night-row-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="night-row-date">
                  <strong>{night.day}</strong>
                  <small>{night.month}</small>
                </span>

                <span className="night-row-main">
                  <strong>{night.type}</strong>
                  <small>{night.subtitle}</small>
                </span>

                <span className="night-row-time">
                  {night.time}
                </span>

                <span className="night-row-arrow">
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED NIGHT */}
      <section className="night-feature">
        <div className="night-feature-image">
          <div
            className="night-feature-image-inner"
            key={current.id}
            style={{
              backgroundImage: `url("${current.image}")`,
            }}
          />

          <div className="night-feature-image-overlay" />

          <div className="night-feature-image-label">
            <span>VELVET HOUR</span>
            <span>{current.type}</span>
          </div>

          <div className="night-feature-image-meta">
            <span>
              {current.day} / {current.month} / {current.year}
            </span>

            <span>SOHO / LONDON</span>
          </div>
        </div>

        <div className="night-feature-copy">
          <span className="night-feature-label">
            {current.day} / {current.month} — {current.type}
          </span>

          <h2>
            {current.title}
            <br />
            <em>{current.subtitle}</em>
          </h2>

          <p>{current.description}</p>

          <div className="night-feature-details">
            <div>
              <span>START</span>
              <strong>
                {current.time.split(" — ")[0]}
              </strong>
            </div>

            <div>
              <span>ROOM</span>
              <strong>{current.room}</strong>
            </div>

            <div>
              <span>ADDRESS</span>
              <strong>W1F / SOHO</strong>
            </div>
          </div>

          <Link
            href="/#reserve"
            className="night-reserve"
          >
            <span>RESERVE A TABLE</span>
            <strong>↗</strong>
          </Link>

          <div className="night-feature-footnote">
            <span>TABLES ARE LIMITED</span>
            <span>DINNER / MUSIC / LATE</span>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="night-manifesto">
        <div className="night-manifesto-word">
          NIGHT
        </div>

        <div className="night-manifesto-copy">
          <p>
            <span>01</span>
            Dinner becomes drinks.
          </p>

          <p>
            <span>02</span>
            Drinks become music.
          </p>

          <p>
            <span>03</span>
            Music becomes the reason.
          </p>
        </div>
      </section>

      {/* INFORMATION */}
      <section className="night-info-grid">
        <div className="night-info-block">
          <span>01 / MUSIC</span>

          <h3>
            THE SOUND
            <br />
            CHANGES WITH
            <br />
            <em>THE HOUR.</em>
          </h3>

          <p>
            DJs, live sets and carefully selected records move
            through the house without ever becoming background
            noise.
          </p>
        </div>

        <div className="night-info-block">
          <span>02 / SERVICE</span>

          <h3>
            DINNER
            <br />
            UNTIL
            <br />
            <em>LATE.</em>
          </h3>

          <p>
            The kitchen stays open late on selected nights.
            Come for the table. Stay for everything after it.
          </p>
        </div>

        <div className="night-info-block">
          <span>03 / ROOM</span>

          <h3>
            NO DRESS
            <br />
            CODE.
            <br />
            <em>JUST NIGHT.</em>
          </h3>

          <p>
            No rules beyond respect for the room. Come dressed
            for where the night might take you.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nights-footer">
        <div className="nights-footer-brand">
          <strong>VELVET HOUR</strong>
          <span>DINING / BAR / MUSIC</span>
        </div>

        <div className="nights-footer-address">
          <span>18 D&apos;ARBLAY STREET</span>
          <span>LONDON W1F</span>
        </div>

        <Link
          href="/"
          className="nights-footer-back"
        >
          BACK TO THE ROOM ↑
        </Link>
      </footer>
    </main>
  );
}