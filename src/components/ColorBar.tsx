import { SWATCHES } from "../colors";

export function ColorBar({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="colorbar">
      {SWATCHES.map((swatch) => (
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
