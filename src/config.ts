/** The npub shown when no user is specified in the URL path. */
export const DEFAULT_NPUB = "npub1j6jh3a44q3jxmc2ph2gta3t9r9j65qwlqcze9zehsksnwfgyay7szpg7fw";

/**
 * Relays queried to discover a user's NIP-65 relay list and profile, and used
 * as a fallback when a user has no relays of their own.
 */
export const DISCOVERY_RELAYS = [
  "wss://purplepag.es",
  "wss://relay.damus.io",
  "wss://relay.primal.net",
  "wss://directory.yabu.me",
  "wss://theforest.nostr1.com",
];
export const LIMIT = 1000;

// Values that mean "no keyword filter, match every note". Vercel requires a
// non-empty env value, so "*"/"all"/etc. work as stand-ins for an empty term.
const MATCH_ALL = new Set(["", "*", "all", "any", "none"]);

const rawTerm = (import.meta.env.VITE_FILTER_TERM ?? "gm").trim().toLowerCase();

/** The word a note must contain to show up, e.g. "gm" or "gn". Empty means match all. */
export const FILTER_TERM = MATCH_ALL.has(rawTerm) ? "" : rawTerm;

/** A color filter to pre-select on load, e.g. "bw" or "blue". Null means none. */
export const INITIAL_COLOR = (import.meta.env.VITE_INITIAL_COLOR ?? "").trim().toLowerCase() || null;

/** Restrict to images with this file extension, e.g. "gif". Empty means any image. */
export const IMAGE_EXT = (import.meta.env.VITE_IMAGE_EXT ?? "")
  .trim()
  .toLowerCase()
  .replace(/^\./, "");

/** Short label used in the header link and status messages. Defaults to the term or color. */
const rawLabel = (import.meta.env.VITE_SITE_LABEL ?? "").trim();
export const LABEL = (rawLabel || FILTER_TERM || INITIAL_COLOR || "gm").toUpperCase();

export type LinkMode = "njump" | "native";

/** Where a post opens by default: "njump" (web viewer) or "native" (nostr: app link). */
const rawLinkMode = (import.meta.env.VITE_LINK_MODE ?? "njump").trim().toLowerCase();
export const DEFAULT_LINK_MODE: LinkMode = rawLinkMode === "native" ? "native" : "njump";
