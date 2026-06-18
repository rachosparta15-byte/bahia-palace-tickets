'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  videoId: string;
  title: string;
}

export function LiteVideo({ videoId, title }: Props) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (active) {
    return (
      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="relative w-full aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer bg-[#2A1A0E]"
      aria-label={`Play: ${title}`}
    >
      <Image
        src={thumb}
        alt={title}
        fill
        className="object-cover"
        loading="lazy"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-[#C4452D]/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-8">
        <p className="text-white text-xs font-medium line-clamp-2 leading-relaxed">{title}</p>
      </div>
    </button>
  );
}
