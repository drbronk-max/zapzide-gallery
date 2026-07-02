import { useEffect, useMemo, useState } from "react";
import { use$ } from "applesauce-react/hooks";
import { FILTER_TERM, PUBKEY } from "./config";
import { eventStore, loading$, loadGm, loadMore } from "./nostr";
import { getImages, matchesFilter } from "./content";
import { Gallery } from "./components/Gallery";

export default function App() {
  useEffect(loadGm, []);

  const notes = use$(() => eventStore.timeline({ kinds: [1], authors: [PUBKEY] }), []);
  const loading = use$(loading$);
  const [loadingMore, setLoadingMore] = useState(false);

  const gms = (notes ?? []).filter((note) => matchesFilter(note) && getImages(note).length > 0);

  function handleLoadMore() {
    const oldest = notes?.at(-1);
    if (!oldest) return;
    setLoadingMore(true);
    loadMore(oldest.created_at).subscribe({
      complete: () => setLoadingMore(false),
      error: () => setLoadingMore(false),
    });
  }

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
        <>
          <Gallery notes={gms} />
          <div className="load-more">
            <button onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        </>
      ) : loading ? (
        <p className="state">{loadingText}</p>
      ) : (
        <p className="state">No {label} posts found.</p>
      )}
    </div>
  );
}
