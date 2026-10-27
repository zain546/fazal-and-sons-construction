# Production readiness

## Vercel setup

Import the repository with its root directory unchanged. `vercel.json` sets the build command and the `build` output directory. It also applies content security, framing, MIME, referrer, permissions, and asset cache headers.

Set these environment variables in Vercel:

- `SITE_URL`: the final HTTPS origin, for example `https://your-domain.com`. Use the real domain; no path or trailing query. This generates canonical and social-image URLs. If omitted, the build uses `VERCEL_PROJECT_PRODUCTION_URL` when Vercel supplies it.
- `ALLOW_INDEXING=true`: enable only for the finished public site. Until then, pages carry `noindex,follow` and the sitemap contains no listed pages. Preview deployments always remain noindex, even when this variable is enabled.

The source has no fake canonical domain. `build/` is generated and ignored by Git. Deployment metadata changes happen during the build, not in browser JavaScript.

## Content still needed before public launch

The owner authorized sample content for this first version. The following remain deliberate placeholders, not verified business claims:

- Replace or approve the provisional logo and service copy.
- Replace the three clearly labelled inspiration projects with genuine project details and photographs, or retain the inspiration labels.
- Confirm that the business number `+92 300 3732847` receives WhatsApp messages. It is the verified Google phone number, but its WhatsApp availability has not been verified. The WhatsApp destination is defined in `dist/enquiry.mjs`; call links and visible phone copy are in `dist/index.html`.
- Set the actual custom domain before enabling indexing. Refresh the Google review count when launching.

## Enquiries and privacy

The form validates required fields and prepares the enquiry locally. Continuing on WhatsApp passes the prepared text to WhatsApp only when the visitor follows that link. The visitor still chooses whether to send it. No enquiry is automatically submitted, stored in a database, or persisted in local storage. Call and copy alternatives remain available.

## Checks completed during implementation

See `outputs/production-review.md` for the current local verification results. The automated checks cover whitespace validation, service validation, Unicode and punctuation in the outgoing message, input bounds, deployment indexing rules, and the structured-data CSP hash.

Local checks do not verify live DNS, Vercel response headers, indexing, message delivery, or business ownership of a WhatsApp account. Check those on the final deployment.
