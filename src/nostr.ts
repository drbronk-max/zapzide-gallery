import { EventStore, mapEventsToStore } from "applesauce-core";
import { RelayPool } from "applesauce-relay";
import { BehaviorSubject } from "rxjs";
import { LIMIT } from "./config";

export const eventStore = new EventStore();
export const loading$ = new BehaviorSubject(true);

export const pool = new RelayPool();

let started = false;

/** Load a user's notes and profile from their relays into the event store (runs once). */
export function loadGm(pubkey: string, relays: string[]) {
  if (started) return;
  started = true;

  pool
    .request(relays, { kinds: [0, 1], authors: [pubkey], limit: LIMIT })
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
  return pool
    .request(relays, { kinds: [1], authors: [pubkey], until, limit: LIMIT })
    .pipe(mapEventsToStore(eventStore));
}
