import { SWATCHES } from "../colors";
import { Avatar } from "./Avatar";

export function ColorBar({
  present,
  active,
  onSelect,
  npub,
  picture,
  name,
}: {
  present: Set<string>;
  active: string | null;
  onSelect: (id: string | null) => void;
  npub: string;
  picture?: string;
  name?: string;
}) {
  const swatches = SWATCHES.filter((swatch) => present.has(swatch.id));
  if (swatches.length === 0 && !picture) return null;

  return (
    <div className="colorbar">
      <Avatar npub={npub} picture={picture} name={name} />
      {swatches.map((swatch) => (
        <button
          key={swatch.id}
          className={"swatch" + (active === swatch.id ? " active" : "")}
          style={{ background: swatch.hex }}
          aria-label={`Filter by ${swatch.label}`}
          title={swatch.label}
          onClick={() => onSelect(active === swatch.id ? null : swatch.id)}
        />
      ))}
      {active && (
        <button
          className="swatch clear"
          aria-label="Clear color filter"
          title="Clear filter"
          onClick={() => onSelect(null)}
        >
          ×
        </button>
      )}
    </div>
  );
}
