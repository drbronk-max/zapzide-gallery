import { useEffect, useMemo, useRef, useState } from "react";
import { use$ } from "applesauce-react/hooks";
import { FILTER_TERM, PUBKEY } from "./config";
import { eventStore, loading$, loadGm, loadMore } from "./nostr";
import { getImages, matchesFilter } from "./content";
import { loadDominantColor } from "./colors";
import { Gallery } from "./components/Gallery";
import { ColorBar } from "./components/ColorBar";

export default function App() {
  useEffect(loadGm, []);

  const notes = use$(() => eventStore.timeline({ kinds: [1], authors: [PUBKEY] }), []);
  const loading = use$(loading$);
  const [loadingMore, setLoadingMore] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const [buckets, setBuckets] = useState<Record<string, string>>({});
  const analyzed = useRef(new Set<string>());

  const withImages = (notes ?? []).filter(
    (note) => matchesFilter(note) && getImages(note).length > 0,
  );
  const visible = color ? withImages.filter((note) => buckets[note.id] === color) : withImages;

  useEffect(() => {
    for (const note of notes ?? []) {
      if (analyzed.current.has(note.id)) continue;
      const src = getImages(note)[0];
      if (!matchesFilter(note) || !src) continue;
      analyzed.current.add(note.id);
      loadDominantColor(src).then((id) => {
        if (id) setBuckets((prev) => ({ ...prev, [note.id]: id }));
      });
    }
  }, [notes]);

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
      <ColorBar active={color} onSelect={setColor} />
      <Gallery notes={visible} />
      {color && visible.length === 0 && (
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
