import { useEffect } from "react";
import { use$ } from "applesauce-react/hooks";
import { FILTER_TERM, PUBKEY } from "./config";
import { eventStore, loading$, loadGm } from "./nostr";
import { getImages, matchesFilter } from "./content";
import { Gallery } from "./components/Gallery";

export default function App() {
  useEffect(loadGm, []);

  const notes = use$(() => eventStore.timeline({ kinds: [1], authors: [PUBKEY] }), []);
  const loading = use$(loading$);

  const gms = (notes ?? []).filter((note) => matchesFilter(note) && getImages(note).length > 0);

  const label = FILTER_TERM.toUpperCase();

  return (
    <div className="app">
      {gms.length > 0 ? (
        <Gallery notes={gms} />
      ) : loading ? (
        <p className="state">Loading {label}s...</p>
      ) : (
        <p className="state">No {label} posts found.</p>
      )}
    </div>
  );
}
