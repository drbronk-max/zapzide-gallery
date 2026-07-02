export interface Swatch {
  id: string;
  label: string;
  hex: string;
}

/** The color bar, chromatic first then neutrals. */
export const SWATCHES: Swatch[] = [
  { id: "red", label: "red", hex: "#e02020" },
  { id: "orange", label: "orange", hex: "#f28c18" },
  { id: "yellow", label: "yellow", hex: "#f7d000" },
  { id: "green", label: "green", hex: "#3aa93a" },
  { id: "cyan", label: "cyan", hex: "#17c0c9" },
  { id: "blue", label: "blue", hex: "#2f6bd8" },
  { id: "purple", label: "purple", hex: "#8a3ffc" },
  { id: "pink", label: "pink", hex: "#e256a5" },
  { id: "gray", label: "gray", hex: "#9aa0a6" },
  { id: "darkgray", label: "dark gray", hex: "#4a4f54" },
  { id: "black", label: "black", hex: "#111111" },
  { id: "white", label: "white", hex: "#f5f5f5" },
];

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
}

/** Classify a single pixel into one of the swatch buckets. */
export function bucketOf(r: number, g: number, b: number): string {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l < 0.12) return "black";
  if (l > 0.9) return "white";
  if (s < 0.12) return l < 0.5 ? "darkgray" : "gray";
  if (h < 15 || h >= 345) return "red";
  if (h < 45) return "orange";
  if (h < 70) return "yellow";
  if (h < 165) return "green";
  if (h < 195) return "cyan";
  if (h < 255) return "blue";
  if (h < 290) return "purple";
  return "pink";
}

const proxy = (src: string, size = 24) =>
  `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${size}&h=${size}&fit=cover`;

/** Load a tiny CORS-safe thumbnail and return its predominant color bucket. */
export function loadDominantColor(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const counts: Record<string, number> = {};
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue;
          const id = bucketOf(data[i], data[i + 1], data[i + 2]);
          counts[id] = (counts[id] ?? 0) + 1;
        }
        let best: string | null = null;
        let max = 0;
        for (const id in counts) {
          if (counts[id] > max) {
            max = counts[id];
            best = id;
          }
        }
        resolve(best);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = proxy(src);
  });
}
