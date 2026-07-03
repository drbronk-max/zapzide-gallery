import { normalizeToProfilePointer } from "applesauce-core/helpers";
import type { ProfilePointer } from "applesauce-core/helpers";
import { isNip05, queryProfile } from "nostr-tools/nip05";
import { npubEncode } from "nostr-tools/nip19";
import { DEFAULT_NPUB, DISCOVERY_RELAYS } from "./config";

export interface Identity {
  pubkey: string;
  relays: string[];
  npub: string;
}

/** Turn a raw path segment into a profile pointer, or null if it can't be parsed. */
async function toPointer(input: string): Promise<ProfilePointer | null> {
  const pointer = normalizeToProfilePointer(input);
  if (pointer) return pointer;
  if (isNip05(input)) return queryProfile(input);
  return null;
}

/**
 * Resolve a URL path segment (npub, nprofile, NIP-05, or bare domain) into a
 * pubkey and the relays to read their notes from. Empty input uses the default.
 */
export async function resolveIdentity(input: string): Promise<Identity> {
  const trimmed = input.replace(/^\/+|\/+$/g, "").trim() || DEFAULT_NPUB;
  const pointer = await toPointer(trimmed);
  if (!pointer) throw new Error(`Couldn't find "${trimmed}"`);

  return {
    pubkey: pointer.pubkey,
    relays: DISCOVERY_RELAYS,
    npub: npubEncode(pointer.pubkey),
  };
}
