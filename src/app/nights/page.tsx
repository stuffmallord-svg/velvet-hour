"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./nights.module.css";

type NightEvent = {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  subtitle: string;
  time: string;
  image: string;
  kicker: string;
  description: string;
  start: string;
  room: string;
  location: string;
};

const events: NightEvent[] = [
  {
    id: "velvet-hour",
    day: "26",
    month: "SEP",
    year: "2026",
    title: "VELVET HOUR",
    subtitle: "DJ SET / ALL NIGHT",
    time: "00:00 — 03:30",
    image: "/images/velvet/velvet.jpg",
    kicker: "VELVET HOUR",
    description:
      "The room changes after midnight. Low light, slow movement, deep records and a bar that stays open until the last track.",
    start: "00:00",
    room: "THE WHOLE HOUSE",
    location: "SOHO / LONDON",
  },
  {
    id: "after-dark",
    day: "27",
    month: "SEP",
    year: "2026",
    title: "AFTER DARK",
    subtitle: "LIVE / DJ",
    time: "23:00 — 04:00",
    image: "/images/velvet/after-dark.jpg",
    kicker: "AFTER DARK",
    description:
      "Dinner turns into drinks, drinks turn into music. A late service built around movement, sound and the people who stay.",
    start: "23:00",
    room: "THE WHOLE HOUSE",
    location: "SOHO / LONDON",
  },
  {
    id: "noir-dinner",
    day: "02",
    month: "OCT",
    year: "2026",
    title: "NOIR DINNER",
    subtitle: "DINNER / SOUND",
    time: "20:00 — LATE",
    image: "/images/velvet/noir.jpg",
    kicker: "NOIR DINNER",
    description:
      "A slower night built around the table. Seasonal plates, red wine and a soundtrack that gradually takes over the room.",
    start: "20:00",
    room: "DINING ROOM",
    location: "SOHO / LONDON",
  },
  {
    id: "sunday-slow",
    day: "04",
    month: "OCT",
    year: "2026",
    title: "SUNDAY SLOW",
    subtitle: "FOOD / WINE / RECORDS",
    time: "12:00 — 21:00",
    image: "/images/velvet/gallery-02.jpg",
    kicker: "SUNDAY SLOW",
    description:
      "No rush. Long lunches, vinyl, late afternoon drinks and a room designed to let Sunday run into the evening.",
    start: "12:00",
    room: "DINING ROOM",
    location: "SOHO / LONDON",
  },
];

export default function NightsPage() {
  const [selectedId, setSelectedId] = useState("after-dark");
  const [clock, setClock] = useState("--:--");

  const selectedEvent =
    events.find((event) => event.id === selectedId) ?? events[1];

  useEffect(() => {
    const updateClock = () => {
      const value = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());

      setClock(value);
    };

    updateClock();

    const interval = window.setInterval(updateClock, 30000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.background} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          VELVET
          <span>HOUR</span>
        </Link>

        <div className={styles.headerCenter}>
          <span>SOHO / LONDON</span>
          <span className={styles.headerDot}>●</span>
          <span>{clock} GMT</span>
        </div>

        <Link href="/" className={styles.close}>
          <span>BACK</span>
          <strong>×</strong>
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src="/images/velvet/after-dark.jpg"
            alt="VELVET HOUR after dark"
            fill
            priority
            sizes="100vw"
          />
          <div className={styles.heroShade} />
          <div className={styles.heroGrain} />
        </div>

        <div className={styles.heroTop}>
          <span>THE NIGHTS</span>
          <span>01 — 04</span>
        </div>

        <div className={styles.heroDate}>
          <span>SEP</span>
          <strong>27</strong>
          <span>2026</span>
        </div>

        <div className={styles.heroTitle}>
          <p>AFTER DARK</p>
          <h1>NIGHT<span>.</span></h1>
          <p className={styles.heroTitleBottom}>LIVE / DJ</p>
        </div>

        <div className={styles.heroBottom}>
          <div>
            <span>TIME</span>
            <strong>23:00 — 04:00</strong>
          </div>

          <div>
            <span>ROOM</span>
            <strong>THE WHOLE HOUSE</strong>
          </div>

          <div>
            <span>WHERE</span>
            <strong>SOHO / LONDON</strong>
          </div>
        </div>

        <div className={styles.heroCount}>
          <span>SCROLL TO EXPLORE</span>
          <span>↓</span>
        </div>
      </section>

      <section className={styles.intro}>
        <div className={styles.sectionIndex}>01 / THE NIGHT</div>

        <div className={styles.introContent}>
          <p className={styles.eyebrow}>
            THE NIGHT DOESN&apos;T END AT DINNER.
          </p>

          <h2>
            BUILT
            <br />
            TO <em>STAY.</em>
          </h2>

          <p className={styles.introText}>
            VELVET HOUR moves through the night in phases. Dinner is only the
            beginning. As the room gets darker, the music gets louder, the
            tables get smaller and the bar becomes the centre of everything.
          </p>
        </div>
      </section>

      <section className={styles.eventsSection}>
        <div className={styles.sectionIndex}>02 / WHAT&apos;S ON</div>

        <div className={styles.eventsHeading}>
          <p>SELECT A NIGHT</p>
          <h2>AFTER HOURS</h2>
        </div>

        <div className={styles.eventList}>
          {events.map((event, index) => {
            const isActive = selectedEvent.id === event.id;

            return (
              <button
                key={event.id}
                type="button"
                className={`${styles.eventRow} ${
                  isActive ? styles.eventRowActive : ""
                }`}
                onClick={() => setSelectedId(event.id)}
                aria-pressed={isActive}
              >
                <span className={styles.eventNumber}>
                  0{index + 1}
                </span>

                <span className={styles.eventDate}>
                  <small>{event.month}</small>
                  <strong>{event.day}</strong>
                </span>

                <span className={styles.eventName}>
                  <strong>{event.title}</strong>
                  <small>{event.subtitle}</small>
                </span>

                <span className={styles.eventTime}>
                  {event.time}
                </span>

                <span className={styles.eventArrow}>↗</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredImage}>
          <Image
            key={selectedEvent.image}
            src={selectedEvent.image}
            alt={selectedEvent.title}
            fill
            sizes="(max-width: 900px) 100vw, 65vw"
          />

          <div className={styles.featuredShade} />

          <div className={styles.imageTopLabel}>
            <span>{selectedEvent.kicker}</span>
            <span>{selectedEvent.year}</span>
          </div>

          <div className={styles.imageBottomLabel}>
            <span>{selectedEvent.location}</span>
            <span>{selectedEvent.time}</span>
          </div>
        </div>

        <div className={styles.featuredCopy}>
          <p className={styles.featuredKicker}>
            SELECTED NIGHT / {selectedEvent.month} {selectedEvent.day}
          </p>

          <h2>
            {selectedEvent.title === "AFTER DARK" ? (
              <>
                LIVE
                <br />
                <em>DJ.</em>
              </>
            ) : (
              <>
                {selectedEvent.title.split(" ")[0]}
                <br />
                <em>{selectedEvent.title.split(" ").slice(1).join(" ")}.</em>
              </>
            )}
          </h2>

          <p className={styles.featuredDescription}>
            {selectedEvent.description}
          </p>

          <div className={styles.details}>
            <div>
              <span>START</span>
              <strong>{selectedEvent.start}</strong>
            </div>

            <div>
              <span>ROOM</span>
              <strong>{selectedEvent.room}</strong>
            </div>

            <div>
              <span>LOCATION</span>
              <strong>{selectedEvent.location}</strong>
            </div>
          </div>

          <Link href="/#reserve" className={styles.reserveButton}>
            <span>RESERVE A TABLE</span>
            <strong>↗</strong>
          </Link>

          <div className={styles.featureNote}>
            <span>TABLES ARE LIMITED</span>
            <span>DINNER / MUSIC / LATE</span>
          </div>
        </div>
      </section>

      <section className={styles.manifesto}>
        <div className={styles.manifestoWord}>NIGHT</div>

        <div className={styles.manifestoContent}>
          <div className={styles.sectionIndex}>03 / AFTER HOURS</div>

          <div className={styles.manifestoLines}>
            <div>
              <span>01</span>
              <p>
                THE LAST COURSE IS NOT THE LAST WORD.
              </p>
            </div>

            <div>
              <span>02</span>
              <p>
                THE ROOM CHANGES WHEN THE CLOCK DOES.
              </p>
            </div>

            <div>
              <span>03</span>
              <p>
                STAY LONG ENOUGH TO SEE IT.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.info}>
        <div className={styles.sectionIndex}>04 / THE HOUSE</div>

        <div className={styles.infoGrid}>
          <article>
            <span>01 / MUSIC</span>
            <h3>THE HOUR.</h3>
            <p>
              DJs, live sets and carefully selected records move through the
              house without ever becoming background noise.
            </p>
          </article>

          <article>
            <span>02 / SERVICE</span>
            <h3>LATE.</h3>
            <p>
              The kitchen stays open late on selected nights. Come for the
              table. Stay for everything after it.
            </p>
          </article>

          <article>
            <span>03 / ROOM</span>
            <h3>JUST NIGHT.</h3>
            <p>
              No rules beyond respect for the room. Come dressed for wherever
              the night takes you.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.cta}>
        <p>WHEN THE CITY GOES QUIET</p>
        <h2>
          WE&apos;RE
          <br />
          STILL <em>OPEN.</em>
        </h2>

        <Link href="/#reserve" className={styles.ctaButton}>
          <span>BOOK THE NIGHT</span>
          <strong>↗</strong>
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <strong>VELVET HOUR</strong>
          <span>DINING / BAR / MUSIC</span>
        </div>

        <div className={styles.footerMeta}>
          <span>LONDON / SOHO</span>
          <span>CONCEPT PROJECT / 2026</span>
        </div>

        <Link href="/" className={styles.footerBack}>
          BACK TO HOME ↗
        </Link>
      </footer>
    </main>
  );
}