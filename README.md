# VELVET HOUR

### Late-night dining. Music. Atmosphere.

VELVET HOUR is a fictional London nightlife concept built as a full digital experience rather than a traditional restaurant website.

The concept combines a late-night dining room, cocktail bar and music venue into one space that changes character throughout the night.

**12:00 — LUNCH**  
**18:00 — DINNER**  
**22:00 — VELVET**  
**00:00 — AFTER DARK**  
**03:00 — LAST CALL**

---

## Live

**Website:**  
https://velvet-hour-five.vercel.app

**Repository:**  
https://github.com/stuffmallord-svg/velvet-hour

---

## About

VELVET HOUR was designed around a simple idea:

> The night should feel different depending on what time you arrive.

Instead of treating the website as a collection of restaurant pages, the experience is structured around the progression of a night.

The visual language combines editorial typography, dark photography, red atmospheric accents and oversized type with a restrained information architecture.

The result is intentionally closer to a fashion, hospitality or nightlife brand than a conventional restaurant template.

---

## Experience

### ONE ROOM. FIVE STATES.

The homepage introduces five different states of the venue:

| Time | State | Atmosphere |
| --- | --- | --- |
| 12:00 | Lunch | Slow hours |
| 18:00 | Dinner | Food & wine |
| 22:00 | Velvet | Bar & music |
| 00:00 | After Dark | DJs & dancefloor |
| 03:00 | Last Call | Late nights |

The active state is determined by London time.

This creates a small but important connection between the digital experience and the fictional physical venue.

---

## Pages

### `/`

The main experience.

Includes:

- Full-screen hero
- London time
- Dynamic venue state
- Brand introduction
- Five-state timeline
- Menu preview
- Upcoming nights
- Manifesto section
- Editorial image gallery
- Reservation CTA
- Full-screen navigation
- Reservation modal

---

### `/menu`

A dedicated editorial menu experience.

Includes:

- Raw
- Fire
- Pasta
- Sweet
- Late
- Drinks

Each section is designed as part of the same visual system instead of feeling like a separate template page.

---

### `/nights`

The events section.

Designed around nightlife rather than a generic events listing.

Includes:

- Featured night
- Event schedule
- Event details
- Visual storytelling
- Reservation CTA

---

## Design Direction

VELVET HOUR intentionally avoids the usual luxury restaurant visual language.

No marble.

No gold.

No oversized wine bottles.

No generic five-star restaurant aesthetic.

Instead, the direction is based on:

- Editorial typography
- High-contrast serif headlines
- Monospace interface typography
- Dark photography
- Deep red accents
- Large negative space
- Asymmetrical layouts
- Nightclub-inspired interaction
- Fashion/editorial art direction

The interface is designed to feel quiet during the day and increasingly atmospheric as the night progresses.

---

## Interaction

The website includes several small interactions designed to make the experience feel more physical:

- London-based live clock
- Dynamic night-state logic
- Full-screen navigation
- Reservation modal
- Image hover transitions
- Editorial menu interactions
- Smooth section transitions
- Responsive layouts
- Reduced-motion support
- Keyboard focus states

The goal is not to overload the interface with animation.

Every interaction exists to reinforce the atmosphere of the brand.

---

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- App Router
- CSS
- CSS Modules

### Typography

- Bodoni Moda
- Inter
- DM Mono

### Deployment

- Vercel

---

## Project Structure

```text
velvet-hour/
├── public/
│   └── images/
│       └── velvet/
│           ├── hero.jpg
│           ├── velvet.jpg
│           ├── after-dark.jpg
│           ├── noir.jpg
│           ├── gallery-01.jpg
│           └── gallery-02.jpg
│
├── src/
│   └── app/
│       ├── menu/
│       │   ├── page.tsx
│       │   └── menu.module.css
│       │
│       ├── nights/
│       │   ├── page.tsx
│       │   └── nights.module.css
│       │
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md