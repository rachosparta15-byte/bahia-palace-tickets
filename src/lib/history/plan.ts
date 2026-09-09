/*
 * The spaces of Bahia Palace, in the order a visitor meets them.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT
 * This is a schematic of sequence and adjacency, not a measured survey. The
 * geometry below says "the harem lies beyond the great court, and you reach it
 * after the grand riad". It does not say how many metres wide anything is, and
 * the rectangles are not the real footprints. Deverdun published measured
 * plans in 1959; until one of those is licensed and traced, drawing a
 * convincing-looking survey would be inventing evidence, which is the exact
 * failure this codebase spent a day removing.
 *
 * So the drawing is deliberately diagrammatic — blocks and connectors, no
 * fake wall thicknesses, no scale bar — and the page says so in as many words.
 * A reader can trust it for orientation and must not cite it for dimensions.
 *
 * The sequence itself is sourced: it is the route described in the site's own
 * room-by-room guide, which follows the signed visitor circuit.
 *
 * RULE: no number enters this file that is not already in facts.ts. The "1,500
 * square metres" and "24 concubines" that circulate for these rooms have no
 * scholarly source, so they are described in words here rather than asserted
 * as measurements.
 */

import type { SourceKey } from './facts';

export interface Space {
  id: string;
  /** Position in the visitor circuit. */
  n: number;
  name: string;
  /** Roughly how long to spend, for the time budget. */
  minutes: [number, number];
  /** One line: what this space is. */
  summary: string;
  /** What rewards a slower look. */
  notice: string[];
  /** The history that belongs to this room rather than to the building. */
  story?: string;
  /** Source for the story, when it makes a historical claim. */
  ref?: SourceKey;
  /** Diagram geometry. Arbitrary units, not metres. */
  box: { x: number; y: number; w: number; h: number };
}

export const SPACES: Space[] = [
  {
    id: 'entrance',
    n: 1,
    name: 'Main entrance',
    minutes: [3, 5],
    summary:
      'Heavy studded doors on Rue Riad Zitoun el Jedid, opening into a narrow, dim corridor.',
    notice: [
      'The ironwork studs and carved frame of the gate itself, which most visitors walk straight past.',
      'The first painted ceiling panel is directly above you in the corridor.',
      'The darkness is deliberate. It makes the first courtyard feel larger than it is.',
    ],
    box: { x: 60, y: 520, w: 200, h: 80 },
  },
  {
    id: 'small-riad',
    n: 2,
    name: 'The small riad',
    minutes: [8, 12],
    summary:
      'The older, quieter courtyard. This is the house before it became a palace.',
    notice: [
      'The proportions are domestic, not ceremonial. These rooms were lived in.',
      'The plasterwork is plainer than what comes later, and the floor zellige is in unusually good condition.',
      'Hold this scale in mind. The contrast with the next courtyard is the sharpest architectural moment in the palace.',
    ],
    story:
      'This is Si Moussa’s building. The two chambers flanking the garden carry an inscription dating them to 1866-67, the earliest firm date anywhere on the site. Everything grander was added by his son thirty years later.',
    ref: 'deverdun',
    box: { x: 60, y: 330, w: 200, h: 150 },
  },
  {
    id: 'grand-riad',
    n: 3,
    name: 'The grand riad',
    minutes: [12, 20],
    summary:
      'The centrepiece: a wide courtyard garden ringed by a painted wooden gallery on columns.',
    notice: [
      'Every panel of the gallery ceiling is different. Look at four in a row and you will see no pattern repeats.',
      'Crouch. The floor zellige takes on depth at a low angle that it does not have from standing height.',
      'The marble. It was imported, and it was meant to be noticed.',
    ],
    story:
      'The marble courtyard carries its own inscription, dated 1896-97, in the middle of Ba Ahmed’s six years as the effective ruler of Morocco. He assembled the ground for all of this by absorbing the plots of some sixty neighbouring houses.',
    ref: 'deverdun',
    box: { x: 290, y: 330, w: 280, h: 150 },
  },
  {
    id: 'great-court',
    n: 4,
    name: 'The great court',
    minutes: [10, 15],
    summary:
      'The formal reception sequence, where petitioners and foreign envoys were received.',
    notice: [
      'Bands of carved Quranic calligraphy run high on the walls, above where anyone naturally looks.',
      'The gebs plasterwork is at its finest here, carved so thin it reads as lace.',
      'Notice how far into the complex a visitor had to be admitted to stand here. That was the point.',
    ],
    story:
      'Ba Ahmed held power from these rooms as grand vizier and regent between 1894 and 1900. Foreign governments dealt with him rather than with the young sultan in whose name he governed.',
    ref: 'deverdun',
    box: { x: 290, y: 190, w: 280, h: 120 },
  },
  {
    id: 'council',
    n: 5,
    name: 'The council room',
    minutes: [5, 10],
    summary: 'The most densely painted ceiling in the palace, above an empty floor.',
    notice: [
      'Stand underneath it, not in the doorway. The composition only resolves from directly below.',
      'The blues and reds are mineral pigment and have barely shifted in over a century.',
      'The emptiness is not neglect. It is the event.',
    ],
    story:
      'When Ba Ahmed died on 17 May 1900, Sultan Abdelaziz reportedly ordered the palace stripped of its valuables and the household turned out. The ceilings, floors and plaster survived for one reason: they could not be carried away.',
    ref: 'deverdun',
    box: { x: 600, y: 190, w: 160, h: 120 },
  },
  {
    id: 'harem',
    n: 6,
    name: 'The private apartments',
    minutes: [12, 18],
    summary:
      'Living quarters arranged as a hierarchy, with rank measured in distance from the grand riad.',
    notice: [
      'The scale drops from ceremonial to human. These were rooms, not stages.',
      'Painted tile dados survive in several rooms, and their complexity varies with the status of who lived there.',
      'The mashrabiya lattices let the women see out without being seen. Privacy and control in the same screen.',
    ],
    story:
      'Rooms nearest the grand riad were the most prestigious. The plan itself records who mattered, which makes this the one part of the palace where the architecture is legible as a social document.',
    box: { x: 290, y: 60, w: 280, h: 110 },
  },
  {
    id: 'gardens',
    n: 7,
    name: 'The gardens',
    minutes: [10, 20],
    summary:
      'Orange, lemon, cypress, jasmine and rose, laid out on a central axis around water.',
    notice: [
      'The four planting beds follow the traditional four-part Islamic garden scheme.',
      'March and April are when the jasmine and roses carry.',
      'Sit for a quarter of an hour. The medina noise drops away and the palace becomes a different building.',
    ],
    story:
      'The palace proper covers nearly two hectares. The eight-hectare figure quoted everywhere includes the agdal, the walled orchard-garden that the grounds were built around.',
    ref: 'minculture',
    box: { x: 60, y: 60, w: 200, h: 250 },
  },
];

/** Drawn between space centres, in circuit order. */
export const CONNECTORS: [string, string][] = [
  ['entrance', 'small-riad'],
  ['small-riad', 'grand-riad'],
  ['grand-riad', 'great-court'],
  ['great-court', 'council'],
  ['great-court', 'harem'],
  ['harem', 'gardens'],
];

export const VIEWBOX = { w: 820, h: 620 };

/** Total dwell time implied by the per-space ranges. */
export function totalMinutes(): [number, number] {
  return SPACES.reduce<[number, number]>(
    ([lo, hi], s) => [lo + s.minutes[0], hi + s.minutes[1]],
    [0, 0],
  );
}
