import { useCallback, useEffect, useMemo, useState } from "react";
import { use$ } from "applesauce-react/hooks";
import { FILTER_TERM, PUBKEY } from "./config";
import { eventStore, loading$, loadGm, loadMore } from "./nostr";
import { getImages, matchesFilter } from "./content";
import { Gallery } from "./components/Gallery";
import { ColorBar } from "./components/ColorBar";

export default function App() {
  useEffect(loadGm, []);

  const notes = use$(() => eventStore.timeline({ kinds: [1], authors: [PUBKEY] }), []);
  const loading = use$(loading$);
  const [loadingMore, setLoadingMore] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const [buckets, setBuckets] = useState<Record<string, string>>({});

  const onColor = useCallback((id: string, bucket: string | null) => {
    if (bucket) setBuckets((prev) => (prev[id] === bucket ? prev : { ...prev, [id]: bucket }));
  }, []);

  const withImages = (notes ?? []).filter(
    (note) => matchesFilter(note) && getImages(note).length > 0,
  );
  const present = new Set(withImages.map((note) => buckets[note.id]).filter(Boolean));
  const visibleCount = withImages.filter((note) => !color || buckets[note.id] === color).length;

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

  if (withImages.length === 0)
    return (
      <div className="app">
        <p className="state">{loading ? loadingText : `No ${label} posts found.`}</p>
      </div>
    );

  return (
    <div className="app">
      <ColorBar present={present} active={color} onSelect={setColor} />
      <Gallery notes={withImages} activeColor={color} buckets={buckets} onColor={onColor} />
      {color && visibleCount === 0 && (
        <p className="state">No {color} images yet. Try loading more.</p>
      )}
      <div className="load-more">
        <button onClick={handleLoadMore} disabled={loadingMore}>
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      </div>
    </div>
  );
}
