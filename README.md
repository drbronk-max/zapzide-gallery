# GM Gallery

A view-only nostr client that shows [dergigi](https://njump.to/npub1dergggklka99wwrs92yz8wdjs952h2ux2ha2ed598ngwu9w7a6fsh9xzpc)'s GM posts that contain an image, in a masonry gallery. Lives at [gm.dergigi.com](https://gm.dergigi.com).

Built with [applesauce](https://applesauce.build/), React, Vite and TypeScript.

## Live instances

- [gm.dergigi.com](https://gm.dergigi.com): GM posts.
- [gn.dergigi.com](https://gn.dergigi.com): GN posts.
- [bw.dergigi.com](https://bw.dergigi.com): black-and-white images.
- [img.dergigi.com](https://img.dergigi.com): all image posts.
- [gif.dergigi.com](https://gif.dergigi.com): gifs only.

## Viewing other users

Add a user to the path to see their gallery instead of the default:

- `gm.dergigi.com/` shows the default user (dergigi).
- `gm.dergigi.com/npub1...` or `gm.dergigi.com/nprofile1...` by NIP-19 identifier.
- `gm.dergigi.com/name@domain` or `gm.dergigi.com/domain` by NIP-05 address (a bare domain resolves to `_@domain`).

Their relays are discovered from their NIP-65 list (kind 10002) via the outbox model, falling back to the discovery relays.

A few examples:

- [gm.dergigi.com/npub1njaz...waf3t9](https://gm.dergigi.com/npub1njazsude53reg6e7jmz6jvvgyamf5twca93sn3px3yhxpsp9yakqwaf3t9)
- [img.dergigi.com/npub1kk0q...66xq2](https://img.dergigi.com/npub1kk0qpalwat5tclr4j9ecxqrdg2k0szvudh8nzuxmdjr4ayvwfy0qa66xq2)
- [gif.dergigi.com/npub1ghce...eygat](https://gif.dergigi.com/npub1ghcetnluhryhynhuyj8s2pazldjm27wl40nu6dfeskvpv09twcnsneygat)

## Why build this?

I like pretty things. I enjoy looking at galleries. Pretty things are why I keep posting "GM" every day, with a pretty image that resonates. 

I love nostr, and it's incredibly easy to build stuff on top of it, so here we are. Maybe this little gallery client inspires someone to make their own client a little better. I think clients could be better in terms of filtering, in terms of gallery views, in terms of how media is presented (and sorted, and shared, and displayed, etc).

I might build a general-purpose gallery one day. But for now, GM it is. Bound to a profile. However, keep in mind that the other instances (img, bw, gif) use other filters that might be useful too, and also keep in mind that you can very easily point the thing to your npub (by appending your npub or NIP-05 to the URL). 

Enjoy!

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
| `VITE_FILTER_TERM` | Word a note must contain to show up. Use `*` (or `all`/`any`/`none`) to match every note | `gm` |
| `VITE_INITIAL_COLOR` | Color filter pre-selected on load, e.g. `bw`, `blue` | none |
| `VITE_IMAGE_EXT` | Only show images with this file extension, e.g. `gif` | any image |
| `VITE_SITE_LABEL` | Short label in the header link and status messages | the term or color |
| `VITE_LINK_MODE` | Default target for opening a post: `njump` (web) or `native` (`nostr:` app link). Visitors can flip it in the top bar | `njump` |
| `VITE_SITE_TITLE` | Browser tab and OG title | `GM` |
| `VITE_SITE_DESCRIPTION` | Meta and OG description | `A gallery of GM posts on nostr.` |
| `VITE_SITE_URL` | Canonical and OG url | `https://gm.dergigi.com` |
| `VITE_OG_IMAGE` | Social share image (1200x630). Prebuilt variants live in [`public/og/`](public/og/) | `/og/gm.png` |

The share images are rendered from small HTML templates in [`scripts/`](scripts/): [`og-photo.html`](scripts/og-photo.html) lays a gallery screenshot behind the label (used for `gm`/`gn`), and [`og-template.html`](scripts/og-template.html) is the plain card used for `bw`/`img`.

## Deployment (Vercel)

Vercel auto-detects Vite. Build command `npm run build`, output directory `dist`. [`vercel.json`](vercel.json) rewrites all paths to `index.html` so user paths like `/npub1...` load the app.

Deploy the same repo twice, one project per domain, differing only in env vars:

- `gm.dergigi.com`: uses the committed `.env` defaults (no overrides needed).
- `gn.dergigi.com`: set these in the Vercel project's environment variables:

```
VITE_FILTER_TERM=gn
VITE_SITE_TITLE=GN
VITE_SITE_DESCRIPTION=A gallery of GN posts on nostr.
VITE_SITE_URL=https://gn.dergigi.com
VITE_OG_IMAGE=/og/gn.png
```

- `bw.dergigi.com`: no keyword filter, black-and-white filter pre-selected, so it shows every image that is black and white. Use `*` for `VITE_FILTER_TERM` to match every note (Vercel requires a non-empty value; `*`, `all`, `any` and `none` all mean match-all):

```
VITE_FILTER_TERM=*
VITE_INITIAL_COLOR=bw
VITE_SITE_TITLE=BW - Black and white from dergigi
VITE_SITE_DESCRIPTION=A gallery of dergigi's black-and-white posts on nostr.
VITE_SITE_URL=https://bw.dergigi.com
VITE_OG_IMAGE=/og/bw.png
```

- `img.dergigi.com`: every image post, no color pre-selected:

```
VITE_FILTER_TERM=*
VITE_SITE_LABEL=img
VITE_SITE_TITLE=Images
VITE_SITE_DESCRIPTION=A gallery of image posts on nostr.
VITE_SITE_URL=https://img.dergigi.com
VITE_OG_IMAGE=/og/img.png
```

- `gif.dergigi.com`: every image post that links a `.gif`:

```
VITE_FILTER_TERM=*
VITE_IMAGE_EXT=gif
VITE_SITE_LABEL=gif
VITE_SITE_TITLE=GIFs
VITE_SITE_DESCRIPTION=A gallery of gif posts on nostr.
VITE_SITE_URL=https://gif.dergigi.com
VITE_OG_IMAGE=/og/gif.png
```

Then add the matching custom domain in each project's settings.
