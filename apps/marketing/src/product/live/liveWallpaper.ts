/** Compress a wallpaper image for live session background (local + remote status). */

const MAX_EDGE = 1280;
const MAX_BYTES = 90_000;

function canvasToJpegDataUrl(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL('image/jpeg', quality);
}

function dataUrlBytes(dataUrl: string): number {
  const i = dataUrl.indexOf(',');
  const b64 = i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
  return Math.floor((b64.length * 3) / 4);
}

/** Resize + JPEG-compress an image File for live wallpaper (≤ ~90KB data URL). */
export async function compressLiveWallpaper(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw Object.assign(new Error('Choose an image (jpg, png, webp…)'), { name: 'TypeError' });
  }
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(2, Math.round(bitmap.width * scale));
    const h = Math.max(2, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(bitmap, 0, 0, w, h);
    let q = 0.72;
    let url = canvasToJpegDataUrl(canvas, q);
    while (dataUrlBytes(url) > MAX_BYTES && q > 0.35) {
      q -= 0.08;
      url = canvasToJpegDataUrl(canvas, q);
    }
    if (dataUrlBytes(url) > MAX_BYTES * 1.35) {
      throw Object.assign(new Error('Image still too large — try a smaller photo'), {
        name: 'PayloadTooLarge',
      });
    }
    return url;
  } finally {
    bitmap.close?.();
  }
}
