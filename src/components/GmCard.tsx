import { useState } from "react";
import { nip19 } from "nostr-tools";
import type { NostrEvent } from "applesauce-core/helpers";
import { getImages } from "../content";
import { bucketFromImage } from "../colors";

export function GmCard({
  note,
  hidden,
  onColor,
}: {
  note: NostrEvent;
  hidden: boolean;
  onColor: (id: string, bucket: string | null) => void;
}) {
  const [broken, setBroken] = useState(false);
  // Try a CORS load first so we can read pixels; fall back to a plain load
  // (image still shows, just no color) for hosts without CORS headers.
  const [cors, setCors] = useState(true);

  const image = getImages(note)[0];
  if (!image || broken) return null;

  const nevent = nip19.neventEncode({ id: note.id, author: note.pubkey });
  const date = new Date(note.created_at * 1000).toLocaleDateString();

  return (
    <a
      className="card"
      href={`https://njump.to/${nevent}`}
      target="_blank"
      rel="noreferrer"
      style={hidden ? { display: "none" } : undefined}
    >
      <img
        src={image}
        alt={`GM post from ${date}`}
        crossOrigin={cors ? "anonymous" : undefined}
        loading="lazy"
        decoding="async"
        onLoad={(e) => cors && onColor(note.id, bucketFromImage(e.currentTarget))}
        onError={() => (cors ? setCors(false) : setBroken(true))}
      />
    </a>
  );
}
