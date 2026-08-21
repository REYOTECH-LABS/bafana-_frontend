# Frontend - Bafana At Law Website

React client for the Bafana At Law Website Management System. This document
covers the architecture, how data reaches the screen, the conventions to follow
when adding to it, and how to run and test the application.

**Last updated:** August 16, 2026

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [How Data Reaches the Screen](#how-data-reaches-the-screen)
6. [Loading, Empty, and Error States](#loading-empty-and-error-states)
7. [Pages](#pages)
8. [Shared Components](#shared-components)
9. [Motion](#motion)
10. [Images](#images)
11. [The Office Map](#the-office-map)
12. [Styling Conventions](#styling-conventions)
13. [Testing Checklist](#testing-checklist)
14. [Known Limitations](#known-limitations)

## Overview

The frontend renders eight public pages: Home, About, Practice Areas, Lawyers,
Testimonials, Blog, Contact, and Book Appointment.

All content comes from the backend API. The static modules under `src/data/`
exist only as an offline fallback for marketing pages, never as the source of
truth. Adding a practice area or a lawyer in the database changes the site with
no code change and no redeploy.

There is no admin interface yet. Content is currently created through the
backend's seed scripts.

## Technology Stack

| Concern | Choice |
|---|---|
| Framework | React 19.2 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| HTTP | axios 1.19 |
| Animation | Framer Motion 12 |
| Icons | react-icons 5 (Font Awesome set) |
| Maps | Leaflet 1.9 with react-leaflet 5 |

The project is written in plain JavaScript and JSX. There is no TypeScript and
no type-check step.

## Project Structure

```
src/frontend/
├── images/                     Bundled design assets (logo, hero art)
├── src/
│   ├── animations/             Framer Motion variants and the Reveal wrapper
│   ├── components/
│   │   ├── common/             Reusable primitives: Button, SectionHeading,
│   │   │                       Image, States, Field, LocationMap
│   │   ├── Navbar/ Footer/     Site chrome, rendered once by MainLayout
│   │   └── <Feature>/          Section components grouped by feature
│   ├── data/                   Static fallback content and site constants
│   ├── hooks/                  useApi
│   ├── layouts/                MainLayout: navbar, page transition, footer
│   ├── lib/                    iconRegistry
│   ├── pages/                  One directory per route
│   ├── routes/                 AppRoutes
│   ├── services/               api, adapters, resources
│   └── styles/                 globals.css and Tailwind layers
└── PROJECT.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A running backend on `http://localhost:5000` (see `src/backend/README.md`)

### Installation

```bash
cd src/frontend
npm install
cp .env.example .env
npm run dev
```

### Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api/v1` |

Only variables prefixed with `VITE_` are exposed to the browser. **Never put
database credentials, API secrets, or Cloudinary keys in this file.** Everything
here is readable by anyone who visits the site.

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

### A note on ports

Vite is configured with `strictPort: false`, so if port 3000 is occupied it
starts on another port without failing. The backend's `CORS_ORIGIN` allows ports
3000, 3001, and 5173. If API requests fail with a CORS error in development,
check which port Vite actually bound to and confirm it is in that list.

## How Data Reaches the Screen

Every request follows the same path. Understanding this chain is most of what is
needed to add a new page.

```
Page component
    calls useApi(() => getSomething())
        which calls a function in services/resources.js
            which uses the axios instance in services/api.js
                which reaches the backend
            response passes through services/adapters.js
        useApi returns { data, loading, error, isEmpty, refetch }
    page renders the appropriate state
```

### services/api.js

The single axios instance. Two interceptors do work that would otherwise be
repeated everywhere:

- **Request:** attaches the bearer token when one exists, and removes the JSON
  content-type header for `FormData` so the browser can set the multipart
  boundary itself.
- **Response:** unwraps the backend's envelope. The API always answers with
  `{ success, statusCode, message, data, pagination? }`, so callers receive
  `data` directly rather than reaching into it.

Errors are normalised into one shape by `normaliseError`, collapsing the three
failure modes (a structured API error, a network failure, an unexpected
exception) so UI code never branches on axios internals. `isNetworkError`
distinguishes "the server is unreachable" from "the server said no", because the
two deserve different wording.

### services/adapters.js

Backend field names to frontend field names, in one file.

The static data modules were written before the API existed, so their names
diverged from the Mongoose models. Rather than renaming backend fields and
churning a documented, tested contract, every translation happens here:

| Backend | Frontend | Model |
|---|---|---|
| `_id` | `id` | all |
| `fullName` | `name` | Lawyer |
| `yearsOfExperience` | `yearsExperience` | Lawyer |
| `name` | `title` | PracticeArea |
| `clientName` | `name` | Testimonial |

If a component reads a field the API does not return, the fix belongs here, not
in the component.

### services/resources.js

One function per API operation. Components and hooks call these; nothing else
imports `api` directly. Every URL and query parameter lives in this one file, so
an endpoint change is a single-line edit.

Note that `getPracticeAreas` and `getActivePracticeAreas` are different:
the first returns every record including deactivated ones, the second only what
the firm is currently advertising. Public pages use the second.

### hooks/useApi.js

```js
const { data, loading, error, isEmpty, refetch } = useApi(
  () => getLawyers(),
  [],
  { fallback: staticLawyers }
);
```

`fallback` is what `data` holds before the first response and after a failure.
`enabled: false` defers a request that depends on something the user has not
chosen yet. A request-id guard prevents a slow earlier response from overwriting
a faster later one when dependencies change quickly.

The second argument is a dependency array. The request function itself is
deliberately excluded from the internal dependencies, because callers pass an
inline arrow function that is a new reference on every render and would loop
forever.

## Loading, Empty, and Error States

Four components in `components/common/States.jsx` keep this consistent across
pages. Pages differ in what they fetch, not in how they report progress.

| Component | When to use |
|---|---|
| `LoadingState` | While a request is in flight. Renders skeletons that mirror the real card dimensions so content does not jump when data lands. Pass `media` for image-topped cards |
| `EmptyState` | The request succeeded but there is genuinely nothing to show |
| `ErrorState` | The request failed and there is no fallback content to display |
| `StaleDataNotice` | The request failed but fallback content is being shown. A non-blocking banner rather than a full-page error |

The distinction between the last two matters. Marketing pages with a static
fallback show `StaleDataNotice` and remain useful. Pages where fabricated
content would be misleading, such as Practice Areas, carry no fallback at all
and show `ErrorState` instead.

## Pages

| Route | Data source | Fallback |
|---|---|---|
| `/` | Announcements, practice areas, lawyers, testimonials | Static |
| `/about` | Static copy plus the office location section | Not applicable |
| `/practice-areas` | `GET /practice-area/active` | **None, by design** |
| `/lawyers` | `GET /lawyer` | Static |
| `/testimonials` | `GET /testimonial` | Static |
| `/blog`, `/blog/:slug` | `GET /post`, `GET /post/slug/:slug` | None |
| `/contact` | `POST /contact`, plus the office location section | Not applicable |
| `/book-appointment` | `POST /appointment`, lawyer and practice-area lookups | None |

### Practice Areas

Built to the approved prototype: a two-column introduction, a centred section
heading, a responsive card grid, and a booking prompt.

The page holds no practice-area content. It renders whatever
`GET /practice-area/active` returns, in the order the API supplies, which the
backend already sorts by `displayOrder`. Adding a practice area in the database
adds a card with no code change.

Cards read `imageUrl` for the header photograph. Until an image is uploaded,
each card shows a placeholder built from the practice area's own icon, sized to
the exact `16:10` band a photograph will occupy so nothing reflows when one is
added. If a stored URL fails to load, the card falls back to the same
placeholder rather than showing a broken image.

The grid is one column on mobile, two at tablet, and three on desktop. Three
keeps each card close to the width the prototype draws; two would stretch them
roughly 45 percent wider and flatten the image band.

## Shared Components

| Component | Purpose |
|---|---|
| `Button` | Primary, secondary, and light variants in three sizes. Owns its hover and tap motion |
| `SectionHeading` | The eyebrow, rule, title, and description pattern every section opens with |
| `Image` | Renders an image, falling back to `ImagePlaceholder` when the source is missing or fails |
| `Field` | Labelled form control wired for accessibility, with `aria-invalid` and `aria-describedby` |
| `LocationMap` | Interactive OpenStreetMap panel |
| `Reveal` | Scroll-reveal wrapper that keeps `whileInView` boilerplate out of section components |

`lib/iconRegistry.js` maps icon names to components. The API stores an icon
*key* as a string, while static modules hold a component directly. `resolveIcon`
accepts either, so a component can take an `icon` prop without knowing where its
data came from. An unknown key resolves to a fallback rather than blanking the
card.

## Motion

Framer Motion, applied with restraint. Motion should guide attention, not
compete with the content.

- Variants live in `animations/variants.js`. Use them rather than writing new
  inline animations, so timing stays consistent
- `MotionConfig reducedMotion="user"` in `App.jsx` honours the operating
  system's reduced-motion preference globally
- Scroll reveals use `once: true`; content should not re-animate on every pass
- Animate transforms and opacity only. Avoid animating layout properties

Two traps worth knowing:

1. **Do not put `transition-all` on a element Framer animates.** The browser
   will interpolate the same transform Framer is driving, and the two fight.
2. **Do not mount a Leaflet map inside a scaling animation.** Leaflet measures
   its container once at startup and will render grey tiles. Use a plain fade.

## Images

Design assets live in `src/frontend/images/` and are imported directly by the
components that use them, so Vite fingerprints and bundles them:

| File | Used by |
|---|---|
| `bafana_logo.jpeg` | Navbar |
| `lady_justice.png` | Home hero, Practice Areas hero |
| `background-hero.png` | Home hero background |
| `law_office.png` | About page and home About section |

These are part of the design and are correctly bundled rather than uploaded.
Content images, such as lawyer photographs and blog covers, are different: they
are uploaded through the backend to Cloudinary, and the API returns a URL the
frontend simply renders.

## The Office Map

`components/common/LocationMap.jsx` renders an interactive OpenStreetMap panel
using Leaflet. It requires no API key and no account. It is shared by both the
About and Contact pages.

Coordinates live in `src/data/contactInfo.js` as `officeCoordinates`.

**The current coordinates are approximate.** OpenStreetMap has no record of
"Oxford House, SDA Junction", so the value is the Adenta locality centre rather
than the building. To correct it, right-click the office in Google Maps, copy
the latitude and longitude, and replace the two numbers. Nothing else needs to
change; the map centre, the marker, and every directions link read from that one
constant.

Implementation notes worth preserving if this is ever modified:

- The marker is a `divIcon` drawn in markup, not Leaflet's default pin. Leaflet's
  stock marker is a PNG resolved by a relative path that bundlers rewrite, which
  is the cause of the familiar broken-marker icon
- The map wrapper carries `isolate`. Leaflet gives its zoom controls a z-index
  of 1000, which would otherwise float over the sticky navbar
- Scroll-wheel zoom is disabled so that scrolling the page over the map does not
  trap the scroll. Buttons, dragging, and pinch zoom all still work
- The OpenStreetMap attribution is a licence requirement and must remain visible

## Styling Conventions

- **Tailwind utilities in markup.** Reusable patterns belong in the `components`
  layer of `globals.css`: `container-custom`, `section-padding`, `btn-primary`
- **Opacity modifiers must be multiples of 5.** Tailwind's default opacity scale
  steps by 5, and an off-scale value such as `bg-white/96` silently compiles to
  nothing. The colour simply disappears, with no build-time warning
- **Typography:** Playfair Display for headings, Inter for body text. Both are
  configured in `tailwind.config.js`
- **Palette:** black, white, and a neutral grey scale. Avoid introducing colour
- Prefer relative units and `max-width: 100%`. Wide content such as tables and
  code blocks should scroll inside its own container; the page body must never
  scroll horizontally

## Testing Checklist

### Setup

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts and the terminal shows the bound port
- [ ] The backend is running and `npm run db:check` reports the expected database

### Data flow

- [ ] Practice Areas shows six cards matching the database
- [ ] Lawyers, Testimonials, and Blog render records from the API
- [ ] Adding a record in the database makes it appear after a page refresh, with
      no code change
- [ ] Stopping the backend leaves marketing pages readable with the
      "Showing saved information" notice
- [ ] Practice Areas shows a clear error rather than fabricated content when the
      backend is unreachable

### Forms

- [ ] Contact form submits and confirms success
- [ ] Appointment form populates its lawyer and practice-area selects from the API
- [ ] Validation errors from the backend appear against the correct fields
- [ ] Submitting twice quickly does not create duplicates

### Responsive

Test at 390 px, 768 px, and 1440 px:

- [ ] No horizontal scrolling on any page
- [ ] Navigation collapses to the mobile menu and opens and closes correctly
- [ ] Practice-area cards stack one, two, then three across
- [ ] Images keep their proportions and are never stretched
- [ ] The map stays inside its rounded container

### Accessibility

- [ ] Every page has exactly one `<h1>`
- [ ] All interactive elements are reachable and operable by keyboard
- [ ] Focus is visible throughout
- [ ] Images carry meaningful `alt` text, and decorative images are hidden from
      assistive technology
- [ ] The address is available as text, not only inside the map

### Build

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` serves a working site

## Known Limitations

1. **Office coordinates are approximate.** See [The Office Map](#the-office-map).
2. **Image sizes.** `law_office.png` is 2.37 MB and `lady_justice.png` is
   1.09 MB. Converting these to WebP would substantially reduce the payload.
3. **Bundle size.** The production JavaScript bundle is roughly 680 KB before
   compression, above Vite's 500 KB warning threshold. Route-level code
   splitting would address this.
4. **One outstanding lint error.** `hooks/useApi.js` disables
   `react-hooks/exhaustive-deps`, but the plugin defining that rule is not
   installed. Installing `eslint-plugin-react-hooks` resolves it.
5. **No admin interface.** Content is created through the backend's seed
   scripts. Building the admin frontend is the next major piece of work.
6. **No automated frontend tests.** Verification is currently manual, supported
   by scripted browser checks at the three breakpoints above.
