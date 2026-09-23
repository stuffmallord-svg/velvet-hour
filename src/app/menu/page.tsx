"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./menu.module.css";

type MenuItem = {
  name: string;
  description: string;
  price: string;
  note?: string;
};

type MenuSection = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  items: MenuItem[];
};

const sections: MenuSection[] = [
  {
    id: "raw",
    number: "01",
    title: "Raw",
    subtitle: "Cold / sharp / precise",
    image: "/images/velvet/gallery-01.jpg",
    items: [
      {
        name: "Yellowtail",
        description: "ponzu / chilli / coriander oil",
        price: "18",
      },
      {
        name: "Beef Tartare",
        description: "smoked yolk / shallot / toasted rye",
        price: "21",
      },
      {
        name: "Oysters",
        description: "green apple / dill / sea herbs",
        price: "6",
        note: "each",
      },
      {
        name: "Scallop",
        description: "citrus kosho / fennel / brown butter",
        price: "19",
      },
    ],
  },
  {
    id: "fire",
    number: "02",
    title: "Fire",
    subtitle: "Char / smoke / heat",
    image: "/images/velvet/after-dark.jpg",
    items: [
      {
        name: "Charred Octopus",
        description: "nduja / lemon / smoked potato",
        price: "24",
      },
      {
        name: "Short Rib",
        description: "black garlic / red wine / onion",
        price: "31",
      },
      {
        name: "Burnt Cabbage",
        description: "tahini / fermented chilli / sesame",
        price: "15",
      },
      {
        name: "Chicken Thigh",
        description: "anchovy butter / herbs / lemon",
        price: "22",
      },
    ],
  },
  {
    id: "pasta",
    number: "03",
    title: "Pasta",
    subtitle: "Late kitchen classics",
    image: "/images/velvet/noir.jpg",
    items: [
      {
        name: "Black Garlic Rigatoni",
        description: "parmesan / black pepper / aged balsamic",
        price: "22",
      },
      {
        name: "Crab Linguine",
        description: "chilli / tomato / shellfish butter",
        price: "27",
      },
      {
        name: "Cacio e Pepe",
        description: "pecorino / black pepper / butter",
        price: "19",
      },
      {
        name: "Truffle Mafaldine",
        description: "wild mushroom / parmesan / thyme",
        price: "26",
      },
    ],
  },
  {
    id: "sweet",
    number: "04",
    title: "Sweet",
    subtitle: "After dinner / before dawn",
    image: "/images/velvet/gallery-02.jpg",
    items: [
      {
        name: "Dark Chocolate",
        description: "sea salt / olive oil / cacao",
        price: "12",
      },
      {
        name: "Pear",
        description: "vanilla / olive oil / almond",
        price: "11",
      },
      {
        name: "Soft Serve",
        description: "black sesame / caramel / sea salt",
        price: "9",
      },
      {
        name: "Affogato",
        description: "vanilla gelato / espresso / amaro",
        price: "10",
      },
    ],
  },
  {
    id: "late",
    number: "05",
    title: "Late",
    subtitle: "The kitchen stays open",
    image: "/images/velvet/velvet.jpg",
    items: [
      {
        name: "Cheeseburger",
        description: "aged cheddar / onion / house sauce",
        price: "17",
      },
      {
        name: "Crispy Chicken",
        description: "hot honey / pickles / cabbage",
        price: "16",
      },
      {
        name: "Chips",
        description: "malt vinegar / smoked salt",
        price: "7",
      },
      {
        name: "Grilled Cheese",
        description: "aged cheddar / sourdough / mustard",
        price: "12",
      },
    ],
  },
  {
    id: "drinks",
    number: "06",
    title: "Drinks",
    subtitle: "Wine / cocktails / after hours",
    image: "/images/velvet/hero.jpg",
    items: [
      {
        name: "Velvet Martini",
        description: "gin / dry vermouth / olive",
        price: "15",
      },
      {
        name: "Black Negroni",
        description: "gin / bitter orange / coffee",
        price: "15",
      },
      {
        name: "House Red",
        description: "cabernet / merlot / southern France",
        price: "11",
        note: "glass",
      },
      {
        name: "House White",
        description: "chenin blanc / Loire Valley",
        price: "11",
        note: "glass",
      },
    ],
  },
];

const quickLinks = [
  { id: "raw", label: "Raw" },
  { id: "fire", label: "Fire" },
  { id: "pasta", label: "Pasta" },
  { id: "sweet", label: "Sweet" },
  { id: "late", label: "Late" },
  { id: "drinks", label: "Drinks" },
];

function getLondonTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function MenuPage() {
  const [clock, setClock] = useState("--:--");
  const [activeSection, setActiveSection] = useState("raw");
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.logo}>
          VELVET HOUR
        </Link>

        <div className={styles.navCenter}>
          <span>SOHO / LONDON</span>
          <span className={styles.navDivider}>—</span>
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
            src="/images/velvet/hero.jpg"
            alt="Velvet Hour dining room"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className={styles.heroOverlay} />

        <div className={styles.heroTop}>
          <span>01 / THE MENU</span>
          <span>DINNER — LATE</span>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.kicker}>Food / Wine / Music</p>

          <h1>
            The
            <em>Menu</em>
          </h1>

          <div className={styles.heroBottom}>
            <p>
              A menu built for long nights.
              <br />
              No beginning. No fixed ending.
            </p>

            <div className={styles.heroMeta}>
              <span>17:30</span>
              <span>—</span>
              <span>03:30</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.intro}>
        <div className={styles.introNumber}>02</div>

        <div className={styles.introContent}>
          <p className={styles.eyebrow}>THE KITCHEN</p>

          <h2>
            Eat first.
            <br />
            <em>Stay late.</em>
          </h2>

          <div className={styles.introGrid}>
            <p className={styles.introLead}>
              The food changes with the room.
            </p>

            <div className={styles.introBody}>
              <p>
                VELVET HOUR is built around a simple idea: dinner does not need
                to end when the plates are cleared.
              </p>

              <p>
                The menu moves from raw and precise to charred, rich and
                unapologetically late.
              </p>

              <span>Kitchen / London / 2026</span>
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.categoryBar} aria-label="Menu categories">
        <div className={styles.categoryInner}>
          <span className={styles.categoryLabel}>SECTIONS</span>

          <div className={styles.categoryLinks}>
            {quickLinks.map((link, index) => (
              <button
                type="button"
                key={link.id}
                className={
                  activeSection === link.id ? styles.activeCategory : ""
                }
                onClick={() => scrollToSection(link.id)}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className={styles.menuList}>
        {sections.map((section, sectionIndex) => (
          <article
            className={styles.menuSection}
            id={section.id}
            key={section.id}
          >
            <div className={styles.sectionImage}>
              <Image
                src={section.image}
                alt={`${section.title} section`}
                fill
                sizes="(max-width: 760px) 100vw, 42vw"
              />

              <div className={styles.imageOverlay} />

              <div className={styles.imageNumber}>
                {section.number}
              </div>

              <div className={styles.imageCaption}>
                <span>{section.subtitle}</span>
                <span>VELVET HOUR</span>
              </div>
            </div>

            <div className={styles.sectionContent}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionNumber}>
                    {section.number} / 06
                  </span>

                  <h2>{section.title}</h2>
                </div>

                <span className={styles.sectionSubtitle}>
                  {section.subtitle}
                </span>
              </div>

              <div className={styles.items}>
                {section.items.map((item, itemIndex) => (
                  <div className={styles.item} key={item.name}>
                    <div className={styles.itemIndex}>
                      {String(itemIndex + 1).padStart(2, "0")}
                    </div>

                    <div className={styles.itemMain}>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div className={styles.itemPrice}>
                      <span>£{item.price}</span>

                      {item.note && <small>{item.note}</small>}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.sectionFooter}>
                <span>SUBJECT TO SEASONAL CHANGE</span>
                <span>ASK THE ROOM ABOUT OFF-MENU PLATES</span>
              </div>
            </div>

            {sectionIndex !== sections.length - 1 && (
              <div className={styles.sectionBreak}>
                <span>—</span>
                <span>{String(sectionIndex + 3).padStart(2, "0")}</span>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className={styles.statement}>
        <div className={styles.statementTop}>
          <span>07 / AFTER HOURS</span>
          <span>THE KITCHEN DOESN&apos;T SLEEP</span>
        </div>

        <div className={styles.statementText}>
          <p>
            Dinner is
            <br />
            <em>only the beginning.</em>
          </p>
        </div>

        <div className={styles.statementBottom}>
          <p>
            Late food.
            <br />
            Cold drinks.
            <br />
            Loud records.
          </p>

          <Link href="/nights">
            VIEW THE NIGHTS <span>↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.eyebrow}>RESERVATIONS</span>

          <h2>
            Your table
            <br />
            <em>is waiting.</em>
          </h2>
        </div>

        <div className={styles.ctaSide}>
          <p>
            Dinner from 17:30.
            <br />
            The room stays open late.
          </p>

          <Link href="/?reserve=1">
            RESERVE A TABLE <span>→</span>
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
        aria-hidden={!menuOpen}
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

            <button type="button" onClick={() => scrollToSection("raw")}>
              <small>02</small>
              MENU
            </button>

            <Link href="/nights" onClick={() => setMenuOpen(false)}>
              <small>03</small>
              NIGHTS
            </Link>

            <Link href="/?reserve=1" onClick={() => setMenuOpen(false)}>
              <small>04</small>
              RESERVE
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