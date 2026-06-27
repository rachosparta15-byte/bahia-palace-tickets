export function ZelligePattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {/* 8-point star — Islamic geometric motif */}
      <g opacity="0.30" stroke="currentColor" strokeWidth="1">
        <polygon points="60,10 70,35 95,35 75,52 83,77 60,62 37,77 45,52 25,35 50,35" />
        <circle cx="60" cy="60" r="20" />
        <polygon points="60,20 66,42 90,42 72,55 79,77 60,65 41,77 48,55 30,42 54,42" />
      </g>
    </svg>
  );
}

export function OrnamentDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 text-[#E8A33D] my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/40 to-transparent" />
      <ZelligePattern className="w-8 h-8 text-[#E8A33D]" />
      {label && <span className="text-sm font-medium text-[#C4A882] whitespace-nowrap">{label}</span>}
      <ZelligePattern className="w-8 h-8 text-[#E8A33D]" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8A33D]/40 to-transparent" />
    </div>
  );
}
