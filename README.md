# GM Gallery

A view-only nostr client that shows [dergigi](https://njump.to/npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc)'s GM posts that contain an image, in a masonry gallery. Lives at [gm.dergigi.com](https://gm.dergigi.com).

Built with [applesauce](https://applesauce.build/), React, Vite and TypeScript.

## Viewing other users

Add a user to the path to see their gallery instead of the default:

- `gm.dergigi.com/` shows the default user (dergigi).
- `gm.dergigi.com/npub1...` or `gm.dergigi.com/nprofile1...` by NIP-19 identifier.
- `gm.dergigi.com/name@domain` or `gm.dergigi.com/domain` by NIP-05 address (a bare domain resolves to `_@domain`).

Their relays are discovered from their NIP-65 list (kind 10002) via the outbox model, falling back to the discovery relays.

## How it works

- The identity is read from the URL path and resolved to a pubkey and their relays.
- Notes are loaded by author from those relays.
- Filtering happens client-side: a note shows up if it mentions `gm` as a word and links at least one image.
- Image URLs are extracted with `applesauce-content` and rendered in a masonry that collapses to a single column on mobile.

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the unit tests
npm run build    # production build into dist/
```

## Configuration

Default user, discovery relays and fetch limit live in [`src/config.ts`](src/config.ts). The filter term and page metadata are set via env vars (see [`.env`](.env) for the GM defaults):

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_FILTER_TERM` | Word a note must contain to show up | `gm` |
| `VITE_SITE_TITLE` | Browser tab and OG title | `GM - Good mornings from dergigi` |
| `VITE_SITE_DESCRIPTION` | Meta and OG description | `A gallery of dergigi's GM posts on nostr.` |
| `VITE_SITE_URL` | Canonical and OG url | `https://gm.dergigi.com` |

## Deployment (Vercel)

Vercel auto-detects Vite. Build command `npm run build`, output directory `dist`. [`vercel.json`](vercel.json) rewrites all paths to `index.html` so user paths like `/npub1...` load the app.

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
