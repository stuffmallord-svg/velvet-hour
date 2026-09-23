"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./nights.module.css";

type Night = {
  id: string;
  date: string;
  day: string;
  title: string;
  type: string;
  details: string;
  time: string;
  artist: string;
  image: string;
  description: string;
};

const nights: Night[] = [
  {
    id: "velvet-hour",
    date: "26",
    day: "SEP",
    title: "VELVET HOUR",
    type: "DJ SET / ALL NIGHT",
    details: "M. SAINT",
    time: "00:00—03:30",
    artist: "M. SAINT",
    image: "/images/velvet/gallery-01.jpg",
    description:
      "The room turns darker after midnight. Slow pressure, heavy bass and a night built without a fixed ending.",
  },
  {
    id: "after-dark",
    date: "27",
    day: "SEP",
    title: "AFTER DARK",
    type: "LIVE / DJ",
    details: "NIGHT SERVICE",
    time: "23:00—04:00",
    artist: "NIGHT SERVICE",
    image: "/images/velvet/after-dark.jpg",
    description:
      "A live set dissolving into a late-night DJ session. Dinner, drinks and the first light of morning.",
  },
  {
    id: "noir-dinner",
    date: "02",
    day: "OCT",
    title: "NOIR DINNER",
    type: "DINNER / SOUND",
    details: "TBA",
    time: "20:00—LATE",
    artist: "TBA",
    image: "/images/velvet/noir.jpg",
    description:
      "A slower room. Long dinner, low light and a soundtrack designed to stay underneath the conversation.",
  },
  {
    id: "sunday-slow",
    date: "04",
    day: "OCT",
    title: "SUNDAY SLOW",
    type: "FOOD / WINE / RECORDS",
    details: "DAY SERVICE",
    time: "12:00—21:00",
    artist: "VELVET HOUR",
    image: "/images/velvet/gallery-02.jpg",
    description:
      "The room changes shape for Sunday. Records, long lunches, bottles on the table and nowhere else to be.",
  },
];

function getLondonTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function NightsPage() {
  const [clock, setClock] = useState("--:--");
  const [selectedId, setSelectedId] = useState("after-dark");
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedNight =
    nights.find((night) => night.id === selectedId) ?? nights[1];

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
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.logo}>
          VELVET HOUR
        </Link>

        <div className={styles.navCenter}>
          <span>SOHO / LONDON</span>
          <span className={styles.divider}>—</span>
          <span className={styles.clock}>{clock} LDN</span>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
        >
          <span>MENU</span>

          <i>
            <b />
            <b />
          </i>
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src="/images/velvet/velvet.jpg"
            alt="VELVET HOUR nightlife"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className={styles.heroOverlay} />

        <div className={styles.heroTop}>
          <span>01 / THE NIGHTS</span>
          <span>LONDON / AFTER DARK</span>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Music / People / After Hours</p>

          <h1>
            The
            <em>Nights</em>
          </h1>

          <div className={styles.heroBottom}>
            <p>
              The room changes after dark.
              <br />
              Find out what happens next.
            </p>

            <div className={styles.heroIndex}>
              <span>FRI — SUN</span>
              <span>20:00—04:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.intro}>
        <div className={styles.introNumber}>02</div>

        <div>
          <p className={styles.eyebrow}>AFTER HOURS</p>

          <h2>
            Not every
            <br />
            night is
            <em>the same.</em>
          </h2>

          <div className={styles.introGrid}>
            <p>
              VELVET HOUR is a room that changes with the clock.
            </p>

            <div>
              <p>
                Some nights begin around a dinner table. Others begin at
                midnight and continue until the city starts making noise again.
              </p>

              <span>London / Soho / 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.program}>
        <div className={styles.programHeader}>
          <div>
            <span className={styles.sectionNumber}>03 / PROGRAM</span>

            <h2>
              Choose your
              <em>night.</em>
            </h2>
          </div>

          <p>
            Four different moods.
            <br />
            One room.
          </p>
        </div>

        <div className={styles.programLayout}>
          <div className={styles.nightList}>
            {nights.map((night, index) => (
              <button
                type="button"
                key={night.id}
                className={`${styles.nightRow} ${
                  selectedId === night.id ? styles.active : ""
                }`}
                onClick={() => setSelectedId(night.id)}
              >
                <div className={styles.nightDate}>
                  <small>{night.day}</small>
                  <strong>{night.date}</strong>
                </div>

                <div className={styles.nightMain}>
                  <strong>{night.title}</strong>
                  <small>{night.type}</small>
                </div>

                <div className={styles.nightTime}>{night.time}</div>

                <div className={styles.nightArrow} aria-hidden="true" />

                <span className={styles.rowIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.feature}>
            <div className={styles.featureImage}>
              <Image
                key={selectedNight.image}
                src={selectedNight.image}
                alt={selectedNight.title}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />

              <div className={styles.featureOverlay} />

              <div className={styles.featureTop}>
                <span>{selectedNight.day}</span>
                <span>{selectedNight.date}</span>
              </div>

              <div className={styles.featureBottom}>
                <span>{selectedNight.type}</span>
                <span>{selectedNight.time}</span>
              </div>
            </div>

            <div className={styles.featureCopy}>
              <div>
                <span className={styles.sectionNumber}>FEATURED NIGHT</span>

                <h3>{selectedNight.title}</h3>
              </div>

              <p>{selectedNight.description}</p>

              <div className={styles.featureMeta}>
                <span>{selectedNight.artist}</span>
                <span>{selectedNight.time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.afterHours}>
        <div className={styles.afterHoursImage}>
          <Image
            src="/images/velvet/after-dark.jpg"
            alt="After dark at Velvet Hour"
            fill
            sizes="100vw"
          />

          <div className={styles.afterHoursOverlay} />
        </div>

        <div className={styles.afterHoursContent}>
          <div className={styles.afterHoursTop}>
            <span>04 / AFTER DARK</span>
            <span>00:00—04:00</span>
          </div>

          <div className={styles.afterHoursCenter}>
            <p>
              When dinner
              <br />
              <em>becomes something else.</em>
            </p>
          </div>

          <div className={styles.afterHoursBottom}>
            <p>
              Low light.
              <br />
              High volume.
              <br />
              No dress code.
            </p>

            <span>THE ROOM / LATE</span>
          </div>
        </div>
      </section>

      <section className={styles.details}>
        <div className={styles.detailsHeader}>
          <span className={styles.sectionNumber}>05 / THE ROOM</span>

          <h2>
            Stay for
            <em>the last one.</em>
          </h2>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailBlock}>
            <span>01</span>

            <h3>Music</h3>

            <p>
              DJs, live sets and records selected for the room rather than the
              algorithm.
            </p>
          </div>

          <div className={styles.detailBlock}>
            <span>02</span>

            <h3>Drinks</h3>

            <p>
              Cocktails, wine and the occasional drink that exists only for
              one night.
            </p>
          </div>

          <div className={styles.detailBlock}>
            <span>03</span>

            <h3>Kitchen</h3>

            <p>
              Food continues late. Some dishes are better after midnight than
              they are at eight.
            </p>
          </div>

          <div className={styles.detailBlock}>
            <span>04</span>

            <h3>People</h3>

            <p>
              Come alone. Come late. Come with someone you have not seen in
              years.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.statementTop}>
          <span>06 / ONE MORE</span>
          <span>NO LAST SONG</span>
        </div>

        <div className={styles.statementCenter}>
          <p>
            Some nights
            <br />
            <em>should not end.</em>
          </p>
        </div>

        <div className={styles.statementBottom}>
          <span>VELVET HOUR / SOHO</span>
          <Link href="/?reserve=1">
            RESERVE A TABLE <span aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.footerLogo}>
            VELVET
            <em>HOUR</em>
          </Link>

          <div className={styles.footerLinks}>
            <Link href="/">HOME</Link>
            <Link href="/menu">MENU</Link>
            <Link href="/nights">NIGHTS</Link>
            <Link href="/private-dining">PRIVATE DINING</Link>
            <Link href="/reservations">RESERVATIONS</Link>
            <Link href="/gift-cards">GIFT CARDS</Link>
            <Link href="/the-velvet-list">THE VELVET LIST</Link>
          </div>

          <div className={styles.footerMeta}>
            <span>SOHO / LONDON</span>
            <span>CONCEPT PROJECT / 2026</span>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>FOOD / WINE / MUSIC</span>
          <span>GOOD FOOD. BAD HOURS.</span>
          <span>© 2026 VELVET HOUR</span>
        </div>
      </footer>

      <div
        className={`${styles.fullscreenMenu} ${
          menuOpen ? styles.menuOpen : ""
        }`}
      >
        <div className={styles.fullscreenInner}>
          <div className={styles.overlayTop}>
            <span>VELVET HOUR</span>

            <button type="button" onClick={() => setMenuOpen(false)}>
              CLOSE ×
            </button>
          </div>

          <nav className={styles.overlayLinks}>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <small>01</small>
              HOME
            </Link>

            <Link href="/menu" onClick={() => setMenuOpen(false)}>
              <small>02</small>
              MENU
            </Link>

            <Link href="/nights" onClick={() => setMenuOpen(false)}>
              <small>03</small>
              NIGHTS
            </Link>

            <Link href="/private-dining" onClick={() => setMenuOpen(false)}>
              <small>04</small>
              PRIVATE DINING
            </Link>

            <Link href="/reservations" onClick={() => setMenuOpen(false)}>
              <small>05</small>
              RESERVATIONS
            </Link>

            <Link href="/gift-cards" onClick={() => setMenuOpen(false)}>
              <small>06</small>
              GIFT CARDS
            </Link>
          </nav>

          <div className={styles.overlayBottom}>
            <span>SOHO / LONDON</span>
            <span>{clock} LDN</span>
          </div>
        </div>
      </div>
    </main>
  );
}