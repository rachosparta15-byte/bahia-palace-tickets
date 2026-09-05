/**
 * A full-field zellige ground — the interlacing eight-point star (khatam) that
 * covers the walls of the palace itself, drawn large enough to actually read.
 *
 * The site's existing `.zellige` tile is 60px with opacity 0.07 baked into the
 * SVG, which is a whisper: at that scale and strength it disappears into the
 * cream and the section looks flat. This is the same geometry at twice the
 * size and a strength you can see, in the palette's own terracotta and saffron.
 *
 * Two colours interlacing, as real zellige does — the star in one, the linking
 * cross in the other — so it reads as tilework rather than as a screen tone.
 */
export function ZelligeField({
  className = '',
  size = 132,
  opacity = 1,
}: {
  className?: string;
  /** Tile size in px. Larger reads calmer; smaller reads busier. */
  size?: number;
  opacity?: number;
}) {
  const id = 'zellige-field';

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g
            transform={`scale(${size / 132})`}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            {/* Centre star: two squares at 45° to each other. */}
            <g stroke="#C4452D" strokeWidth="1.6" opacity="0.30">
              <rect x="42" y="42" width="48" height="48" />
              <rect x="42" y="42" width="48" height="48" transform="rotate(45 66 66)" />
            </g>

            {/* Corner stars — quarters that complete across the tile seam. */}
            <g stroke="#C4452D" strokeWidth="1.6" opacity="0.30">
              <rect x="-24" y="-24" width="48" height="48" />
              <rect x="-24" y="-24" width="48" height="48" transform="rotate(45 0 0)" />
              <rect x="108" y="-24" width="48" height="48" />
              <rect x="108" y="-24" width="48" height="48" transform="rotate(45 132 0)" />
              <rect x="-24" y="108" width="48" height="48" />
              <rect x="-24" y="108" width="48" height="48" transform="rotate(45 0 132)" />
              <rect x="108" y="108" width="48" height="48" />
              <rect x="108" y="108" width="48" height="48" transform="rotate(45 132 132)" />
            </g>

            {/* The lozenges that sit between the stars, in the second colour.
                Drawn as diamonds rather than as the arrow-shaped crosses of the
                first pass, which crossed the tile seam and read as stray X
                marks instead of as part of the weave. */}
            <g stroke="#C8882A" strokeWidth="1.4" opacity="0.36">
              <path d="M66 12 L80 26 L66 40 L52 26 Z" />
              <path d="M66 92 L80 106 L66 120 L52 106 Z" />
              <path d="M12 66 L26 80 L40 66 L26 52 Z" />
              <path d="M92 66 L106 80 L120 66 L106 52 Z" />
            </g>

            {/* A small centred rosette inside the star, the way a real panel
                carries a coloured heart. */}
            <g stroke="#C8882A" strokeWidth="1.1" opacity="0.26">
              <circle cx="66" cy="66" r="11" />
              <circle cx="0" cy="0" r="11" />
              <circle cx="132" cy="0" r="11" />
              <circle cx="0" cy="132" r="11" />
              <circle cx="132" cy="132" r="11" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * The complete ground: warm gradient, zellige field, and a soft wash through
 * the middle so content stays the brightest thing on it.
 *
 * Exists because the two cream sections of the homepage sit directly against
 * each other — the experience chooser and the ticket options — and decorating
 * one of them alone made them look like they came from different sites. One
 * component, used in both, so the whole ticketing block reads as one ground.
 *
 * `fade` softens the tile restart at the seam between two stacked sections.
 */
export function ZelligeGround({ fade = 'none' }: { fade?: 'none' | 'top' | 'bottom' | 'both' }) {
  const mask =
    fade === 'both'
      ? 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)'
      : fade === 'top'
        ? 'linear-gradient(to bottom, transparent, black 14%)'
        : fade === 'bottom'
          ? 'linear-gradient(to bottom, black 86%, transparent)'
          : undefined;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF3E7] via-[#F3E9D6] to-[#FAF3E7]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      >
        <ZelligeField className="h-full w-full" size={132} opacity={0.9} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 62% 46% at 50% 55%, rgba(250,243,231,0.80) 0%, rgba(250,243,231,0.32) 55%, transparent 78%)',
        }}
      />
    </>
  );
}
