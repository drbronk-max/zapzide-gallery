import { useEffect, useMemo } from "react";
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
  const loadingText = useMemo(() => {
    const texts = [
      `It's always ${label} somewhere...`,
      `A ${label} is never late, nor is it early. It arrives precisely when it means to.`,
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  }, [label]);

  return (
    <div className="app">
      {gms.length > 0 ? (
        <Gallery notes={gms} />
      ) : loading ? (
        <p className="state">{loadingText}</p>
      ) : (
        <p className="state">No {label} posts found.</p>
      )}
    </div>
  );
}
