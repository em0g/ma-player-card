const cache = new Map<string, string | null>();

/**
 * Extract a vivid-ish dominant color from an image as "r, g, b".
 * Returns null when the image can't be read (e.g. cross-origin without CORS).
 */
export async function dominantColor(url: string): Promise<string | null> {
  if (cache.has(url)) return cache.get(url)!;
  const result = await new Promise<string | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, total = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [pr, pg, pb] = [data[i], data[i + 1], data[i + 2]];
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          // Weight saturated, mid-bright pixels higher so we avoid grey mush.
          const sat = max === 0 ? 0 : (max - min) / max;
          const bright = max / 255;
          const w = 0.05 + sat * sat * (bright > 0.15 && bright < 0.95 ? 1 : 0.2);
          r += pr * w; g += pg * w; b += pb * w; total += w;
        }
        resolve(normalize(r / total, g / total, b / total));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
  if (cache.size > 50) cache.clear();
  cache.set(url, result);
  return result;
}

/** Keep the accent bright enough to read on dark and not neon on a matte screen. */
function normalize(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b, 1);
  const target = Math.min(Math.max(max, 140), 230);
  const k = target / max;
  return [r, g, b].map((c) => Math.round(Math.min(255, c * k))).join(", ");
}
