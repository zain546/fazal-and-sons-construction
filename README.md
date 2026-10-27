# Fazal & Sons Construction Development

A responsive, one-page construction website for Fazal & Sons in Karachi, built with HTML, CSS, and JavaScript.

## Features

- Architectural hero with subtle animations and reduced-motion support
- Services, filterable sample projects, project detail dialogs, and site photography
- Why choose us, Google review, contact information, and footer
- Mobile navigation and click-to-call links
- An enquiry builder with validation, copy fallback, and a link to continue in WhatsApp; visitors choose when to send

## Preview locally

Requires Node.js. From the repository root, run:

```sh
node preview.mjs
```

Open http://127.0.0.1:4173.

## Deploy to Vercel

Import this repository into Vercel and use these settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Repository root |
| Build Command | `node scripts/build.mjs` (configured in `vercel.json`) |
| Output Directory | `build` (configured in `vercel.json`) |

No third-party runtime dependencies are required. The small Node build step copies static files and generates deployment-specific SEO metadata. Add your custom domain in Vercel's domain settings. See `PRODUCTION.md` for launch settings and content that still needs confirmation.

## Updating content

- `dist/index.html`: content, branding, services, contact information, and project cards
- `dist/style.css`: layout, colours, responsive styles, and animations
- `dist/app.js`: navigation, portfolio filtering, project dialogs, and enquiry builder
- `dist/enquiry.mjs`: validated enquiry text and WhatsApp destination
- `dist/production.css`: readability, touch targets, and accessibility refinements
- `dist/assets/`: images and favicon
- `ASSETS.md`: image sources and content provenance

The portfolio names and architecture images are illustrative samples. Replace them with verified project information before using them as a completed-work portfolio. The current logo and service copy are provisional.

## Validate

```sh
node --test tests/production.test.mjs tests/build.test.mjs
node scripts/build.mjs
```

Search indexing stays disabled until launch is explicitly enabled with `ALLOW_INDEXING=true` and a production URL is available. Preview deployments remain noindex.
