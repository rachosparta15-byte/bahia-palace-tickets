'use client';

/*
 * Interactive schematic of the palace circuit.
 *
 * WHY THIS WAS REDRAWN
 * The first version drew every space as a filled rectangle and joined their
 * centres with straight lines. Two things were wrong with that, one visual and
 * one architectural.
 *
 * Visually it read as a flowchart: connectors cut diagonally through the
 * blocks and the captions sat on top of them.
 *
 * Architecturally it was backwards. A Moroccan palace is organised around open
 * courtyards — the riad IS the garden and the building is the frame around it.
 * Drawing the courtyards as solid mass inverted the one thing about this
 * building a plan exists to show. So courts are now voids inside a gallery,
 * the garden carries the four-part division it actually has, rooms are solid,
 * and the apartments read as the row of small cells they are. The route turns
 * corners through doorways instead of flying through walls.
 *
 * The eight-pointed khatam at the centre of each court is the motif in the
 * zellige underfoot, which is why it is the fountain marker rather than a
 * generic dot.
 *
 * Accessibility drove the rest. The diagram is a list of buttons before it is
 * a drawing: every space is focusable and keyboard-reachable, and selection is
 * never carried by colour alone — the selected space also thickens its
 * outline, raises its fill, and its list row gains a marker.
 */

import { useState } from 'react';
import {
  SPACES, ROUTE, SPUR, STOPS, VIEWBOX, totalMinutes, type Space,
} from '@/lib/history/plan';
import { SOURCES } from '@/lib/history/facts';

const byId = (id: string) => SPACES.find(s => s.id === id)!;
const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${x},${y}`).join(' ');

/** Eight-pointed khatam: the star the zellige is built from. */
function star(cx: number, cy: number, R: number) {
  const r = R * 0.54;
  return Array.from({ length: 16 }, (_, i) => {
    const rad = (Math.PI / 8) * i - Math.PI / 2;
    const d = i % 2 === 0 ? R : r;
    return `${(cx + d * Math.cos(rad)).toFixed(1)},${(cy + d * Math.sin(rad)).toFixed(1)}`;
  }).join(' ');
}

/** Evenly spaced column marks along one edge of the gallery. */
function columns(x: number, y: number, w: number, h: number, gap = 26) {
  const out: { x: number; y: number }[] = [];
  for (let i = x + gap; i < x + w - gap / 2; i += gap) { out.push({ x: i, y }); out.push({ x: i, y: y + h }); }
  for (let j = y + gap; j < y + h - gap / 2; j += gap) { out.push({ x, y: j }); out.push({ x: x + w, y: j }); }
  return out;
}

function SpaceShape({ s, on }: { s: Space; on: boolean }) {
  const { x, y, w, h } = s.box;
  const wall = on ? '#E8A33D' : 'rgba(232,163,61,0.42)';
  const mass = on ? 'rgba(196,69,45,0.30)' : 'rgba(245,232,204,0.055)';
  const voidF = on ? 'rgba(28,17,8,0.55)' : 'rgba(18,11,5,0.5)';
  const ink = on ? '#E8A33D' : 'rgba(232,163,61,0.5)';

  // A courtyard: built frame, open middle, colonnade, fountain.
  if (s.kind === 'court' || s.kind === 'garden') {
    const inset = s.kind === 'garden' ? 16 : 22;
    const ix = x + inset, iy = y + inset, iw = w - inset * 2, ih = h - inset * 2;
    return (
      <>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={mass} stroke={wall} strokeWidth={on ? 3 : 1.6} />
        <rect x={ix} y={iy} width={iw} height={ih} rx={4} fill={voidF} stroke={ink} strokeWidth={1} />
        {s.kind === 'court' && columns(ix, iy, iw, ih).map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={2.4} fill={ink} />
        ))}
        {s.kind === 'garden' && (
          <>
            {/* The four-part scheme: two axes crossing at the water. */}
            <line x1={ix + iw / 2} y1={iy} x2={ix + iw / 2} y2={iy + ih} stroke={ink} strokeWidth={1} />
            <line x1={ix} y1={iy + ih / 2} x2={ix + iw} y2={iy + ih / 2} stroke={ink} strokeWidth={1} />
            {[0.25, 0.75].flatMap(px => [0.25, 0.75].map(py => (
              <circle key={`${px}-${py}`} cx={ix + iw * px} cy={iy + ih * py} r={9}
                fill="none" stroke={ink} strokeWidth={1} strokeDasharray="2 3" />
            )))}
          </>
        )}
        <polygon points={star(x + w / 2, y + h / 2, s.kind === 'garden' ? 11 : 13)}
          fill={on ? '#E8A33D' : 'rgba(232,163,61,0.55)'} />
      </>
    );
  }

  // Private apartments: a row of small cells off a shared wall.
  if (s.kind === 'cells') {
    const n = 5, cw = w / n;
    return (
      <>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={mass} stroke={wall} strokeWidth={on ? 3 : 1.6} />
        {Array.from({ length: n - 1 }, (_, i) => (
          <line key={i} x1={x + cw * (i + 1)} y1={y + 10} x2={x + cw * (i + 1)} y2={y + h - 10}
            stroke={ink} strokeWidth={1} />
        ))}
        {Array.from({ length: n }, (_, i) => (
          <circle key={i} cx={x + cw * (i + 0.5)} cy={y + h - 20} r={3} fill={ink} />
        ))}
      </>
    );
  }

  // Built mass: hatched, because you walk through rooms here, not open air.
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={mass} stroke={wall} strokeWidth={on ? 3 : 1.6} />
      <rect x={x} y={y} width={w} height={h} rx={8} fill={`url(#hatch${on ? '-on' : ''})`} />
      {s.kind === 'gate' && (
        <path d={`M ${x + w / 2 - 16} ${y + h} v -22 a 16 16 0 0 1 32 0 v 22`}
          fill="none" stroke={ink} strokeWidth={1.6} />
      )}
    </>
  );
}

export function PalacePlan() {
  const [activeId, setActiveId] = useState<string>(SPACES[0].id);
  const active = byId(activeId);
  const [lo, hi] = totalMinutes();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8 items-start">

      {/* ── The drawing ─────────────────────────────────────────────── */}
      <div>
        <svg
          viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
          className="w-full h-auto rounded-2xl"
          style={{ background: 'radial-gradient(120% 90% at 50% 0%, #241708 0%, #1A1006 70%)' }}
          role="group"
          aria-label="Schematic plan of Bahia Palace showing seven spaces in visitor order"
        >
          <defs>
            <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(232,163,61,0.16)" strokeWidth="1" />
            </pattern>
            <pattern id="hatch-on" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(232,163,61,0.34)" strokeWidth="1.2" />
            </pattern>
          </defs>

          {/* Outer wall: the palace is a walled compound before it is anything else. */}
          <rect x={38} y={20} width={VIEWBOX.w - 76} height={VIEWBOX.h - 76} rx={14}
            fill="none" stroke="rgba(232,163,61,0.16)" strokeWidth={1.5} strokeDasharray="7 6" />

          {/* Route under the blocks so it reads as floor, not as wiring. */}
          <polyline points={poly(ROUTE)} fill="none" stroke="rgba(196,69,45,0.85)"
            strokeWidth={2.5} strokeDasharray="7 6" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={poly(SPUR)} fill="none" stroke="rgba(196,69,45,0.55)"
            strokeWidth={2} strokeDasharray="4 6" strokeLinecap="round" />

          {SPACES.map(s => {
            const on = s.id === activeId;
            const [sx, sy] = STOPS[s.id];
            return (
              <g
                key={s.id}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${s.n}. ${s.name}`}
                className="cursor-pointer outline-none"
                onClick={() => setActiveId(s.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(s.id); }
                }}
              >
                <SpaceShape s={s} on={on} />
                {/* Caption sits outside the footprint, clear of the route. */}
                <text
                  x={s.label.x} y={s.label.y} textAnchor={s.label.anchor}
                  fontSize={17} fontWeight={600}
                  fill={on ? '#F5E8CC' : '#B39770'}
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >{s.name}</text>
                {/* Numbered stop, on the route itself. */}
                <circle cx={sx} cy={sy} r={14}
                  fill={on ? '#C4452D' : '#2A1B0C'} stroke={on ? '#F5E8CC' : 'rgba(232,163,61,0.6)'} strokeWidth={1.6} />
                <text x={sx} y={sy + 5} textAnchor="middle" fontSize={14} fontWeight={700}
                  fill={on ? '#fff' : '#E8A33D'}>{s.n}</text>
              </g>
            );
          })}

          <text x={200} y={640} textAnchor="middle" fontSize={12} fill="#8C7355">
            Rue Riad Zitoun el Jedid
          </text>
        </svg>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[11px] text-[#8C7355]">
          <span className="inline-flex items-center gap-1.5">
            <svg width="20" height="8" aria-hidden><line x1="0" y1="4" x2="20" y2="4" stroke="rgba(196,69,45,0.85)" strokeWidth="2.5" strokeDasharray="7 6" /></svg>
            visitor route
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><polygon points={star(6, 6, 5.5)} fill="rgba(232,163,61,0.7)" /></svg>
            fountain
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden><rect width="14" height="10" fill="url(#hatch)" stroke="rgba(232,163,61,0.42)" /></svg>
            roofed rooms
          </span>
          <span>open courtyard = void inside its gallery</span>
        </div>

        <p className="text-xs text-[#8C7355] mt-3 leading-relaxed">
          Schematic, not a survey. It is accurate about the order you meet the spaces and which ones
          adjoin. The blocks are not drawn to scale and their proportions are not the real footprints.
        </p>
      </div>

      {/* ── The panel ───────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-6">
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6">
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <span className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest">
              Stop {active.n} of {SPACES.length}
            </span>
            <span className="text-xs text-[#C4A882]">{active.minutes[0]}–{active.minutes[1]} min</span>
          </div>
          <h3 className="text-[#F5E8CC] font-bold mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem' }}>{active.name}</h3>

          <p className="text-sm text-[#C4A882] leading-relaxed mb-4">{active.summary}</p>

          <h4 className="text-[#F5E8CC] font-semibold text-sm mb-2">What rewards a slower look</h4>
          <ul className="space-y-2 mb-4">
            {active.notice.map(n => (
              <li key={n} className="text-sm text-[#C4A882] leading-relaxed ps-4 relative">
                <span className="absolute start-0 top-2 w-1.5 h-1.5 rounded-full bg-[#C4452D]" />
                {n}
              </li>
            ))}
          </ul>

          {active.story && (
            <div className="border-t border-[rgba(232,163,61,0.15)] pt-4">
              <h4 className="text-[#F5E8CC] font-semibold text-sm mb-2">What happened here</h4>
              <p className="text-sm text-[#C4A882] leading-relaxed">{active.story}</p>
              {active.ref && (
                <p className="text-[11px] text-[#8C7355] mt-2.5">{SOURCES[active.ref].citation}</p>
              )}
            </div>
          )}
        </div>

        {/* The diagram's accessible twin, and the one that works on a phone. */}
        <ol className="mt-4 space-y-1">
          {SPACES.map(s => {
            const on = s.id === activeId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  aria-current={on ? 'true' : undefined}
                  className={`w-full text-start flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    on ? 'bg-[#2E1F12] text-[#F5E8CC]' : 'text-[#C4A882] hover:bg-[#251A0F]'
                  }`}
                >
                  <span className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-bold ${
                    on ? 'bg-[#C4452D] text-white' : 'bg-[rgba(232,163,61,0.18)] text-[#E8A33D]'
                  }`}>{s.n}</span>
                  <span className="text-sm flex-1">{s.name}</span>
                  {on && <span aria-hidden className="text-[#E8A33D] text-xs">●</span>}
                  <span className="text-xs text-[#8C7355]">{s.minutes[0]}–{s.minutes[1]}m</span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="text-xs text-[#8C7355] mt-4 px-3">
          Walking the full circuit at this pace: <strong className="text-[#C4A882]">{lo} to {hi} minutes</strong>.
        </p>
      </div>
    </div>
  );
}
