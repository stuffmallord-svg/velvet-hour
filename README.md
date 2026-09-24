# VELVET HOUR

### A late-night dining room, bar & music space.

**Velvet Hour** is a concept restaurant website built as a full-stack digital experience for a fictional late-night venue in Soho, London.

The project combines an editorial visual identity with a functional reservation system, availability checking, admin dashboard and automated guest confirmation emails.

**Concept / Design / Development:** MALLORD / DIGITAL STUDIO
**Year:** 2026
**Location:** Soho / London

---

## LIVE

**Website:** https://velvet-hour-five.vercel.app

---

## THE CONCEPT

Velvet Hour is designed around the idea of a venue that changes throughout the night.

The experience moves through five different states:

* **12 DAY** — Lunch / Coffee / Slow Hours
* **18 DINNER** — Food / Wine / First Drink
* **22 VELVET** — Bar / Music / Social
* **00 AFTER DARK** — DJs / Live / Dancefloor
* **03 LAST CALL** — Late Nights / One More

The website follows the same idea through typography, motion, imagery, navigation and changing visual hierarchy.

---

## FEATURES

### Guest Experience

* Editorial landing page
* Responsive mobile experience
* Interactive fullscreen navigation
* Restaurant menu
* Upcoming nights & events
* Private dining page
* Gift cards
* The Velvet List
* Reservation flow
* Reservation confirmation state
* Dynamic London time
* Smooth transitions and micro-interactions

### Reservation System

Guests can:

* Select a date
* Select a time
* Choose party size
* Add contact information
* Add an occasion
* Submit a reservation

The reservation is processed through the backend and stored in Supabase.

### Admin Dashboard

The project includes a dedicated admin interface for managing reservations.

Administrators can:

* View incoming reservations
* Review guest information
* See reservation date and time
* Confirm reservations
* Cancel reservations
* Manage reservation status

### Email Confirmation

When a reservation is confirmed, the system can automatically send a confirmation email to the guest through Resend.

The email includes:

* Guest name
* Reservation date
* Reservation time
* Number of guests
* Occasion

---

## TECH STACK

### Frontend

* Next.js
* React
* TypeScript
* CSS
* Next Image
* Responsive design

### Backend

* Next.js API Routes
* Supabase
* PostgreSQL
* Server-side validation
* Reservation availability logic

### Email

* Resend

### Deployment

* Vercel
* GitHub

---

## ARCHITECTURE

```text
Guest
  │
  ▼
Next.js Frontend
  │
  ▼
Reservation API
  │
  ▼
Supabase
  │
  ├── Reservations
  ├── Availability
  └── Reservation Status
          │
          ▼
     Admin Dashboard
          │
          ▼
   Confirm Reservation
          │
          ▼
        Resend
          │
          ▼
     Guest Confirmation
```

---

## ROUTES

### Public

```text
/
 /menu
 /nights
 /private-dining
 /reservations
 /gift-cards
 /the-velvet-list
```

### Admin

```text
/admin
/admin/login
```

### API

```text
/api/reservations
/api/availability
/api/admin/reservations
/api/admin/reservations/[id]
```

---

## PROJECT STRUCTURE

```text
velvet-hour/
├── src/
│   └── app/
│       ├── admin/
│       ├── gift-cards/
│       ├── menu/
│       ├── nights/
│       ├── private-dining/
│       ├── reservations/
│       ├── the-velvet-list/
│       ├── api/
│       │   ├── admin/
│       │   ├── availability/
│       │   └── reservations/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
│   └── images/
├── package.json
└── README.md
```

---

## DESIGN DIRECTION

The visual language is intentionally minimal, dark and editorial.

The interface uses:

* Oversized typography
* Monospaced metadata
* High-contrast imagery
* Deep black backgrounds
* Subtle red accents
* Large editorial spacing
* Fullscreen navigation
* Motion-driven interactions
* Mobile-first responsive adjustments

The goal was to make the website feel closer to a digital fashion/editorial experience than a conventional restaurant website.

---

## RESPONSIVE EXPERIENCE

The website was designed for both desktop and mobile.

Mobile layouts were specifically adapted for:

* Hero composition
* Large typography
* Menu item hierarchy
* Event cards
* Gallery layouts
* Reservation forms
* Fullscreen navigation
* Modal interactions
* Footer structure

---

## DEVELOPMENT

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
.env.local
```

Add the required environment variables for Supabase and Resend.

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## BUILD

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---

## STATUS

**Completed — 2026**

Velvet Hour is a concept project created by **MALLORD / DIGITAL STUDIO** to demonstrate a complete restaurant web experience, including visual design, responsive frontend development, backend functionality and reservation management.

---

## CREDITS

**MALLORD / DIGITAL STUDIO**

Digital experiences, creative development & web design.

**VELVET HOUR**
Concept restaurant / London
2026
