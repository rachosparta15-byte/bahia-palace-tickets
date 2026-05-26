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
      {/* Beaded border */}
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="#C9902A" strokeWidth="0.55" strokeDasharray="2 4" opacity="0.6" />
      {/* Thin inner ring */}
      <circle cx="50" cy="50" r="43" fill="none" stroke="#C9902A" strokeWidth="0.3" opacity="0.4" />

      {/* 8-pointed Islamic star — background */}
      <polygon
        points="50,16 54.9,36.5 73,26 63.5,44.9 84,50 63.5,55.1 73,74 54.9,63.5 50,84 45.1,63.5 27,74 36.5,55.1 16,50 36.5,44.9 27,26 45.1,36.5"
        fill="#B8841A" opacity="0.09"
      />
      <polygon
        points="50,16 54.9,36.5 73,26 63.5,44.9 84,50 63.5,55.1 73,74 54.9,63.5 50,84 45.1,63.5 27,74 36.5,55.1 16,50 36.5,44.9 27,26 45.1,36.5"
        fill="none" stroke="#C9902A" strokeWidth="0.7" strokeLinejoin="round" opacity="0.65"
      />

      {/* Gold dots at 8 star tips */}
      {([
        [50,16],[73,26],[84,50],[73,74],[50,84],[27,74],[16,50],[27,26]
      ] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="1.1" fill="#D4A53D" opacity="0.75" />
      ))}

      {/* ── PALM TREE — central element (all gold) ── */}

      {/* Trunk — slightly curved */}
      <path
        d="M 51.5,83 Q 48,68 50,53"
        stroke="#C9902A" strokeWidth="3.2" strokeLinecap="round" fill="none"
      />

      {/* Palm fronds — filled leaf shapes, gold */}
      {/* Far left drooping */}
      <path d="M 50,53 C 40,53 28,61 22,68 C 25,64 38,54 50,53 Z" fill="#D4A53D" opacity="0.9"/>
      {/* Left mid */}
      <path d="M 50,53 C 44,49 35,47 27,49 C 29,46 42,47 50,53 Z" fill="#D4A53D" opacity="0.9"/>
      {/* Left up */}
      <path d="M 50,53 C 46,47 42,38 38,29 C 41,30 46,40 50,53 Z" fill="#D4A53D" opacity="0.9"/>
      {/* Center up */}
      <path d="M 50,53 C 48,44 48,34 50,24 C 52,34 52,44 50,53 Z" fill="#D4A53D"/>
      {/* Right up */}
      <path d="M 50,53 C 54,47 58,38 62,29 C 59,30 54,40 50,53 Z" fill="#D4A53D" opacity="0.9"/>
      {/* Right mid */}
      <path d="M 50,53 C 56,49 65,47 73,49 C 71,46 58,47 50,53 Z" fill="#D4A53D" opacity="0.9"/>
      {/* Far right drooping */}
      <path d="M 50,53 C 60,53 72,61 78,68 C 75,64 62,54 50,53 Z" fill="#D4A53D" opacity="0.9"/>

      {/* Dates/fruits cluster at crown */}
      <circle cx="50" cy="55" r="2.2" fill="#C4452D" />
      <circle cx="47" cy="54" r="1.6" fill="#E8A33D" />
      <circle cx="53" cy="54" r="1.6" fill="#E8A33D" />
      <circle cx="50" cy="52" r="1.3" fill="#E8A33D" />

      {/* Ground line */}
      <line x1="42" y1="83" x2="60" y2="83" stroke="#D4A53D" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />

      {/* Corner ornament dots */}
      {([
        [18,18],[82,18],[82,82],[18,82]
      ] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="0.85" fill="#D4A53D" opacity="0.35" />
      ))}
    </svg>
  );
}
