import { useEffect, useState } from 'react';

type Props = {
  thumbnailSrc?: string | null;
  primarySrc?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
};

/**
 * Tries thumbnail first (smaller), then falls back to primary (full) if the thumb fails to load.
 */
export function CoverImageWithFallback({
  thumbnailSrc,
  primarySrc,
  alt,
  className,
  width,
  height,
  loading,
  fetchPriority,
}: Props) {
  const thumb = typeof thumbnailSrc === 'string' ? thumbnailSrc.trim() : '';
  const full = typeof primarySrc === 'string' ? primarySrc.trim() : '';
  const hasThumb = thumb.length > 0;
  const hasFull = full.length > 0;

  const initialSrc = hasThumb && hasFull ? thumb : hasFull ? full : thumb;
  const [src, setSrc] = useState(initialSrc);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const next = hasThumb && hasFull ? thumb : hasFull ? full : thumb;
    setSrc(next);
    setUsedFallback(false);
  }, [thumb, full, hasThumb, hasFull]);

  if (!hasThumb && !hasFull) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={(e) => {
        if (!usedFallback && hasThumb && hasFull) {
          setUsedFallback(true);
          setSrc(full);
          return;
        }
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
