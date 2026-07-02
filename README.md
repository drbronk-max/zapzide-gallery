# GM Gallery

A view-only nostr client that shows [dergigi](https://njump.me/npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc)'s GM posts that contain an image, in a masonry gallery. Lives at [gm.dergigi.com](https://gm.dergigi.com).

Built with [applesauce](https://applesauce.build/), React, Vite and TypeScript.

## How it works

- Notes are loaded by author from `relay.dergigi.com` and `wot.dergigi.com` (the outbox relay holds all of them, so no NIP-50 search is needed).
- Filtering happens client-side: a note shows up if it mentions `gm` as a word and links at least one image.
- Image URLs are extracted with `applesauce-content` and rendered in a CSS-columns masonry that collapses to a single column on mobile.

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the unit tests
npm run build    # production build into dist/
```

## Configuration

Author, relays and fetch limit live in [`src/config.ts`](src/config.ts). The filter term and page metadata are set via env vars (see [`.env`](.env) for the GM defaults):

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_FILTER_TERM` | Word a note must contain to show up | `gm` |
| `VITE_SITE_TITLE` | Browser tab and OG title | `GM - Good mornings from dergigi` |
| `VITE_SITE_DESCRIPTION` | Meta and OG description | `A gallery of dergigi's GM posts on nostr.` |
| `VITE_SITE_URL` | Canonical and OG url | `https://gm.dergigi.com` |

## Deployment (Vercel)

Vercel auto-detects Vite. Build command `npm run build`, output directory `dist`. It is a single-page app, so no rewrite config is needed.

Deploy the same repo twice, one project per domain, differing only in env vars:

- `gm.dergigi.com`: uses the committed `.env` defaults (no overrides needed).
- `gn.dergigi.com`: set these in the Vercel project's environment variables:

```
VITE_FILTER_TERM=gn
VITE_SITE_TITLE=GN - Good nights from dergigi
VITE_SITE_DESCRIPTION=A gallery of dergigi's GN posts on nostr.
VITE_SITE_URL=https://gn.dergigi.com
```

Then add the matching custom domain in each project's settings.
