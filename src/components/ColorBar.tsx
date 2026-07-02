import { SWATCHES } from "../colors";

export function ColorBar({
  present,
  active,
  onSelect,
}: {
  present: Set<string>;
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  const swatches = SWATCHES.filter((swatch) => present.has(swatch.id));
  if (swatches.length === 0) return null;

  return (
    <div className="colorbar">
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
    </div>
  );
}
