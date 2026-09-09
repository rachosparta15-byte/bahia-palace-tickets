'use client';

/*
 * Interactive schematic of the palace circuit.
 *
 * The whole point is that a reader can ask "where am I, and what is next"
 * without a floor plan that pretends to be a survey. So: blocks, connectors,
 * numbers in circuit order, and a panel that fills with the sourced story for
 * whichever space is selected.
 *
 * Accessibility drove several choices here. The diagram is a list of buttons
 * before it is a drawing: every space is focusable, reachable by keyboard, and
 * announces its own name, so the page works read aloud and works on a phone
 * where hovering does not exist. Selection is never conveyed by colour alone —
 * the selected block also thickens its outline and its list row gains a
 * marker.
 */

import { useState } from 'react';
import { SPACES, CONNECTORS, VIEWBOX, totalMinutes, type Space } from '@/lib/history/plan';
import { SOURCES } from '@/lib/history/facts';

const centre = (s: Space) => ({ x: s.box.x + s.box.w / 2, y: s.box.y + s.box.h / 2 });
const byId = (id: string) => SPACES.find(s => s.id === id)!;

export function PalacePlan() {
  const [activeId, setActiveId] = useState<string>(SPACES[0].id);
  const active = byId(activeId);
  const [lo, hi] = totalMinutes();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 items-start">

      {/* ── The diagram ─────────────────────────────────────────────── */}
      <div>
        <svg
          viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
          className="w-full h-auto rounded-2xl bg-[#211609] border border-[rgba(232,163,61,0.15)]"
          role="group"
          aria-label="Schematic plan of Bahia Palace showing seven spaces in visitor order"
        >
          {/* Connectors first so blocks paint over their ends. */}
          <g stroke="rgba(232,163,61,0.45)" strokeWidth={3} strokeLinecap="round">
            {CONNECTORS.map(([a, b]) => {
              const p = centre(byId(a));
              const q = centre(byId(b));
              return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
            })}
          </g>

          {SPACES.map(s => {
            const on = s.id === activeId;
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
                <rect
                  x={s.box.x} y={s.box.y} width={s.box.w} height={s.box.h} rx={10}
                  fill={on ? 'rgba(196,69,45,0.28)' : 'rgba(245,232,204,0.05)'}
                  stroke={on ? '#E8A33D' : 'rgba(232,163,61,0.35)'}
                  strokeWidth={on ? 3.5 : 1.5}
                />
                {/* Sequence badge */}
                <circle
                  cx={s.box.x + 22} cy={s.box.y + 22} r={13}
                  fill={on ? '#C4452D' : 'rgba(232,163,61,0.22)'}
                />
                <text
                  x={s.box.x + 22} y={s.box.y + 27} textAnchor="middle"
                  fontSize={14} fontWeight={700}
                  fill={on ? '#fff' : '#E8A33D'}
                >{s.n}</text>
                <text
                  x={s.box.x + s.box.w / 2} y={s.box.y + s.box.h / 2 + 6}
                  textAnchor="middle" fontSize={17} fontWeight={600}
                  fill={on ? '#F5E8CC' : '#C4A882'}
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >{s.name}</text>
              </g>
            );
          })}

          {/* The street is context, not a space you visit. */}
          <text x={160} y={614} textAnchor="middle" fontSize={12} fill="#8C7355">
            Rue Riad Zitoun el Jedid
          </text>
        </svg>

        <p className="text-xs text-[#8C7355] mt-3 leading-relaxed">
          Schematic, not a survey. The blocks show the order you meet the spaces and which ones adjoin;
          they are not drawn to scale and the proportions are not the real footprints.
        </p>
      </div>

      {/* ── The panel ───────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-6">
        <div className="bg-[#251A0F] border border-[rgba(232,163,61,0.15)] rounded-2xl p-6">
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <span className="text-[#E8A33D] text-xs font-bold uppercase tracking-widest">
              Stop {active.n} of {SPACES.length}
            </span>
            <span className="text-xs text-[#C4A882]">
              {active.minutes[0]}–{active.minutes[1]} min
            </span>
          </div>
          <h3
            className="text-[#F5E8CC] font-bold mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem' }}
          >{active.name}</h3>

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

        {/* The list is the diagram's accessible twin, and the phone-friendly one. */}
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
