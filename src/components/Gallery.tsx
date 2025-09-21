'use client';

import Image from 'next/image';
import {useState, useCallback, useEffect} from 'react';
import {X, ChevronLeft, ChevronRight} from 'lucide-react';

type Img = { src: string; alt: string; title?: string };

export default function Gallery({
  images,
  aspect = '16/9',
  fit = 'contain',
  columns = 3,
  showCaptions = true
}: {
  images: Img[];
  aspect?: '16/9' | '4/3' | '1/1';
  fit?: 'cover' | 'contain';
  columns?: 2 | 3 | 4;
  showCaptions?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const arClass =
    aspect === '16/9' ? 'aspect-[16/9]' :
    aspect === '4/3'  ? 'aspect-[4/3]'  :
                         'aspect-square';

  const gridCols =
    columns === 4 ? 'md:grid-cols-4' :
    columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  return (
    <>
      {/* Grid de vignettes, tailles uniformes */}
      <div className={`grid gap-4 ${gridCols}`}>
        {images.map((img, i) => (
          <figure key={img.src} className="group">
            <button
              type="button"
              onClick={() => { setIdx(i); setOpen(true); }}
              className={`relative ${arClass} w-full rounded-xl overflow-hidden border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/30`}
              aria-label={`Ouvrir ${img.title || img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-${fit} transition-transform duration-200 group-hover:scale-[1.02]`}
                priority={i === 0}
              />
            </button>
            {showCaptions && (img.title || img.alt) ? (
              <figcaption className="mt-2 text-sm opacity-80">
                {img.title || img.alt}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button
            aria-label="Fermer"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            aria-label="Image précédente"
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={prev}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            aria-label="Image suivante"
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={next}
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="max-w-[90vw] max-h-[85vh] relative w-full h-full flex items-center justify-center">
            <div className="relative w-[min(90vw,1200px)] h-[min(85vh,70vw)]">
              <Image
                src={images[idx].src}
                alt={images[idx].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {(images[idx].title || images[idx].alt) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm opacity-90">
                {images[idx].title || images[idx].alt}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
