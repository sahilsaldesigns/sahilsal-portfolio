# Sahil Salekar — Portfolio

Personal portfolio website for **Sahil Salekar**, a UI/UX Designer currently at [Media.net](https://www.media.net), Mumbai. Sahil specialises in designing UI for ad tech and digital products — from design systems to consumer-facing interfaces.

Live site: [sahilsal.com](https://sahilsal.com)

---

## Purpose

This site serves as Sahil's design portfolio — showcasing selected case studies, a photography section, and a way for people to get in touch or view his resume. It is designed to reflect his visual sensibility directly through the experience of using the site.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript + JavaScript (JSX) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animation | [Framer Motion](https://www.framer-motion.com) + [GSAP](https://gsap.com) (with ScrollTrigger) |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering) |
| CMS | [TinaCMS](https://tina.io) (Git-backed, TinaCloud) |
| Icons | [react-icons](https://react-icons.github.io/react-icons) |
| Fonts | Lustria + Plus Jakarta Sans (Google Fonts via `next/font`) |
| Deployment | [Vercel](https://vercel.com) |

---

## Setup

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- A TinaCloud account (for CMS auth in production) — optional for local dev

### Install

```bash
pnpm install
```

### Run locally (with TinaCMS dev server)

```bash
pnpm dev
```

This starts both the TinaCMS content server (port 4001) and Next.js dev server (port 3000) concurrently. The CMS admin is available at [localhost:3000/admin](http://localhost:3000/admin).

### Build for production

```bash
pnpm build
```

### Build locally (skip TinaCloud checks)

Useful when you don't have TinaCloud credentials set up:

```bash
pnpm build-local
```

### Clean generated files

```bash
pnpm clean
```

Removes `node_modules`, `.next`, and `tina/__generated__`.

### Environment variables

Create a `.env.local` file at the root:

```env
NEXT_PUBLIC_TINA_CLIENT_ID=your_tina_client_id
TINA_TOKEN=your_tina_token
NEXT_PUBLIC_TINA_BRANCH=main
```

These are only required for TinaCloud-connected builds. Local content editing works without them.

---

## Project Structure

```
sahilsal-portfolio/
├── app/
│   ├── (main)/                  # Route group for main pages
│   │   ├── [...filename]/       # Catch-all: renders TinaCMS "page" content
│   │   ├── case-studies/[slug]/ # Case study detail pages
│   │   └── photography/         # Photography / photo stack page
│   ├── components/
│   │   ├── layout/              # Header, Footer, MobileMenu, ActiveNav, Container
│   │   ├── ui/                  # CardSlider, PhotoStack, AboutHero, SocialLinks, etc.
│   │   ├── icons/               # Custom SVG icon components
│   │   └── utils/               # LinkPreview and other utilities
│   ├── providers/               # IntroProvider (controls intro animation phase)
│   ├── layout.tsx               # Root layout — fonts, metadata, JSON-LD, Header/Footer
│   ├── page.tsx                 # Homepage
│   └── sitemap.ts               # Auto-generated sitemap
├── content/
│   ├── global/                  # global.json — nav, logo, footer config
│   ├── page/                    # MDX content files for each page (about.mdx, etc.)
│   └── case-studies/            # MDX content for each case study
├── styles/
│   └── globals.css              # Global styles, Tailwind base, intro animation keyframes
├── tina/                        # TinaCMS schema and generated client
├── public/
│   └── uploads/                 # Images, videos, SVGs, PDF resume
└── next.config.js               # Security headers (CSP), image domains
```

### Key concepts

- **TinaCMS catch-all route** — `app/(main)/[...filename]/page.tsx` handles all CMS-managed pages (like `/about`). At build time, `generateStaticParams` pre-renders these as static HTML. This takes priority over any same-path `page.tsx` in production.
- **IntroProvider** — manages the splash screen animation phases (`intro → lines → done`). Child components use `useIntro()` to delay their own entrance until the intro finishes. The splash screen logo animation itself (`PageIntro.tsx`) is driven by GSAP — throw-in, breathing loop, and exit slide.
- **Animation split** — Framer Motion handles component-level and state-driven animations (CardSlider, AboutHero). GSAP handles cases that need scroll-linked or precisely sequenced timelines: the photo stack scroll animation (ScrollTrigger + scrub) and the intro splash. Lenis is synced to ScrollTrigger via `useLenis(ScrollTrigger.update)`.
- **Tina Blocks** — the CMS exposes UI components as "blocks" so editors can compose pages from the admin UI without touching code. Available blocks: `card_slider` and `photo_stack`. New blocks must be registered in `tina/collections/page.js` and mapped in `app/components/layout/BlockRenderer.tsx`.
- **Content is Git-backed** — all page and case study content lives in the `content/` directory as MDX files. TinaCloud provides the visual editing UI on top of these files.

---

## Future Improvements (Optional)

- **More case studies** — the card slider already supports multiple cards; adding new ones only requires a new MDX file and image.
- **Dark mode** — the design system is single-theme today; Tailwind's `dark:` variants could be layered in.
- **Richer case study layouts** — more MDX block components (image grids, side-by-side comparisons, callout blocks) to support complex storytelling inside case studies.
- **Page transitions** — Framer Motion `AnimatePresence` on route changes for smoother navigation between pages.
- **Photography performance** — the photo stack loads all images upfront; lazy loading or pagination could improve initial load on slow connections.
- **Search / filtering** — if the case study count grows, a tag or category filter on the work page would help visitors navigate.
