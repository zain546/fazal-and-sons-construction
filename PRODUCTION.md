# Production readiness

## Deployment setup (Netlify & Vercel)

Import the repository with its root directory unchanged. 
- For **Netlify**: `netlify.toml` sets the build command (`node scripts/build.mjs`), publish directory (`build`), Node 20 runtime, and production security headers.
- For **Vercel**: `vercel.json` provides equivalent configuration.

Set these environment variables on your host:

- `SITE_URL`: the final HTTPS origin, for example `https://your-domain.com`. Use the real domain; no path or trailing query. This generates canonical and social-image URLs. If omitted, the build falls back to `VERCEL_PROJECT_PRODUCTION_URL` or Netlify's `URL`.
- `ALLOW_INDEXING=true`: enable only for the finished public site. Until then, pages carry `noindex,follow` and the sitemap contains no listed pages. Preview and branch deployments automatically remain noindex, even when this variable is enabled.

The source has no fake canonical domain. `build/` is generated and ignored by Git. Deployment metadata changes happen during the build, not in browser JavaScript.

## Content still needed before public launch

The owner authorized sample content for this first version. The following remain deliberate placeholders, not verified business claims:

- Replace or approve the provisional logo and service copy.
- Replace the three clearly labelled inspiration projects with genuine project details and photographs, or retain the inspiration labels.
- Confirm that the business number `+92 300 3732847` receives WhatsApp messages. It is the verified Google phone number, but its WhatsApp availability has not been verified. The WhatsApp destination is defined in `dist/enquiry.mjs`; call links and visible phone copy are in `dist/index.html`.
- Set the actual custom domain before enabling indexing. Refresh the Google review count when launching.

## Enquiries and privacy

The form validates required fields and prepares the enquiry locally. Continuing on WhatsApp passes the prepared text to WhatsApp only when the visitor follows that link. The visitor still chooses whether to send it. No enquiry is automatically submitted, stored in a database, or persisted in local storage. Call and copy alternatives remain available.

## Google Ads and analytics configuration

The Google tag (`gtag.js`) is pre-installed in `<head>` in `dist/index.html`. When ready to run Google Ads campaigns:

1. In `dist/index.html`, replace `AW-XXXXXXXXX` with your friend's actual Google Ads Conversion ID (e.g. `AW-11500000000`).
2. Event hooks in `dist/app.js` will automatically record conversions for:
   - `contact_whatsapp_chat`: When visitors click to chat on WhatsApp.
   - `contact_phone_call`: When visitors click any phone call link.
   - `generate_lead`: When visitors prepare a project brief via the form.
3. If changing the inline script, update the corresponding `sha256-...` hash in `vercel.json` if strict CSP script hashing is retained.

## Checks completed during implementation

See `outputs/production-review.md` for the current local verification results. The automated checks cover whitespace validation, service validation, Unicode and punctuation in the outgoing message, input bounds, deployment indexing rules, and the structured-data CSP hash.

Local checks do not verify live DNS, Vercel response headers, indexing, message delivery, or business ownership of a WhatsApp account. Check those on the final deployment.
