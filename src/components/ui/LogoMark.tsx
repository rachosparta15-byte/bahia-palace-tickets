interface Props {
  className?: string;
}

/**
 * Bahia Palace brand mark — Moroccan 8-pointed star enclosing a horseshoe arch.
 * Used in Header, Footer, and AdminSidebar.
 */
export function LogoMark({ className = 'w-12 h-12' }: Props) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* ── Background ── */}
      <circle cx="28" cy="28" r="27.5" fill="#1A0C05" />

      {/* ── Outer gold ring ── */}
      <circle cx="28" cy="28" r="26.2" fill="none" stroke="#C9902A" strokeWidth="0.9" />
      {/* Thin inner ring */}
      <circle cx="28" cy="28" r="23.2" fill="none" stroke="#C9902A" strokeWidth="0.25" opacity="0.45" />

      {/* ── 8-pointed Moroccan star ──
           outer R=15 (center 28,28), inner r=6
           outer points at -90°+k×45°, inner at -67.5°+k×45° */}
      <polygon
        points="
          28,13       30.22,22.64
          37.9,18.1   33.36,25.78
          43,28        33.36,30.22
          37.9,37.9   30.22,33.36
          28,43        25.78,33.36
          18.1,37.9   22.64,30.22
          13,28        22.64,25.78
          18.1,18.1   25.78,22.64"
        fill="#C9902A"
        opacity="0.07"
      />
      <polygon
        points="
          28,13       30.22,22.64
          37.9,18.1   33.36,25.78
          43,28        33.36,30.22
          37.9,37.9   30.22,33.36
          28,43        25.78,33.36
          18.1,37.9   22.64,30.22
          13,28        22.64,25.78
          18.1,18.1   25.78,22.64"
        fill="none"
        stroke="#C9902A"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />

      {/* ── Horseshoe arch (Moorish gate)
           Center of arc at (28,33), R=8.5
           Columns meet arc at y≈37.8 (below spring line → horseshoe effect)
           Arc peak at (28, 24.5) ── */}

      {/* Outer arch + columns */}
      <path
        d="M 21,46 L 21,38 A 8.5,8.5 0 0,1 35,38 L 35,46"
        stroke="#D4A53D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner arch echo (depth) */}
      <path
        d="M 23,46 L 23,39 A 6,6 0 0,1 33,39 L 33,46"
        stroke="#D4A53D"
        strokeWidth="0.35"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Column capitals */}
      <line x1="19.5" y1="38" x2="22.5" y2="38" stroke="#D4A53D" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="33.5" y1="38" x2="36.5" y2="38" stroke="#D4A53D" strokeWidth="1.1" strokeLinecap="round" />
      {/* Column bases */}
      <line x1="19.5" y1="43.5" x2="22.5" y2="43.5" stroke="#D4A53D" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="33.5" y1="43.5" x2="36.5" y2="43.5" stroke="#D4A53D" strokeWidth="1.1" strokeLinecap="round" />

      {/* Base plinth */}
      <line x1="17.5" y1="46" x2="38.5" y2="46" stroke="#D4A53D" strokeWidth="1.3" strokeLinecap="round" />

      {/* ── Keystone rosette at arch peak (28, 24.5) ── */}
      <circle cx="28" cy="24.5" r="3.5"  fill="#1A0C05" />
      <circle cx="28" cy="24.5" r="3.0"  fill="none" stroke="#C4452D" strokeWidth="0.8" />
      <circle cx="28" cy="24.5" r="1.6"  fill="#C4452D" />
      <circle cx="28" cy="24.5" r="0.75" fill="#D4A53D" />

      {/* ── 4 cardinal dots (outside the star, inside the outer ring) ── */}
      <circle cx="28" cy="5"  r="0.9" fill="#D4A53D" opacity="0.65" />
      <circle cx="51" cy="28" r="0.9" fill="#D4A53D" opacity="0.65" />
      <circle cx="28" cy="51" r="0.9" fill="#D4A53D" opacity="0.65" />
      <circle cx="5"  cy="28" r="0.9" fill="#D4A53D" opacity="0.65" />

      {/* ── 4 diagonal small diamonds ── */}
      <circle cx="10" cy="10" r="0.6" fill="#D4A53D" opacity="0.3" />
      <circle cx="46" cy="10" r="0.6" fill="#D4A53D" opacity="0.3" />
      <circle cx="46" cy="46" r="0.6" fill="#D4A53D" opacity="0.3" />
      <circle cx="10" cy="46" r="0.6" fill="#D4A53D" opacity="0.3" />
    </svg>
  );
}
