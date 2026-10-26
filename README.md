# Fazal & Sons Construction Development

A responsive, one-page construction website for Fazal & Sons in Karachi, built with HTML, CSS, and JavaScript.

## Features

- Architectural hero with subtle animations and reduced-motion support
- Services, filterable sample projects, project detail dialogs, and site photography
- Why choose us, Google review, contact information, and footer
- Mobile navigation and click-to-call links
- A local enquiry builder that prepares a copyable project brief; it does not send or store enquiries

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
| Build Command | Empty (override the default) |
| Output Directory | `dist` |

No dependencies or build step are required. Add a custom domain in the Vercel project's domain settings and follow its DNS instructions.

## Updating content

- `dist/index.html`: content, branding, services, contact information, and project cards
- `dist/style.css`: layout, colours, responsive styles, and animations
- `dist/app.js`: navigation, portfolio filtering, project dialogs, and enquiry builder
- `dist/assets/`: images and favicon
- `ASSETS.md`: image sources and content provenance

The portfolio names and architecture images are illustrative samples. Replace them with verified project information before using them as a completed-work portfolio. The current logo and service copy are provisional.
