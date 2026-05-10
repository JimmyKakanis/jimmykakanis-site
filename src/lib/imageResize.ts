const canvasToJpegBlob = (
  canvas: HTMLCanvasElement,
  quality = 0.88
): Promise<Blob | null> =>
  new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
  });

/**
 * Fits image inside a square box (letterbox preserved), capped by longest edge.
 */
async function resizeContainMaxEdge(
  file: File,
  maxEdge: number,
  quality: number
): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;

  const { width: iw, height: ih } = bitmap;
  if (iw === 0 || ih === 0) return null;

  let w = iw;
  let h = ih;
  if (w > maxEdge || h > maxEdge) {
    const scale = maxEdge / Math.max(w, h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  return canvasToJpegBlob(canvas, quality);
}

/** Center crop to square, then scale to fixed size — matches thumbnail UIs using object-cover. */
async function resizeCoverSquare(
  file: File,
  edgePx: number,
  quality: number
): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;

  const iw = bitmap.width;
  const ih = bitmap.height;
  if (iw === 0 || ih === 0) return null;

  const side = Math.min(iw, ih);
  const sx = (iw - side) / 2;
  const sy = (ih - side) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = edgePx;
  canvas.height = edgePx;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, edgePx, edgePx);
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, edgePx, edgePx);
  bitmap.close();

  return canvasToJpegBlob(canvas, quality);
}

const RASTER_MIME_HINT = /^image\/(jpeg|png|webp|bmp|avif)$/i;

/**
 * Produce web-sized hero + listing thumbnail blobs. Returns null blobs if resizing fails (caller may fall back).
 */
export async function makeBlogCoverBlobs(file: File): Promise<{
  full: Blob | null;
  thumbnail: Blob | null;
}> {
  if (!file.type.startsWith('image/') || !RASTER_MIME_HINT.test(file.type)) {
    return { full: null, thumbnail: null };
  }

  const [full, thumbnail] = await Promise.all([
    resizeContainMaxEdge(file, 2048, 0.88),
    resizeCoverSquare(file, 512, 0.85),
  ]);

  return { full, thumbnail };
}
