import { getOutboxes, normalizeToProfilePointer } from "applesauce-core/helpers";
import type { ProfilePointer } from "applesauce-core/helpers";
import type { NostrEvent } from "applesauce-core/helpers";
import { isNip05, queryProfile } from "nostr-tools/nip05";
import { npubEncode } from "nostr-tools/nip19";
import { lastValueFrom, of } from "rxjs";
import { timeout, toArray } from "rxjs/operators";
import { DEFAULT_NPUB, DISCOVERY_RELAYS } from "./config";
import { pool } from "./nostr";

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

/** Fetch a user's NIP-65 outbox relays from the discovery relays. */
async function discoverOutboxes(pubkey: string, hints: string[]): Promise<string[]> {
  const relays = [...new Set([...hints, ...DISCOVERY_RELAYS])];
  const events = await lastValueFrom(
    pool.request(relays, { kinds: [10002], authors: [pubkey] }).pipe(
      toArray(),
      timeout({ first: 5000, with: () => of([] as NostrEvent[]) }),
    ),
  );

  const newest = events.sort((a, b) => b.created_at - a.created_at)[0];
  return newest ? getOutboxes(newest) : [];
}

/**
 * Resolve a URL path segment (npub, nprofile, NIP-05, or bare domain) into a
 * pubkey and the relays to read their notes from. Empty input uses the default.
 */
export async function resolveIdentity(input: string): Promise<Identity> {
  const trimmed = input.replace(/^\/+|\/+$/g, "").trim() || DEFAULT_NPUB;

  const pointer = await toPointer(trimmed);
  if (!pointer) throw new Error(`Couldn't find "${trimmed}"`);

  const hints = pointer.relays ?? [];
  const outboxes = await discoverOutboxes(pointer.pubkey, hints);

  const relays = [...new Set([...outboxes, ...hints])];
  return {
    pubkey: pointer.pubkey,
    relays: relays.length ? relays : DISCOVERY_RELAYS,
    npub: npubEncode(pointer.pubkey),
  };
}
