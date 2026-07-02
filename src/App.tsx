import { useCallback, useEffect, useMemo, useState } from "react";
import { Models } from "applesauce-core";
import { use$ } from "applesauce-react/hooks";
import { FILTER_TERM } from "./config";
import { eventStore, loading$, loadGm, loadMore } from "./nostr";
import { resolveIdentity, type Identity } from "./identity";
import { getImages, matchesFilter } from "./content";
import { matchesColor } from "./colors";
import { Gallery } from "./components/Gallery";
import { ColorBar } from "./components/ColorBar";

export default function App() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolveIdentity(window.location.pathname)
      .then((id) => {
        if (cancelled) return;
        setIdentity(id);
        loadGm(id.pubkey, id.relays);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResolveError(err instanceof Error ? err.message : "Couldn't find that user");
        loading$.next(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pubkey = identity?.pubkey;
  const notes = use$(
    () => (pubkey ? eventStore.timeline({ kinds: [1], authors: [pubkey] }) : undefined),
    [pubkey],
  );
  const profile = use$(
    () => (pubkey ? eventStore.model(Models.ProfileModel, pubkey) : undefined),
    [pubkey],
  );
  const loading = use$(loading$);
  const [loadingMore, setLoadingMore] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const [buckets, setBuckets] = useState<Record<string, string[]>>({});

  const onColors = useCallback((id: string, list: string[]) => {
    if (list.length) setBuckets((prev) => ({ ...prev, [id]: list }));
  }, []);

  const withImages = (notes ?? []).filter(
    (note) => matchesFilter(note) && getImages(note).length > 0,
  );
  const present = new Set(withImages.flatMap((note) => buckets[note.id] ?? []));
  const hasBW = withImages.some((note) => matchesColor(buckets[note.id], "bw"));
  const visibleCount = withImages.filter(
    (note) => !color || matchesColor(buckets[note.id], color),
  ).length;

  function handleLoadMore() {
    const oldest = notes?.at(-1);
    if (!oldest || !identity) return;
    setLoadingMore(true);
    loadMore(identity.pubkey, identity.relays, oldest.created_at).subscribe({
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

  if (resolveError)
    return (
      <div className="app">
        <p className="state">{resolveError}</p>
      </div>
    );

  if (withImages.length === 0)
    return (
      <div className="app">
        <p className="state">{loading ? loadingText : `No ${label} posts found.`}</p>
      </div>
    );

  return (
    <div className="app">
      <ColorBar
        present={present}
        hasBW={hasBW}
        active={color}
        onSelect={setColor}
        npub={identity?.npub ?? ""}
        picture={profile?.picture}
        name={profile?.display_name || profile?.name}
      />
      <Gallery notes={withImages} activeColor={color} buckets={buckets} onColors={onColors} />
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
