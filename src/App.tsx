import { useEffect } from "react";
import { use$ } from "applesauce-react/hooks";
import { PUBKEY } from "./config";
import { eventStore, loading$, loadGm } from "./nostr";
import { getImages, isGmPost } from "./content";
import { Gallery } from "./components/Gallery";

export default function App() {
  useEffect(loadGm, []);

  const notes = use$(() => eventStore.timeline({ kinds: [1], authors: [PUBKEY] }), []);
  const loading = use$(loading$);

  const gms = (notes ?? []).filter((note) => isGmPost(note) && getImages(note).length > 0);

  return (
    <div className="app">
      {gms.length > 0 ? (
        <Gallery notes={gms} />
      ) : loading ? (
        <p className="state">Loading GMs...</p>
      ) : (
        <p className="state">No GM posts found.</p>
      )}
    </div>
  );
}
