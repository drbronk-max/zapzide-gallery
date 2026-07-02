import type { NostrEvent } from "applesauce-core/helpers";
import { GmCard } from "./GmCard";

export function Gallery({
  notes,
  activeColor,
  buckets,
  onColor,
}: {
  notes: NostrEvent[];
  activeColor: string | null;
  buckets: Record<string, string>;
  onColor: (id: string, bucket: string | null) => void;
}) {
  return (
    <div className="masonry">
      {notes.map((note) => (
        <GmCard
          key={note.id}
          note={note}
          hidden={!!activeColor && buckets[note.id] !== activeColor}
          onColor={onColor}
        />
      ))}
    </div>
  );
}
