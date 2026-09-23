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
  meta: string[];
  color: string;
};

type Night = {
  day: string;
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
    meta: ["LUNCH", "COFFEE", "SLOW HOURS"],
    color: "#7d1728",
  },
  {
    time: "18",
    title: "DINNER",
    meta: ["FOOD", "WINE", "FIRST DRINK"],
    color: "#8d1f31",
  },
  {
    time: "22",
    title: "VELVET",
    meta: ["BAR", "MUSIC", "SOCIAL"],
    color: "#a62a3d",
  },
  {
    time: "00",
    title: "AFTER DARK",
    meta: ["DJS", "LIVE", "DANCEFLOOR"],
    color: "#bd3448",
  },
  {
    time: "03",
    title: "LAST CALL",
    meta: ["LATE NIGHTS", "ONE MORE"],
    color: "#641321",
  },
];

const nights: Night[] = [
  {
    day: "FRI",
    date: "26 SEP",
    title: "VELVET HOUR",
    type: "DJ SET / ALL NIGHT",
    time: "00:00—03:30",
    artist: "M. SAINT",
    image: "/images/velvet/velvet.jpg",
  },
  {
    day: "SAT",
    date: "27 SEP",
    title: "AFTER DARK",
    type: "LIVE / DJ",
    time: "23:00—04:00",
    artist: "NIGHT SERVICE",
    image: "/images/velvet/after-dark.jpg",
  },
  {
    day: "THU",
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
    category: "RAW",
    items: [
      ["Yellowtail", "ponzu / chilli", "18"],
      ["Beef tartare", "smoked yolk", "21"],
      ["Oyster", "green apple / dill", "6"],
    ],
  },
  {
    category: "FIRE",
    items: [
      ["Charred octopus", "nduja", "24"],
      ["Short rib", "black garlic", "31"],
      ["Burnt cabbage", "tahini", "15"],
    ],
  },
  {
    category: "SWEET",
    items: [
      ["Dark chocolate", "sea salt", "12"],
      ["Pear", "vanilla / olive oil", "11"],
      ["Soft serve", "black sesame", "9"],
    ],
  },
];

const gallery = [
  {
    src: "/images/velvet/gallery-01.jpg",
    alt: "VELVET HOUR interior",
    className: "gallery-large",
  },
  {
    src: "/images/velvet/gallery-02.jpg",
    alt: "VELVET HOUR dining atmosphere",
    className: "gallery-small",
  },
  {
    src: "/images/velvet/noir.jpg",
    alt: "VELVET HOUR night atmosphere",
    className: "gallery-wide",
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

function getActivePhaseIndex(hour: number) {
  if (hour >= 3 && hour < 12) return 4;
  if (hour >= 12 && hour < 18) return 0;
  if (hour >= 18 && hour < 22) return 1;
  if (hour >= 22 || hour === 0) return hour === 0 ? 3 : 2;
  return 0;
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePhase, setActivePhase] = useState(3);
  const [activeNight, setActiveNight] = useState(1);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);
  const [clock, setClock] = useState(() => getLondonTime());
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setClock(getLondonTime());
      setActivePhaseIndexFromTime(now);
    };

    const setActivePhaseIndexFromTime = (date: Date) => {
      const londonHour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          hour12: false,
        }).format(date),
      );

      setActivePhase(getActivePhaseIndex(londonHour));
    };

    updateClock();

    const interval = window.setInterval(updateClock, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      setScrolled(y > 40);
      setShowTop(y > 900);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || reservationOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, reservationOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setReservationOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const currentNight = nights[activeNight];

  const handleReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReservationSent(true);
  };

  const closeReservation = () => {
    setReservationOpen(false);

    window.setTimeout(() => {
      setReservationSent(false);
    }, 250);
  };

  return (
    <main
      className="site-shell"
      style={
        {
          "--active-red": phases[activePhase].color,
        } as CSSProperties
      }
    >
      <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <Link
          href="/"
          className="nav-brand"
          aria-label="VELVET HOUR home"
        >
          VELVET HOUR
        </Link>

        <div className="nav-center">
          <span>SOHO / LONDON</span>
          <span
            className="nav-clock"
            suppressHydrationWarning
            aria-label="London local time"
          >
            LONDON {clock}
          </span>
        </div>

        <button
          type="button"
          className={`menu-trigger ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="fullscreen-menu"
        >
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          <span className="menu-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <Image
          src="/images/velvet/hero.jpg"
          alt="VELVET HOUR late-night dining room"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />

        <div className="hero-overlay" />

        <div className="hero-topline">
          <span>EST. 2026</span>
          <span>FOOD / WINE / MUSIC</span>
          <span>OPEN LATE</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">A ROOM FOR THE HOURS BETWEEN</p>

          <h1 id="hero-title">
            VELVET
            <br />
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
                onClick={() => setReservationOpen(true)}
              >
                RESERVE A TABLE <span>↗</span>
              </button>

              <Link href="/menu">
                VIEW MENU <span>↗</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-index">01 / 05</div>
      </section>

      <section className="intro section-pad">
        <div className="section-number">01</div>

        <div className="intro-copy">
          <p className="eyebrow">THE ROOM</p>

          <h2>
            NOT A RESTAURANT.
            <br />
            <em>NOT QUITE A CLUB.</em>
          </h2>

          <div className="intro-grid">
            <p className="intro-lead">
              VELVET HOUR lives somewhere between dinner and the
              first train home.
            </p>

            <div className="intro-body">
              <p>
                A room built around good food, precise drinks and
                music that changes with the hour.
              </p>
              <p>
                Come early for dinner. Stay for another drink.
                Leave when the city starts moving again.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="states" aria-label="VELVET HOUR phases">
        <div className="states-head">
          <div>
            <p className="eyebrow">THE HOURS</p>
            <h2>
              ONE ROOM.
              <br />
              <em>FIVE PHASES.</em>
            </h2>
          </div>

          <p className="states-note">
            The room changes without
            <br />
            asking you to leave.
          </p>
        </div>

        <div className="phase-list">
          {phases.map((phase, index) => (
            <button
              type="button"
              key={phase.time}
              className={`phase-row ${
                activePhase === index ? "is-active" : ""
              }`}
              onMouseEnter={() => setActivePhase(index)}
              onFocus={() => setActivePhase(index)}
              onClick={() => setActivePhase(index)}
              style={
                {
                  "--phase-color": phase.color,
                } as CSSProperties
              }
            >
              <span className="phase-time">{phase.time}</span>

              <span className="phase-title">{phase.title}</span>

              <span className="phase-meta">
                {phase.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </span>

              <span className="phase-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="menu-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE MENU</p>
            <h2>
              BUILT FOR
              <br />
              <em>SHARING.</em>
            </h2>
          </div>

          <Link href="/menu" className="text-link">
            FULL MENU <span>↗</span>
          </Link>
        </div>

        <div className="menu-grid">
          {menuPreview.map((group, index) => (
            <div className="menu-column" key={group.category}>
              <div className="menu-column-head">
                <span>0{index + 1}</span>
                <span>{group.category}</span>
              </div>

              <div className="menu-items">
                {group.items.map(([name, detail, price]) => (
                  <div className="menu-item" key={name}>
                    <div>
                      <h3>{name}</h3>
                      <p>{detail}</p>
                    </div>

                    <span>{price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="menu-note">
          <span>DINNER FROM 17:30</span>
          <span>VEGAN / VEGETARIAN OPTIONS</span>
          <span>ASK ABOUT ALLERGIES</span>
        </div>
      </section>

      <section className="nights-section">
        <div className="nights-image">
          <Image
            src={currentNight.image}
            alt={`${currentNight.title} at VELVET HOUR`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />

          <div className="image-gradient" />

          <div className="image-caption">
            <span>VELVET HOUR / NIGHTS</span>
            <span>{currentNight.date}</span>
          </div>
        </div>

        <div className="nights-content">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">WHAT&apos;S ON</p>
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

          <div className="night-list">
            {nights.map((night, index) => (
              <button
                type="button"
                key={night.title}
                className={`night-row ${
                  activeNight === index ? "is-active" : ""
                }`}
                onClick={() => setActiveNight(index)}
              >
                <span className="night-date">
                  <small>{night.day}</small>
                  <strong>{night.date}</strong>
                </span>

                <span className="night-main">
                  <strong>{night.title}</strong>
                  <small>{night.type}</small>
                </span>

                <span className="night-time">{night.time}</span>

                <span className="night-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>

          <div className="night-feature">
            <span>FEATURED</span>
            <strong>{currentNight.artist}</strong>
            <p>{currentNight.type}</p>
          </div>
        </div>
      </section>

      <section className="manifesto section-pad">
        <div className="section-number">03</div>

        <div className="manifesto-content">
          <p className="eyebrow">THE IDEA</p>

          <h2>
            SOMEWHERE
            <br />
            BETWEEN
            <br />
            <em>DINNER &amp; DAWN.</em>
          </h2>

          <div className="manifesto-bottom">
            <p>
              VELVET HOUR is designed around the moment a dinner
              becomes a night.
            </p>

            <p>
              The lights get lower. The music gets louder.
              Conversations become longer. Nothing tells you it&apos;s
              time to go.
            </p>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-head">
          <p className="eyebrow">INSIDE THE ROOM</p>
          <span>04 / 05</span>
        </div>

        <div className="gallery-grid">
          {gallery.map((item) => (
            <div
              className={`gallery-item ${item.className}`}
              key={item.src}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="reservation-section">
        <div className="reservation-inner">
          <div>
            <p className="eyebrow">TABLES / LATE NIGHTS</p>

            <h2>
              COME FOR
              <br />
              <em>THE HOUR.</em>
            </h2>
          </div>

          <div className="reservation-copy">
            <p>
              Dinner, drinks or the last table after midnight.
              Reservations are recommended.
            </p>

            <button
              type="button"
              className="reservation-button"
              onClick={() => setReservationOpen(true)}
            >
              MAKE A RESERVATION <span>↗</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            VELVET
            <br />
            <em>HOUR</em>
          </div>

          <div className="footer-columns">
            <div>
              <span className="footer-label">VISIT</span>
              <p>
                SOHO / LONDON
                <br />
                DINNER 17:30—LATE
              </p>
            </div>

            <div>
              <span className="footer-label">FOLLOW</span>
              <p>
                INSTAGRAM
                <br />
                @VELVETHOUR
              </p>
            </div>

            <div>
              <span className="footer-label">EXPLORE</span>
              <p>
                <Link href="/menu">MENU</Link>
                <br />
                <Link href="/nights">NIGHTS</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 VELVET HOUR</span>
          <span>CONCEPT PROJECT / LONDON</span>
          <span>05 / 05</span>
        </div>
      </footer>

      {showTop && (
        <button
          type="button"
          className="back-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      <div
        id="fullscreen-menu"
        className={`fullscreen-menu ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="fullscreen-menu-inner">
          <div className="fullscreen-menu-top">
            <span>VELVET HOUR / 2026</span>
            <span>SOHO / LONDON</span>
          </div>

          <nav className="fullscreen-links" aria-label="Main navigation">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              <span>01</span>
              HOME
            </Link>

            <Link
              href="/menu"
              onClick={() => setMenuOpen(false)}
            >
              <span>02</span>
              MENU
            </Link>

            <Link
              href="/nights"
              onClick={() => setMenuOpen(false)}
            >
              <span>03</span>
              NIGHTS
            </Link>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setReservationOpen(true);
              }}
            >
              <span>04</span>
              RESERVE
            </button>
          </nav>

          <div className="fullscreen-menu-bottom">
            <span>FOOD / WINE / MUSIC</span>
            <span
              suppressHydrationWarning
            >
              LONDON {clock}
            </span>
          </div>
        </div>
      </div>

      {reservationOpen && (
        <div
          className="reservation-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservation-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReservation();
            }
          }}
        >
          <div className="reservation-card">
            <button
              type="button"
              className="modal-close"
              onClick={closeReservation}
              aria-label="Close reservation"
            >
              ×
            </button>

            {!reservationSent ? (
              <>
                <p className="eyebrow">TABLE RESERVATION</p>

                <h2 id="reservation-title">
                  SAVE
                  <br />
                  <em>YOUR HOUR.</em>
                </h2>

                <form
                  className="reservation-form"
                  onSubmit={handleReservation}
                >
                  <label>
                    NAME
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                    />
                  </label>

                  <label>
                    EMAIL
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <div className="form-row">
                    <label>
                      DATE
                      <input
                        type="date"
                        name="date"
                        required
                      />
                    </label>

                    <label>
                      GUESTS
                      <select name="guests" defaultValue="2">
                        <option value="1">1 GUEST</option>
                        <option value="2">2 GUESTS</option>
                        <option value="3">3 GUESTS</option>
                        <option value="4">4 GUESTS</option>
                        <option value="5">5 GUESTS</option>
                        <option value="6">6 GUESTS</option>
                        <option value="7">7 GUESTS</option>
                        <option value="8">8 GUESTS</option>
                      </select>
                    </label>
                  </div>

                  <label>
                    TIME
                    <select name="time" defaultValue="21:00">
                      <option value="18:00">18:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                      <option value="21:00">21:00</option>
                      <option value="22:00">22:00</option>
                      <option value="23:00">23:00</option>
                    </select>
                  </label>

                  <button type="submit" className="form-submit">
                    REQUEST TABLE <span>↗</span>
                  </button>
                </form>

                <p className="form-note">
                  This is a concept experience. No real reservation
                  will be processed.
                </p>
              </>
            ) : (
              <div className="reservation-success">
                <span className="success-mark">✓</span>

                <p className="eyebrow">REQUEST RECEIVED</p>

                <h2>
                  SEE YOU
                  <br />
                  <em>AFTER DARK.</em>
                </h2>

                <p>
                  Your reservation request has been recorded for
                  this concept experience.
                </p>

                <button
                  type="button"
                  className="form-submit"
                  onClick={closeReservation}
                >
                  CLOSE <span>×</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}