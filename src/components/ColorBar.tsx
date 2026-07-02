import { LABEL } from "../config";
import { SWATCHES } from "../colors";
import { Avatar } from "./Avatar";

// Font Awesome 6 free solid icons.
const NJUMP_ICON = {
  viewBox: "0 0 512 512",
  path: "M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z",
};
const NATIVE_ICON = {
  viewBox: "0 0 384 512",
  path: "M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64L80 64l0 320 224 0 0-320z",
};

export function ColorBar({
  present,
  hasBW,
  active,
  onSelect,
  npub,
  picture,
  name,
  native,
  onToggleLink,
}: {
  present: Set<string>;
  hasBW: boolean;
  active: string | null;
  onSelect: (id: string | null) => void;
  npub: string;
  picture?: string;
  name?: string;
  native: boolean;
  onToggleLink: () => void;
}) {
  const swatches = SWATCHES.filter((swatch) => present.has(swatch.id));
  if (swatches.length === 0 && !picture && !hasBW) return null;

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
      {hasBW && (
        <button
          className={"swatch bw" + (active === "bw" ? " active" : "")}
          aria-label="Filter black and white"
          title="Black & white"
          onClick={() => onSelect(active === "bw" ? null : "bw")}
        />
      )}
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
      <button
        className={"linktoggle" + (native ? " on" : "")}
        role="switch"
        aria-checked={native}
        onClick={onToggleLink}
        aria-label="Toggle where posts open"
        title={`Posts open in ${native ? "your native app" : "njump"}. Click to switch.`}
      >
        <span className="knob">
          {(() => {
            const icon = native ? NATIVE_ICON : NJUMP_ICON;
            return (
              <svg viewBox={icon.viewBox} aria-hidden="true">
                <path d={icon.path} />
              </svg>
            );
          })()}
        </span>
      </button>
      <a
        className="about"
        href="https://github.com/dergigi/gm-gallery"
        target="_blank"
        rel="noreferrer"
      >
        {LABEL}?
      </a>
    </div>
  );
}
