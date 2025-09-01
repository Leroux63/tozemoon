'use client';
import Image from 'next/image';

type Props = {
  /** Taille du logo interne (px) */
  size?: number;
  /** Active le badge rond (contraste sur fond sombre) */
  badge?: boolean;
  /** Chemin du PNG dans /public */
  src?: string;
  className?: string;
};

export default function TMLogo({
  size = 56,
  badge = true,
  src = '/brand/logo.png',
  className = '',
}: Props) {
  // Diamètre du badge = logo + padding (8px de chaque côté)
  const diameter = size + 1;

  const img = (
    <Image
      src={src}
      alt="ToZeMoon Labs"
      width={size}
      height={size}
      priority
      className={`object-contain ${className}`}
      sizes={`${size}px`}
    />
  );

  if (!badge) return img;

  return (
    <div
      className="rounded-full shadow-md flex items-center justify-center bg-white/95"
      style={{
        width: diameter,
        height: diameter,
        border: '2px solid rgba(0,168,184,.35)', // Lunar Teal léger
      }}
      aria-label="ToZeMoon Labs"
    >
      {img}
    </div>
  );
}
