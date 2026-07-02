import { EventStore, mapEventsToStore } from "applesauce-core";
import { RelayPool } from "applesauce-relay";
import { BehaviorSubject } from "rxjs";
import { LIMIT, PUBKEY, RELAYS } from "./config";

export const eventStore = new EventStore();
export const loading$ = new BehaviorSubject(true);

const pool = new RelayPool();

let started = false;

/** Load the author's notes from the relays into the event store (runs once). */
export function loadGm() {
  if (started) return;
  started = true;

  pool
    .request(RELAYS, { kinds: [0, 1], authors: [PUBKEY], limit: LIMIT })
    .pipe(mapEventsToStore(eventStore))
    .subscribe({
      complete: () => loading$.next(false),
      error: (err) => {
        console.error("relay request failed", err);
        loading$.next(false);
      },
    });
}

/** Fetch an older page of the author's notes (before `until`) into the store. */
export function loadMore(until: number) {
  return pool
    .request(RELAYS, { kinds: [1], authors: [PUBKEY], until, limit: LIMIT })
    .pipe(mapEventsToStore(eventStore));
}
