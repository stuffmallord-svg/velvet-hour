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

type Category = {
  id: string;
  number: string;
  name: string;
  kicker: string;
  intro: string;
  image: string;
  items: MenuItem[];
};

const categories: Category[] = [
  {
    id: "raw",
    number: "01",
    name: "RAW",
    kicker: "COLD / CLEAN / BRIGHT",
    intro:
      "Cold plates, clean cuts and things that should arrive before the first drink.",
    image: "/images/velvet/gallery-01.jpg",
    items: [
      {
        name: "Beef Tartare",
        description:
          "Hand-cut beef, smoked yolk, caper, toasted sourdough",
        price: "£24",
      },
      {
        name: "Yellowfin Tuna",
        description:
          "Tuna, fermented chilli, sesame, green apple",
        price: "£26",
      },
      {
        name: "Charred Peach",
        description:
          "White peach, stracciatella, basil oil, sea salt",
        price: "£18",
        note: "VEGETARIAN",
      },
      {
        name: "Scallop Crudo",
        description:
          "Scallop, pink grapefruit, jalapeño, olive oil",
        price: "£23",
      },
    ],
  },
  {
    id: "fire",
    number: "02",
    name: "FIRE",
    kicker: "CHAR / SMOKE / HEAT",
    intro:
      "Smoke, charcoal and heat. The center of the table starts here.",
    image: "/images/velvet/after-dark.jpg",
    items: [
      {
        name: "Roasted Sea Bass",
        description:
          "Whole sea bass, burnt lemon, fennel, herb butter",
        price: "£31",
      },
      {
        name: "Dry-Aged Strip",
        description:
          "35-day aged beef, black garlic, pepper jus",
        price: "£39",
        note: "FOR TWO +£12",
      },
      {
        name: "Coal-Roasted Chicken",
        description:
          "Half chicken, smoked yoghurt, charred lemon",
        price: "£28",
      },
      {
        name: "Burnt Cabbage",
        description:
          "Pointed cabbage, tahini, chilli crisp, herbs",
        price: "£17",
        note: "VEGETARIAN",
      },
    ],
  },
  {
    id: "pasta",
    number: "03",
    name: "PASTA",
    kicker: "RICH / LATE / SIMPLE",
    intro:
      "Rich, late and intentionally uncomplicated. Best ordered for the table.",
    image: "/images/velvet/noir.jpg",
    items: [
      {
        name: "Black Garlic Pasta",
        description:
          "Spaghetti, black garlic, parmesan, chilli",
        price: "£22",
      },
      {
        name: "Crab Linguine",
        description:
          "Cornish crab, tomato, lemon, chilli oil",
        price: "£29",
      },
      {
        name: "Wild Mushroom Rigatoni",
        description:
          "Forest mushrooms, pecorino, thyme, brown butter",
        price: "£24",
        note: "VEGETARIAN",
      },
    ],
  },
  {
    id: "sweet",
    number: "04",
    name: "SWEET",
    kicker: "COLD / BURNT / BITTER",
    intro:
      "Dessert, but darker. Something cold, burnt, bitter or all three.",
    image: "/images/velvet/gallery-02.jpg",
    items: [
      {
        name: "Burnt Vanilla",
        description:
          "Vanilla custard, burnt sugar, sea salt",
        price: "£14",
      },
      {
        name: "Dark Chocolate",
        description:
          "70% chocolate, olive oil, cacao nib",
        price: "£13",
      },
      {
        name: "Olive Oil Cake",
        description:
          "Citrus, mascarpone, rosemary sugar",
        price: "£12",
      },
    ],
  },
  {
    id: "late",
    number: "05",
    name: "LATE",
    kicker: "MIDNIGHT / ONE MORE",
    intro:
      "For the hour when dinner is technically over and nobody wants to leave.",
    image: "/images/velvet/velvet.jpg",
    items: [
      {
        name: "Midnight Affogato",
        description:
          "Vanilla gelato, espresso, sea salt",
        price: "£12",
      },
      {
        name: "Truffle Toast",
        description:
          "Sourdough, truffle butter, aged parmesan",
        price: "£16",
      },
      {
        name: "Fries / Aioli",
        description:
          "Crisp potatoes, fermented garlic aioli",
        price: "£9",
      },
      {
        name: "One More Oyster",
        description:
          "Single oyster, mignonette, lemon",
        price: "£4",
      },
    ],
  },
  {
    id: "drinks",
    number: "06",
    name: "DRINKS",
    kicker: "POUR / STIR / SHAKE",
    intro:
      "A short list built for long nights. Ask the room for what isn't written.",
    image: "/images/velvet/hero.jpg",
    items: [
      {
        name: "Velvet Negroni",
        description:
          "Gin, bitter orange, vermouth, house bitters",
        price: "£15",
      },
      {
        name: "Black Manhattan",
        description:
          "Rye, amaro, sweet vermouth, cherry",
        price: "£16",
      },
      {
        name: "House Martini",
        description:
          "Vodka or gin, dry vermouth, olive",
        price: "£17",
      },
      {
        name: "Champagne",
        description:
          "By the glass / ask for the bottle list",
        price: "£18",
      },
    ],
  },
];

const dietaryNotes = [
  "VEGETARIAN OPTIONS",
  "ALLERGIES — PLEASE ASK",
  "SERVICE CHARGE NOT INCLUDED",
];

export default function MenuPage() {
  const [active, setActive] = useState("raw");
  const [clock, setClock] = useState("--:--");

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

    const interval = window.setInterval(updateClock, 30000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.05, 0.2, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (id: string) => {
    setActive(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className={styles.page}>
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          VELVET HOUR
        </Link>

        <div className={styles.headerMeta}>
          <span>LONDON / SOHO</span>
          <span>{clock} GMT</span>
        </div>

        <Link href="/" className={styles.close}>
          <span>BACK TO ROOM</span>
          <b>×</b>
        </Link>
      </header>

      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}

      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src="/images/velvet/hero.jpg"
            alt="VELVET HOUR"
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
          <div className={styles.heroShade} />
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.heroTop}>
            <span>03 / MENU</span>
            <span>DINING / BAR / LATE</span>
          </div>

          <div className={styles.heroCenter}>
            <span className={styles.heroEyebrow}>
              THE KITCHEN
            </span>

            <h1>
              EAT
              <br />
              <em>AFTER DARK.</em>
            </h1>
          </div>

          <div className={styles.heroBottom}>
            <span>FOOD / WINE / MUSIC</span>
            <span>DINNER FROM 17:30</span>
            <span>STAY LATE</span>
          </div>
        </div>

        <div className={styles.heroIndex}>
          <span>VH / 2026</span>
          <span>MENU</span>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* INTRO */}
      {/* -------------------------------------------------- */}

      <section className={styles.intro}>
        <div className={styles.introSide}>
          <span>THE MENU</span>
          <strong>2026</strong>
        </div>

        <div className={styles.introMain}>
          <div className={styles.sectionLabel}>
            <span>FOOD / WINE / MUSIC</span>
            <span>01—06</span>
          </div>

          <h2>
            BUILT FOR
            <br />
            <em>THE WHOLE NIGHT.</em>
          </h2>

          <div className={styles.introBottom}>
            <p>
              The VELVET HOUR menu moves with the room.
              Start light, order something from the fire,
              open another bottle and stay longer than you
              planned.
            </p>

            <div className={styles.introMark}>
              <span>NO FIXED ORDER</span>
              <span>NO RUSH</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* CATEGORY NAV */}
      {/* -------------------------------------------------- */}

      <nav className={styles.categoryNav}>
        <div className={styles.categoryNavInner}>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={
                active === category.id
                  ? styles.navItemActive
                  : styles.navItem
              }
              onClick={() =>
                scrollToCategory(category.id)
              }
            >
              <small>{category.number}</small>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* -------------------------------------------------- */}
      {/* MENU SECTIONS */}
      {/* -------------------------------------------------- */}

      <div className={styles.sections}>
        {categories.map((category, categoryIndex) => (
          <section
            id={category.id}
            className={styles.category}
            key={category.id}
          >
            {/* VISUAL */}
            <div className={styles.visual}>
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
                className={styles.visualImage}
              />

              <div className={styles.visualShade} />

              <div className={styles.visualTop}>
                <span>{category.number}</span>
                <span>{category.kicker}</span>
              </div>

              <div className={styles.visualWord}>
                {category.name}
              </div>

              <div className={styles.visualBottom}>
                <span>VELVET HOUR</span>
                <span>MENU / {category.number}</span>
              </div>
            </div>

            {/* CONTENT */}
            <div className={styles.content}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryMeta}>
                  <span>
                    {category.number} / {category.name}
                  </span>

                  <span>{category.kicker}</span>
                </div>

                <h2>
                  {category.name}
                  <i>.</i>
                </h2>

                <p>{category.intro}</p>
              </div>

              <div className={styles.dishes}>
                {category.items.map((item, index) => (
                  <article
                    className={styles.dish}
                    key={item.name}
                  >
                    <div className={styles.dishIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className={styles.dishInfo}>
                      <div className={styles.dishTitle}>
                        <h3>{item.name}</h3>

                        {item.note && (
                          <span>{item.note}</span>
                        )}
                      </div>

                      <p>{item.description}</p>
                    </div>

                    <strong className={styles.price}>
                      {item.price}
                    </strong>
                  </article>
                ))}
              </div>

              {categoryIndex === categories.length - 1 && (
                <div className={styles.barNote}>
                  <div>
                    <span>ASK THE BAR</span>
                  </div>

                  <p>
                    The written list is only part of the
                    menu. Ask for off-list bottles,
                    cocktails or whatever the room is
                    drinking tonight.
                  </p>
                </div>
              )}

              <div className={styles.categoryFooter}>
                <span>
                  {category.number} / 06
                </span>

                <span>
                  {categoryIndex ===
                  categories.length - 1
                    ? "END OF MENU"
                    : "CONTINUE ↓"}
                </span>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* -------------------------------------------------- */}
      {/* NOTES */}
      {/* -------------------------------------------------- */}

      <section className={styles.notes}>
        <div className={styles.notesTitle}>
          <span>SMALL PRINT</span>
          <strong>BEFORE<br />YOU ORDER.</strong>
        </div>

        <div className={styles.notesGrid}>
          {dietaryNotes.map((note, index) => (
            <div
              className={styles.note}
              key={note}
            >
              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <p>{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* CLOSING */}
      {/* -------------------------------------------------- */}

      <section className={styles.closing}>
        <div className={styles.closingMain}>
          <span>THE HOUSE RULE</span>

          <h2>
            ONE MORE
            <br />
            <em>THING.</em>
          </h2>
        </div>

        <div className={styles.closingCopy}>
          <p>
            There is no perfect order. There is only the
            next thing you want to eat.
          </p>

          <Link
            href="/#reserve"
            className={styles.reserveLink}
          >
            <span>RESERVE A TABLE</span>
            <b>↗</b>
          </Link>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FOOTER */}
      {/* -------------------------------------------------- */}

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <strong>VELVET HOUR</strong>
          <span>DINING / BAR / MUSIC</span>
        </div>

        <div className={styles.footerCenter}>
          <span>LONDON / SOHO</span>
          <span>CONCEPT PROJECT / 2026</span>
        </div>

        <Link
          href="/"
          className={styles.footerBack}
        >
          BACK TO THE ROOM
          <b>↑</b>
        </Link>
      </footer>
    </main>
  );
}