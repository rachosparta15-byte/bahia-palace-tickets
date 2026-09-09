/*
 * The geometry of the palace circuit. Words live elsewhere.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT
 * A schematic of sequence and adjacency, not a measured survey. The geometry
 * says "the private apartments lie beyond the great court, and you reach them
 * after the grand riad". It does not say how many metres wide anything is, and
 * the rectangles are not the real footprints. Deverdun published measured
 * plans in 1959; until one of those is licensed and traced, drawing a
 * convincing-looking survey would be inventing evidence, which is the exact
 * failure this codebase spent a day removing. So the drawing is deliberately
 * diagrammatic and the page says so twice.
 *
 * WHY THERE IS NO PROSE HERE
 * The names, descriptions and stories used to sit in this file, which made the
 * diagram untranslatable without forking its geometry. Geometry is identical
 * in every language; prose is not. Each space now carries a `key`, and the
 * page reads palacePlan.s_<key>_name, _summary, _n0.._n2 and _story from the
 * message catalogue and hands the result to the client component as props.
 * That also keeps the whole catalogue out of the browser bundle.
 *
 * The sequence itself is sourced: it is the route described in the site's own
 * room-by-room guide, which follows the signed visitor circuit.
 */

/*
 * How a space is drawn. This is the part the first version got wrong.
 *
 * A Moroccan palace is not a row of solid blocks. It is a set of open
 * courtyards with rooms wrapped around them: the riad IS the garden, and the
 * building is its frame. Drawing every space as a filled rectangle inverted
 * the architecture and produced a flowchart.
 */
export type SpaceKind =
  | 'gate'    // narrow entrance passage
  | 'court'   // open courtyard ringed by a gallery
  | 'garden'  // four-part planted garden
  | 'rooms'   // solid built mass
  | 'cells';  // cluster of small private apartments

export interface Space {
  id: string;
  /** Position in the visitor circuit. */
  n: number;
  /** Catalogue key suffix: palacePlan.s_<key>_name and friends. */
  key: string;
  kind: SpaceKind;
  /** Roughly how long to spend, for the time budget. */
  minutes: [number, number];
  /** Diagram geometry. Arbitrary units, not metres. */
  box: { x: number; y: number; w: number; h: number };
  /** Where the caption sits, so it never lands on the route line. */
  label: { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
}

export const SPACES: Space[] = [
  { id: 'entrance',    n: 1, key: 'entrance',   kind: 'gate',   minutes: [3, 5],
    box: { x: 150, y: 520, w: 100, h: 84 },  label: { x: 264, y: 568, anchor: 'start' } },
  { id: 'small-riad',  n: 2, key: 'smallriad',  kind: 'court',  minutes: [8, 12],
    box: { x: 70,  y: 356, w: 260, h: 150 }, label: { x: 200, y: 340, anchor: 'middle' } },
  { id: 'grand-riad',  n: 3, key: 'grandriad',  kind: 'court',  minutes: [12, 20],
    box: { x: 366, y: 356, w: 300, h: 150 }, label: { x: 516, y: 340, anchor: 'middle' } },
  { id: 'great-court', n: 4, key: 'greatcourt', kind: 'rooms',  minutes: [10, 15],
    box: { x: 366, y: 190, w: 300, h: 132 }, label: { x: 516, y: 174, anchor: 'middle' } },
  { id: 'council',     n: 5, key: 'council',    kind: 'rooms',  minutes: [5, 10],
    box: { x: 700, y: 190, w: 156, h: 132 }, label: { x: 778, y: 174, anchor: 'middle' } },
  { id: 'harem',       n: 6, key: 'harem',      kind: 'cells',  minutes: [12, 18],
    box: { x: 366, y: 40,  w: 300, h: 102 }, label: { x: 516, y: 24,  anchor: 'middle' } },
  { id: 'gardens',     n: 7, key: 'gardens',    kind: 'garden', minutes: [10, 20],
    box: { x: 70,  y: 40,  w: 260, h: 262 }, label: { x: 200, y: 24,  anchor: 'middle' } },
];

/*
 * The visitor route, drawn as orthogonal segments through doorways.
 *
 * The first version joined block centres with straight lines, so every
 * connector cut diagonally across the rooms and the captions landed on top of
 * them. A route through a building turns corners; it does not fly through
 * walls. The council is a spur you walk into and back out of.
 */
export const ROUTE: [number, number][] = [
  [200, 604], [200, 431], [516, 431], [516, 256], [516, 98], [330, 98], [200, 98], [200, 128],
];

/** The council room is entered and left by the same door. */
export const SPUR: [number, number][] = [[516, 256], [778, 256]];

/*
 * Markers sit ON the route but OFF the fountain. In the first render the
 * numbered disc for each courtyard landed exactly on the khatam at its centre
 * and hid it, which threw away the one mark that says "this space is open to
 * the sky". Each courtyard's marker is nudged along its own route segment.
 */
export const STOPS: Record<string, [number, number]> = {
  entrance: [200, 562],
  'small-riad': [200, 470],
  'grand-riad': [430, 431],
  'great-court': [516, 256],
  council: [778, 256],
  harem: [516, 98],
  gardens: [200, 128],
};

export const VIEWBOX = { w: 926, h: 656 };

/** Total dwell time implied by the per-space ranges. */
export function totalMinutes(): [number, number] {
  return SPACES.reduce<[number, number]>(
    ([lo, hi], s) => [lo + s.minutes[0], hi + s.minutes[1]],
    [0, 0],
  );
}

/** Geometry plus the localised words, assembled on the server. */
export interface SpaceCopy extends Space {
  name: string;
  summary: string;
  notice: string[];
  story?: string;
  source?: string;
}

/** Strings the diagram itself needs, passed in rather than looked up. */
export interface PlanChrome {
  diagramLabel: string;
  legendRoute: string;
  legendFountain: string;
  legendRooms: string;
  legendCourt: string;
  schematicNote: string;
  noticeTitle: string;
  storyTitle: string;
  street: string;
  stopOf: (n: number, total: number) => string;
  minutes: (lo: number, hi: number) => string;
  minutesShort: (lo: number, hi: number) => string;
  totalTime: string;
}
