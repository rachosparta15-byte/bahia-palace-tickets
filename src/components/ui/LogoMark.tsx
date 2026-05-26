interface Props {
  className?: string;
}

export function LogoMark({ className = 'w-12 h-12' }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background — deep Majorelle blue */}
      <circle cx="50" cy="50" r="49.5" fill="#0D1A3D" />

      {/* Outer gold ring */}
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="#C9902A" strokeWidth="1.6" />
      {/* Beaded inner border */}
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="#C9902A" strokeWidth="0.55" strokeDasharray="2 4" opacity="0.6" />
      {/* Thin inner ring */}
      <circle cx="50" cy="50" r="43" fill="none" stroke="#C9902A" strokeWidth="0.3" opacity="0.4" />

      {/* 8-pointed Islamic star — R=34 r=14 center(50,50) */}
      <polygon
        points="50,16 54.9,36.5 73.0,26.0 63.5,44.9 84,50 63.5,55.1 73.0,74.0 54.9,63.5 50,84 45.1,63.5 27.0,74.0 36.5,55.1 16,50 36.5,44.9 27.0,26.0 45.1,36.5"
        fill="#B8841A" opacity="0.1"
      />
      <polygon
        points="50,16 54.9,36.5 73.0,26.0 63.5,44.9 84,50 63.5,55.1 73.0,74.0 54.9,63.5 50,84 45.1,63.5 27.0,74.0 36.5,55.1 16,50 36.5,44.9 27.0,26.0 45.1,36.5"
        fill="none" stroke="#C9902A" strokeWidth="0.75" strokeLinejoin="round" opacity="0.7"
      />

      {/* Small 4-pointed diamonds at 8 star tips */}
      {[
        [50,16],[73,26],[84,50],[73,74],[50,84],[27,74],[16,50],[27,26]
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="1.1" fill="#D4A53D" opacity="0.7" />
      ))}

      {/* ── Crescent moon (Moroccan symbol) at upper arch ── */}
      {/* Large circle minus offset circle = crescent */}
      <path
        d="M 50,26 A 7,7 0 1,1 50,40 A 5,5 0 1,0 50,26 Z"
        fill="#C9902A" opacity="0.75"
      />
      {/* 5-pointed star beside crescent */}
      <polygon
        points="63,29 64,32 67,32 64.5,34 65.5,37 63,35.5 60.5,37 61.5,34 59,32 62,32"
        fill="#C9902A" opacity="0.65"
        transform="scale(0.6) translate(45,18)"
      />

      {/* ── Horseshoe arch (Bahia Palace gate) ── */}
      {/* Outer arch + columns */}
      <path
        d="M 37,85 L 37,65 A 14.5,14.5 0 0,1 63,65 L 63,85"
        stroke="#D4A53D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Inner arch echo — depth */}
      <path
        d="M 41,85 L 41,67.5 A 10,10 0 0,1 59,67.5 L 59,85"
        stroke="#D4A53D" strokeWidth="0.45" fill="none" opacity="0.4"
      />

      {/* Column capitals */}
      <line x1="33.5" y1="65" x2="40" y2="65" stroke="#D4A53D" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="60" y1="65" x2="66.5" y2="65" stroke="#D4A53D" strokeWidth="1.6" strokeLinecap="round" />
      {/* Column mid bands */}
      <line x1="33.5" y1="76" x2="40" y2="76" stroke="#D4A53D" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="60" y1="76" x2="66.5" y2="76" stroke="#D4A53D" strokeWidth="1.2" strokeLinecap="round" />
      {/* Base plinth */}
      <line x1="31" y1="85" x2="69" y2="85" stroke="#D4A53D" strokeWidth="2.2" strokeLinecap="round" />

      {/* Keystone rosette at arch apex */}
      <circle cx="50" cy="50" r="5.5" fill="#0D1A3D" />
      <circle cx="50" cy="50" r="4.8" fill="none" stroke="#C4452D" strokeWidth="1" />
      <circle cx="50" cy="50" r="2.8" fill="#C4452D" />
      <circle cx="50" cy="50" r="1.2" fill="#D4A53D" />

      {/* Corner ornament dots */}
      {[
        [18,18],[82,18],[82,82],[18,82]
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="0.9" fill="#D4A53D" opacity="0.35" />
      ))}
    </svg>
  );
}
