"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CSSProperties,
  FormEvent,
  useEffect,
  useState,
} from "react";

type Phase = {
  time: string;
  title: string;
  meta: string;
  color: string;
};

type Night = {
  date: string;
  title: string;
  type: string;
  time: string;
  artist: string;
  image: string;
};

const phases: Phase[] = [
  {
    time: "12",
    title: "DAY",
    meta: "LUNCH / COFFEE / SLOW HOURS",
    color: "#7d1728",
  },
  {
    time: "18",
    title: "DINNER",
    meta: "FOOD / WINE / FIRST DRINK",
    color: "#8d1f31",
  },
  {
    time: "22",
    title: "VELVET",
    meta: "BAR / MUSIC / SOCIAL",
    color: "#a62a3d",
  },
  {
    time: "00",
    title: "AFTER DARK",
    meta: "DJS / LIVE / DANCEFLOOR",
    color: "#bd3448",
  },
  {
    time: "03",
    title: "LAST CALL",
    meta: "LATE NIGHTS / ONE MORE",
    color: "#641321",
  },
];

const nights: Night[] = [
  {
    date: "26 SEP",
    title: "VELVET HOUR",
    type: "DJ SET / ALL NIGHT",
    time: "00:00—03:30",
    artist: "M. SAINT",
    image: "/images/velvet/velvet.jpg",
  },
  {
    date: "27 SEP",
    title: "AFTER DARK",
    type: "LIVE / DJ",
    time: "23:00—04:00",
    artist: "NIGHT SERVICE",
    image: "/images/velvet/after-dark.jpg",
  },
  {
    date: "02 OCT",
    title: "NOIR DINNER",
    type: "DINNER / SOUND",
    time: "20:00—LATE",
    artist: "TBA",
    image: "/images/velvet/noir.jpg",
  },
];

const menuPreview = [
  {
    section: "RAW",
    items: [
      ["Yellowtail", "ponzu / chilli", "18"],
      ["Beef tartare", "smoked yolk", "21"],
      ["Oyster", "green apple / dill", "6"],
    ],
  },
  {
    section: "FIRE",
    items: [
      ["Charred octopus", "nduja", "24"],
      ["Short rib", "black garlic", "31"],
      ["Burnt cabbage", "tahini", "15"],
    ],
  },
  {
    section: "SWEET",
    items: [
      ["Dark chocolate", "sea salt", "12"],
      ["Pear", "vanilla / olive oil", "11"],
      ["Soft serve", "black sesame", "9"],
    ],
  },
];

const gallery = [
  "/images/velvet/gallery-01.jpg",
  "/images/velvet/gallery-02.jpg",
  "/images/velvet/after-dark.jpg",
  "/images/velvet/noir.jpg",
];

function getLondonTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function getActivePhaseIndex(hour: number) {
  if (hour >= 3 && hour < 12) return 4;
  if (hour >= 12 && hour < 18) return 0;
  if (hour >= 18 && hour < 22) return 1;
  if (hour >= 22) return 2;
  return 3;
}

export default function Home() {
  const [clock, setClock] = useState(() => getLondonTime());
  const [activePhase, setActivePhase] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setClock(getLondonTime());

      const londonHour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "numeric",
          hour12: false,
        }).format(now),
      );

      setActivePhase(getActivePhaseIndex(londonHour));
    };

    updateClock();

    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reserve") === "1") {
      setReservationOpen(true);

      window.history.replaceState(
        {},
        "",
        window.location.pathname,
      );
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || reservationOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, reservationOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setMenuOpen(false);
      setReservationOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openReservation = () => {
    setSubmitted(false);
    setReservationOpen(true);
    setMenuOpen(false);
  };

  const handleReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="site-shell">
      <header className="site-nav">
        <Link href="/" className="nav-brand">
          VELVET HOUR
        </Link>

        <div className="nav-center">
          <span>SOHO / LONDON</span>
          <span className="nav-divider" />
          <span suppressHydrationWarning>{clock} LDN</span>
        </div>

        <button
          type="button"
          className="menu-trigger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          <span>MENU</span>
          <i aria-hidden="true">
            <b />
            <b />
          </i>
        </button>
      </header>

      <section className="hero">
        <div className="hero-image">
          <Image
            src="/images/velvet/hero.jpg"
            alt="VELVET HOUR"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="hero-overlay" />

        <div className="hero-topline">
          <span>SOHO / LONDON</span>
          <span>EST. 2026</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">A ROOM FOR THE HOURS BETWEEN</p>

          <h1>
            VELVET
            <em>HOUR</em>
          </h1>

          <div className="hero-bottom">
            <p>
              A late-night dining room,
              <br />
              bar and music space.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                onClick={openReservation}
              >
                RESERVE A TABLE <span>↗</span>
              </button>

              <Link href="/menu">
                VIEW MENU <span>↗</span>
              </Link>
            </div>

            <span className="hero-index">00 / 06</span>
          </div>
        </div>
      </section>

      <section className="intro section-pad">
        <div className="section-number">01 / THE HOUSE</div>

        <div className="intro-copy">
          <h2>
            NOT A RESTAURANT.
            <br />
            NOT QUITE A
            <em>CLUB.</em>
          </h2>

          <div className="intro-grid">
            <p className="intro-lead">
              VELVET HOUR exists somewhere between dinner and dawn.
            </p>

            <div className="intro-body">
              <p>
                A room for long dinners, short nights, unexpected
                conversations and music that gets louder as the clock
                gets later.
              </p>

              <p>
                Come for the table. Stay for the room. Leave when the
                city starts again.
              </p>

              <span>SOHO / LONDON / 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className="states section-pad">
        <div className="states-head">
          <div>
            <span className="section-number">02 / THE HOURS</span>
            <h2>
              ONE ROOM.
              <br />
              <em>FIVE STATES.</em>
            </h2>
          </div>

          <p className="states-note">
            The room changes with
            <br />
            London time.
          </p>
        </div>

        <div className="phase-list">
          {phases.map((phase, index) => (
            <button
              type="button"
              className={`phase-row ${
                activePhase === index ? "is-active" : ""
              }`}
              key={phase.time}
              onClick={() => setActivePhase(index)}
              style={
                {
                  "--phase-color": phase.color,
                } as CSSProperties
              }
            >
              <span className="phase-time">{phase.time}</span>
              <span className="phase-title">{phase.title}</span>
              <span className="phase-meta">{phase.meta}</span>
              <span className="phase-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="menu-section section-pad">
        <div className="section-heading">
          <div>
            <span className="section-number">03 / THE MENU</span>

            <h2>
              FOOD FOR
              <br />
              <em>THE HOURS.</em>
            </h2>
          </div>

          <Link href="/menu" className="text-link">
            FULL MENU <span>↗</span>
          </Link>
        </div>

        <div className="menu-grid">
          {menuPreview.map((column) => (
            <div className="menu-column" key={column.section}>
              <div className="menu-column-head">
                <span>{column.section}</span>
                <span>—</span>
              </div>

              <div className="menu-items">
                {column.items.map(([name, note, price]) => (
                  <div className="menu-item" key={name}>
                    <div>
                      <strong className="menu-item-name">
                        {name}
                      </strong>
                      <span className="menu-item-note">
                        {note}
                      </span>
                    </div>

                    <b className="menu-item-price">
                      £{price}
                    </b>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="nights-section section-pad">
        <div className="section-heading">
          <div>
            <span className="section-number">04 / NIGHTS</span>

            <h2>
              AFTER
              <br />
              <em>DARK.</em>
            </h2>
          </div>

          <Link href="/nights" className="text-link">
            ALL NIGHTS <span>↗</span>
          </Link>
        </div>

        <div className="nights-feature">
          <div className="nights-image">
            <Image
              src="/images/velvet/velvet.jpg"
              alt="VELVET HOUR night"
              fill
              sizes="(max-width: 760px) 100vw, 55vw"
            />

            <div className="image-gradient" />

            <div className="image-caption">
              <span>26 SEP</span>
              <span>00:00—03:30</span>
            </div>
          </div>

          <div className="nights-content">
            <span className="section-number">NEXT / 001</span>

            <h3>VELVET HOUR</h3>

            <p>
              A room after midnight. M. Saint behind the decks.
              Dinner becomes drinks. Drinks become something else.
            </p>

            <div className="night-list">
              {nights.map((night) => (
                <Link
                  href="/nights"
                  className="night-row"
                  key={night.date}
                >
                  <span>{night.date}</span>

                  <div className="night-main">
                    <strong>{night.title}</strong>
                    <small>{night.type}</small>
                  </div>

                  <span>{night.time}</span>
                  <span>↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-content">
          <span className="section-number">05 / THE ROOM</span>

          <h2>
            SOMEWHERE
            <br />
            BETWEEN
            <br />
            <em>DINNER & DAWN.</em>
          </h2>
        </div>

        <div className="manifesto-bottom">
          <p>
            FOOD.
            <br />
            WINE.
            <br />
            MUSIC.
          </p>

          <span>NO FIXED ENDING.</span>
        </div>
      </section>

      <section className="gallery-section section-pad">
        <div className="gallery-head">
          <span className="section-number">06 / THE ROOM</span>
          <p>LIGHT CHANGES. SO DOES EVERYTHING ELSE.</p>
        </div>

        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <div
              className={`gallery-item gallery-item-${index + 1}`}
              key={image}
            >
              <Image
                src={image}
                alt={`Velvet Hour room ${index + 1}`}
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="reservation-section section-pad">
        <div className="reservation-inner">
          <div className="reservation-copy">
            <span className="section-number">RESERVATIONS</span>

            <h2>
              COME
              <br />
              <em>LATE.</em>
            </h2>

            <p>
              Tables are released throughout the week.
              Walk-ins are welcome when the room allows.
            </p>
          </div>

          <button
            type="button"
            className="reservation-button"
            onClick={openReservation}
          >
            <span>RESERVE A TABLE</span>
            <span>↗</span>
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            VELVET
            <em>HOUR</em>
          </div>

          <div className="footer-columns">
            <div>
              <span className="footer-label">EXPLORE</span>
              <Link href="/menu">MENU</Link>
              <Link href="/nights">NIGHTS</Link>
            </div>

            <div>
              <span className="footer-label">ROOM</span>
              <span>SOHO / LONDON</span>
              <span>FOOD / WINE / MUSIC</span>
            </div>

            <div>
              <span className="footer-label">PROJECT</span>
              <span>CONCEPT PROJECT</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>GOOD FOOD. BAD HOURS.</span>
          <span>© 2026 VELVET HOUR</span>

          <button
            type="button"
            className="back-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            BACK TO TOP ↑
          </button>
        </div>
      </footer>

      <div
        className={`fullscreen-menu ${
          menuOpen ? "fullscreen-menu-open" : ""
        }`}
      >
        <div className="fullscreen-menu-inner">
          <div className="fullscreen-menu-top">
            <span>VELVET HOUR</span>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
            >
              CLOSE ×
            </button>
          </div>

          <nav className="fullscreen-links">
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

            <button type="button" onClick={openReservation}>
              <small>04</small>
              RESERVE
            </button>
          </nav>

          <div className="fullscreen-menu-bottom">
            <span>SOHO / LONDON</span>
            <span suppressHydrationWarning>{clock} LDN</span>
          </div>
        </div>
      </div>

      <div
        className={`reservation-modal ${
          reservationOpen ? "reservation-modal-open" : ""
        }`}
      >
        <div className="reservation-card">
          <button
            type="button"
            className="modal-close"
            onClick={() => setReservationOpen(false)}
            aria-label="Close reservation"
          >
            CLOSE ×
          </button>

          {!submitted ? (
            <>
              <span className="section-number">
                RESERVATIONS / 2026
              </span>

              <h2>
                BOOK
                <br />
                <em>THE ROOM.</em>
              </h2>

              <form
                className="reservation-form"
                onSubmit={handleReservation}
              >
                <div className="form-row">
                  <label>
                    NAME
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your name"
                    />
                  </label>

                  <label>
                    EMAIL
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    DATE
                    <input required name="date" type="date" />
                  </label>

                  <label>
                    GUESTS
                    <select
                      required
                      name="guests"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5 guests</option>
                      <option value="6">6 guests</option>
                      <option value="7+">7+ guests</option>
                    </select>
                  </label>
                </div>

                <label>
                  TIME
                  <select required name="time" defaultValue="">
                    <option value="" disabled>
                      Select a time
                    </option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                    <option value="00:00">00:00</option>
                  </select>
                </label>

                <button type="submit" className="form-submit">
                  REQUEST A TABLE <span>↗</span>
                </button>

                <p className="form-note">
                  CONCEPT PROJECT — THIS FORM DOES NOT PROCESS A REAL
                  RESERVATION.
                </p>
              </form>
            </>
          ) : (
            <div className="reservation-success">
              <span className="success-mark">✓</span>

              <span className="section-number">
                REQUEST RECEIVED
              </span>

              <h2>
                SEE YOU
                <br />
                <em>LATE.</em>
              </h2>

              <p>
                Your reservation request has been received.
                This is a concept-project interaction and does not
                create a real booking.
              </p>

              <button
                type="button"
                className="form-submit"
                onClick={() => setReservationOpen(false)}
              >
                CLOSE <span>×</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}