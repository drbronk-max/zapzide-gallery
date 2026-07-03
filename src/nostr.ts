import { EventStore, mapEventsToStore } from "applesauce-core";
import { RelayPool } from "applesauce-relay";
import { BehaviorSubject } from "rxjs";
import { LIMIT, FILTER_TERM } from "./config";

export const eventStore = new EventStore();
export const loading$ = new BehaviorSubject(true);

export const pool = new RelayPool();

let started = false;

/** Load a user's notes and profile from their relays into the event store (runs once). */
export function loadGm(pubkey: string, relays: string[]) {
  if (started) return;
  started = true;

  const filters = FILTER_TERM
    ? [
        { kinds: [0], authors: [pubkey], limit: 1 },
        { kinds: [1], authors: [pubkey], "#t": [FILTER_TERM], limit: LIMIT },
      ]
    : [{ kinds: [0, 1], authors: [pubkey], limit: LIMIT }];

  pool
    .request(relays, filters)
    .pipe(mapEventsToStore(eventStore))
    .subscribe({
      complete: () => loading$.next(false),
      error: (err) => {
        console.error("relay request failed", err);
        loading$.next(false);
      },
    });
}

/** Fetch an older page of a user's notes (before `until`) into the store. */
export function loadMore(pubkey: string, relays: string[], until: number) {
  const filter = FILTER_TERM
    ? { kinds: [1], authors: [pubkey], "#t": [FILTER_TERM], until, limit: LIMIT }
    : { kinds: [1], authors: [pubkey], until, limit: LIMIT };

  return pool.request(relays, filter).pipe(mapEventsToStore(eventStore));
}
