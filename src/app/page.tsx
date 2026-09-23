"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type Phase = {
  time: string;
  label: string;
  sub: string;
  accent: string;
};

type Night = {
  day: string;
  date: string;
  title: string;
  meta: string;
  time: string;
  artist: string;
  image: string;
};

const phases: Phase[] = [
  {
    time: "12",
    label: "DAY",
    sub: "LUNCH / COFFEE / SLOW HOURS",
    accent: "#7d1728",
  },
  {
    time: "18",
    label: "DINNER",
    sub: "FOOD / WINE / FIRST DRINK",
    accent: "#8d1f31",
  },
  {
    time: "22",
    label: "VELVET",
    sub: "BAR / MUSIC / SOCIAL",
    accent: "#a62a3d",
  },
  {
    time: "00",
    label: "AFTER DARK",
    sub: "DJS / LIVE / DANCEFLOOR",
    accent: "#bd3448",
  },
  {
    time: "03",
    label: "LAST CALL",
    sub: "LATE NIGHTS / ONE MORE",
    accent: "#641321",
  },
];

const nights: Night[] = [
  {
    day: "FRI",
    date: "26",
    title: "VELVET HOUR",
    meta: "DJ SET / ALL NIGHT",
    time: "00:00—03:30",
    artist: "M. SAINT",
    image: "/images/velvet/velvet.jpg",
  },
  {
    day: "SAT",
    date: "27",
    title: "AFTER DARK",
    meta: "LIVE / DJ",
    time: "23:00—04:00",
    artist: "NIGHT SERVICE",
    image: "/images/velvet/after-dark.jpg",
  },
  {
    day: "THU",
    date: "02",
    title: "NOIR DINNER",
    meta: "DINNER / SOUND",
    time: "20:00—LATE",
    artist: "TBA",
    image: "/images/velvet/noir.jpg",
  },
];

const menuItems = [
  {
    section: "RAW",
    items: [
      ["Yellowtail / ponzu / chilli", "18"],
      ["Beef tartare / smoked yolk", "21"],
      ["Oyster / green apple / dill", "6"],
    ],
  },
  {
    section: "FIRE",
    items: [
      ["Charred octopus / nduja", "24"],
      ["Short rib / black garlic", "31"],
      ["Burnt cabbage / tahini", "15"],
    ],
  },
  {
    section: "SWEET",
    items: [
      ["Dark chocolate / sea salt", "12"],
      ["Pear / vanilla / olive oil", "11"],
      ["Soft serve / black sesame", "9"],
    ],
  },
];

const gallery = [
  "/images/velvet/gallery-01.jpg",
  "/images/velvet/gallery-02.jpg",
  "/images/velvet/after-dark.jpg",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhase, setActivePhase] = useState(3);
  const [activeNight, setActiveNight] = useState(1);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);
  const [clock, setClock] = useState("--:--");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const currentPhase = phases[activePhase] ?? phases[0];
  const currentNight = nights[activeNight] ?? nights[0];

  const phaseDescriptions = [
    "The room opens slowly. Coffee, lunch, low light and nowhere to rush.",
    "The dining room shifts into evening. Wine, plates and the first conversations.",
    "The lights drop. The bar becomes the centre of the room.",
    "The room changes completely. Music gets louder and the night takes over.",
    "The final hours. Fewer people, lower lights, one last drink.",
  ];

  const phaseDescription =
    phaseDescriptions[activePhase] ?? phaseDescriptions[0];

  useEffect(() => {
    const updateClock = () => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      setClock(formatter.format(new Date()));
    };

    updateClock();

    const interval = window.setInterval(updateClock, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 30);
      setShowTop(y > 700);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (menuOpen || reservationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, reservationOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setReservationOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);

    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const openReservation = () => {
    setReservationSent(false);
    setReservationOpen(true);
  };

  const closeReservation = () => {
    setReservationOpen(false);
  };

  const submitReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReservationSent(true);
  };

  return (
    <main
      className="vh-site"
      style={
        {
          "--accent": currentPhase.accent,
        } as CSSProperties
      }
    >
      <div className="vh-red-glow" aria-hidden="true" />

      <header className={`vh-nav ${scrolled ? "is-scrolled" : ""}`}>
        <button
          className="vh-logo"
          onClick={() => scrollTo("top")}
          aria-label="Back to top"
        >
          <span>VELVET</span>
          <span>HOUR</span>
        </button>

        <div className="vh-nav-center">
          <span className="vh-live-dot" />
          <span>LONDON</span>
          <span className="vh-clock">{clock}</span>
        </div>

        <button
          className={`vh-menu-trigger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="vh-menu-label">
            {menuOpen ? "CLOSE" : "MENU"}
          </span>

          <span className="vh-menu-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <section id="top" className="vh-hero">
        <div className="vh-hero-image">
          <Image
            src="/images/velvet/hero.jpg"
            alt="VELVET HOUR interior"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="vh-hero-overlay" />

        <div className="vh-hero-content">
          <div className="vh-kicker">
            <span>EST. 2026</span>
            <span>NIGHT / DINING / MUSIC</span>
          </div>

          <div className="vh-hero-title-wrap">
            <h1>
              VELVET
              <em>HOUR</em>
            </h1>
          </div>

          <div className="vh-hero-bottom">
            <p>
              A late-night room for food,
              <br />
              sound and everything between.
            </p>

            <button
              className="vh-circle-link"
              onClick={() => scrollTo("experience")}
              aria-label="Explore Velvet Hour"
            >
              <span>↓</span>
            </button>
          </div>
        </div>

        <div className="vh-hero-index">
          <span>01</span>
          <span>/</span>
          <span>07</span>
        </div>
      </section>

      <section className="vh-intro vh-section" id="experience">
        <div className="vh-container">
          <div className="vh-section-topline">
            <span>01 — THE ROOM</span>
            <span>OPEN UNTIL LATE</span>
          </div>

          <div className="vh-intro-grid">
            <div className="vh-intro-number">01</div>

            <div className="vh-intro-main">
              <p className="vh-eyebrow">NOT A RESTAURANT. NOT A CLUB.</p>

              <h2>
                Somewhere
                <br />
                <i>in between.</i>
              </h2>
            </div>

            <div className="vh-intro-copy">
              <p>
                VELVET HOUR is built around the hours when most places begin
                closing.
              </p>

              <p>
                Dinner turns into drinks. Drinks turn into music. Music turns
                into something less defined.
              </p>

              <p className="vh-muted">
                Come early. Stay late. There is no correct way to experience
                the room.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="vh-states vh-section">
        <div className="vh-container">
          <div className="vh-section-topline">
            <span>02 — THE HOURS</span>
            <span>THE ROOM CHANGES</span>
          </div>

          <div className="vh-states-layout">
            <div className="vh-state-list">
              {phases.map((phase, index) => (
                <button
                  key={phase.time}
                  className={`vh-state-row ${
                    activePhase === index ? "is-active" : ""
                  }`}
                  onClick={() => setActivePhase(index)}
                >
                  <span className="vh-state-time">{phase.time}</span>

                  <span className="vh-state-info">
                    <strong>{phase.label}</strong>
                    <small>{phase.sub}</small>
                  </span>

                  <span className="vh-state-arrow">↗</span>
                </button>
              ))}
            </div>

            <div className="vh-state-display">
              <div
                className="vh-state-display-bg"
                style={{
                  background: `radial-gradient(circle at 50% 45%, ${currentPhase.accent}, transparent 62%)`,
                }}
              />

              <div className="vh-state-big-time">
                {currentPhase.time}
              </div>

              <div className="vh-state-display-copy">
                <span>{currentPhase.label}</span>
                <p>{phaseDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vh-menu-preview vh-section" id="menu">
        <div className="vh-container">
          <div className="vh-section-topline">
            <span>03 — THE MENU</span>
            <Link href="/menu">FULL MENU ↗</Link>
          </div>

          <div className="vh-menu-heading">
            <h2>
              FOOD FOR
              <br />
              <i>THE NIGHT.</i>
            </h2>

            <p>
              Small plates. Heavy flavours.
              <br />
              Nothing designed to keep you here
              <br />
              for only an hour.
            </p>
          </div>

          <div className="vh-food-grid">
            {menuItems.map((group) => (
              <div className="vh-food-group" key={group.section}>
                <div className="vh-food-heading">
                  <span>{group.section}</span>
                  <span>—</span>
                </div>

                {group.items.map(([name, price]) => (
                  <div className="vh-food-item" key={name}>
                    <span>{name}</span>
                    <span>{price}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="vh-menu-note">
            <span>MENU CHANGES WITH THE ROOM</span>
            <span>VEGETARIAN OPTIONS AVAILABLE</span>
          </div>
        </div>
      </section>

      <section className="vh-nights vh-section" id="nights">
        <div className="vh-container">
          <div className="vh-section-topline">
            <span>04 — NIGHTS</span>
            <Link href="/nights">ALL NIGHTS ↗</Link>
          </div>

          <div className="vh-nights-grid">
            <div className="vh-night-selector">
              {nights.map((night, index) => (
                <button
                  key={`${night.day}-${night.date}`}
                  className={`vh-night-row ${
                    activeNight === index ? "is-active" : ""
                  }`}
                  onClick={() => setActiveNight(index)}
                >
                  <span className="vh-night-date">
                    <small>{night.day}</small>
                    <strong>{night.date}</strong>
                  </span>

                  <span className="vh-night-name">
                    <strong>{night.title}</strong>
                    <small>{night.meta}</small>
                  </span>

                  <span className="vh-night-arrow">↗</span>
                </button>
              ))}
            </div>

            <div className="vh-night-feature">
              <div className="vh-night-image">
                <Image
                  key={currentNight.image}
                  src={currentNight.image}
                  alt={currentNight.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                />

                <div className="vh-night-image-overlay" />
              </div>

              <div className="vh-night-feature-info">
                <span>{currentNight.time}</span>
                <strong>{currentNight.artist}</strong>
              </div>

              <div className="vh-night-feature-title">
                {currentNight.title}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vh-manifesto vh-section">
        <div className="vh-manifesto-inner">
          <span className="vh-manifesto-small">VELVET HOUR / 2026</span>

          <h2>
            THE NIGHT
            <br />
            <i>IS LONGER</i>
            <br />
            <span>THAN YOU THINK.</span>
          </h2>

          <div className="vh-manifesto-bottom">
            <span>FOOD</span>
            <span>MUSIC</span>
            <span>PEOPLE</span>
            <span>TIME</span>
          </div>
        </div>
      </section>

      <section className="vh-gallery vh-section" id="gallery">
        <div className="vh-container">
          <div className="vh-section-topline">
            <span>05 — THE ROOM</span>
            <span>AFTER HOURS</span>
          </div>

          <div className="vh-gallery-grid">
            <div className="vh-gallery-item vh-gallery-large">
              <Image
                src={gallery[0]}
                alt="VELVET HOUR room"
                fill
                sizes="(max-width: 900px) 100vw, 62vw"
              />
            </div>

            <div className="vh-gallery-item vh-gallery-small">
              <Image
                src={gallery[1]}
                alt="VELVET HOUR atmosphere"
                fill
                sizes="(max-width: 900px) 100vw, 36vw"
              />
            </div>

            <div className="vh-gallery-item vh-gallery-wide">
              <Image
                src={gallery[2]}
                alt="VELVET HOUR after dark"
                fill
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="vh-reservation vh-section" id="reserve">
        <div className="vh-container">
          <div className="vh-reservation-grid">
            <div>
              <span className="vh-eyebrow">06 — RESERVATIONS</span>

              <h2>
                COME
                <br />
                <i>THROUGH.</i>
              </h2>
            </div>

            <div className="vh-reservation-copy">
              <p>
                Tables are held for dinner, drinks and everything that happens
                afterwards.
              </p>

              <p className="vh-muted">
                For groups, private nights and late arrivals, contact the room
                directly.
              </p>

              <button
                className="vh-primary-button"
                onClick={openReservation}
              >
                <span>REQUEST A TABLE</span>
                <span>↗</span>
              </button>

              <div className="vh-reservation-details">
                <span>DINNER — 18:00</span>
                <span>BAR — 22:00</span>
                <span>LATE — UNTIL 04:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="vh-footer">
        <div className="vh-container">
          <div className="vh-footer-top">
            <div className="vh-footer-logo">
              VELVET
              <br />
              <i>HOUR</i>
            </div>

            <div className="vh-footer-links">
              <button onClick={() => scrollTo("experience")}>
                EXPERIENCE
              </button>
              <button onClick={() => scrollTo("menu")}>MENU</button>
              <button onClick={() => scrollTo("nights")}>NIGHTS</button>
              <button onClick={() => scrollTo("gallery")}>ROOM</button>
              <button onClick={openReservation}>RESERVATIONS</button>
            </div>

            <div className="vh-footer-meta">
              <span>VELVET HOUR</span>
              <span>LONDON / TBC</span>
              <span>OPEN LATE</span>
            </div>
          </div>

          <div className="vh-footer-bottom">
            <span>© 2026 VELVET HOUR</span>
            <span>CONCEPT PROJECT</span>
            <span>ALL HOURS RESERVED</span>
          </div>
        </div>
      </footer>

      {showTop && (
        <button
          className="vh-back-top"
          onClick={() => scrollTo("top")}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      <div
        className={`vh-menu-overlay ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="vh-menu-overlay-inner">
          <div className="vh-overlay-top">
            <span>VELVET HOUR</span>
            <span>THE ROOM / LONDON</span>
          </div>

          <nav className="vh-overlay-nav">
            <button onClick={() => scrollTo("experience")}>
              <span>01</span>
              EXPERIENCE
            </button>

            <button onClick={() => scrollTo("menu")}>
              <span>02</span>
              MENU
            </button>

            <button onClick={() => scrollTo("nights")}>
              <span>03</span>
              NIGHTS
            </button>

            <button onClick={() => scrollTo("gallery")}>
              <span>04</span>
              ROOM
            </button>

            <button onClick={() => scrollTo("reserve")}>
              <span>05</span>
              RESERVATIONS
            </button>
          </nav>

          <div className="vh-overlay-bottom">
            <span>FOOD / SOUND / PEOPLE</span>
            <span>OPEN LATE</span>
          </div>
        </div>
      </div>

      {reservationOpen && (
        <div
          className="vh-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservation-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReservation();
            }
          }}
        >
          <div className="vh-modal-card">
            <button
              className="vh-modal-close"
              onClick={closeReservation}
              aria-label="Close reservation"
            >
              ×
            </button>

            {!reservationSent ? (
              <>
                <span className="vh-eyebrow">VELVET HOUR</span>

                <h2 id="reservation-title">
                  REQUEST
                  <br />
                  <i>A TABLE.</i>
                </h2>

                <p>
                  Send us your preferred date and time. This concept interface
                  does not create a real reservation.
                </p>

                <form
                  className="vh-reservation-form"
                  onSubmit={submitReservation}
                >
                  <label>
                    <span>NAME</span>
                    <input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label>
                    <span>EMAIL</span>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@email.com"
                      required
                    />
                  </label>

                  <div className="vh-form-grid">
                    <label>
                      <span>DATE</span>
                      <input name="date" type="date" required />
                    </label>

                    <label>
                      <span>TIME</span>
                      <input name="time" type="time" required />
                    </label>
                  </div>

                  <label>
                    <span>PEOPLE</span>
                    <select name="people" defaultValue="2">
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3">3 people</option>
                      <option value="4">4 people</option>
                      <option value="5">5 people</option>
                      <option value="6">6 people</option>
                      <option value="7">7 people</option>
                      <option value="8">8+ people</option>
                    </select>
                  </label>

                  <button className="vh-submit-button" type="submit">
                    SEND REQUEST ↗
                  </button>
                </form>
              </>
            ) : (
              <div className="vh-confirmation">
                <span className="vh-confirmation-number">✓</span>

                <span className="vh-eyebrow">REQUEST RECEIVED</span>

                <h2>
                  SEE YOU
                  <br />
                  <i>AFTER DARK.</i>
                </h2>

                <p>
                  Your request has been recorded for this concept project.
                </p>

                <button
                  className="vh-submit-button"
                  onClick={closeReservation}
                >
                  CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}