# Design direction — visitbahiapalace.com

Written before any code, per premium-web-design §17.

---

## What the inspection found

**Structure.** Sixteen sections. Hero → story → stats → highlights → practical
bar → trust strip → tickets → tickets again → why book ahead → why book us →
reviews → blog → FAQ → scam banner → nearby → final CTA. Four of those exist
because websites usually have them, not because this page needs them.

**Photography — the decisive finding.** All 37 gallery photographs are
**portrait**. Twenty at 9:16, seventeen at 3:4. Not one landscape frame in the
set. Every card on this site crops a tall photograph into a wide box and throws
away two thirds of it.

**Brand.** Playfair Display and Cormorant Garamond are already loaded and
barely used. The palette has warm ivory, terracotta, saffron, deep brown — a
good palette, spent across 103 hex values.

**Audience.** People who have already decided to visit Marrakech and are
working out how to get into this palace without wasting an hour at a window.
They are not browsing for inspiration. They want to know what it costs and what
they get.

**The visual problem, in one line.** The page is a stack of card grids in
eleven different browns, and the photographs — its strongest asset — are being
cropped into the weakest possible shape.

---

## 1. Visual concept

**Courtyard and room.**

The experience of the Bahia is a sequence: you cross a courtyard in hard
sunlight, pass through an arch, and are suddenly in a cool dark room with a
painted cedar ceiling. Then another arch, another courtyard. Light, shade,
light, shade.

The page is built on that alternation, and on the proportion the building
actually has — **tall openings**. Everything vertical is a doorway; everything
horizontal is a wall.

## 2. Emotional experience

Arriving somewhere considered. The visitor should feel they are being walked
through the palace by someone who knows it, not sold to by a booking site. The
commercial moment should feel like being shown four doors, not four products.

## 3. Typography direction

**Cormorant Garamond** for display — it has the high contrast and narrow
proportion of carved inscription, and it is already loaded and unused.
**DM Sans** for everything else, small and quiet.

The contrast between them must be extreme: a 5rem Cormorant headline against
0.8rem DM Sans is the point. Nothing in between. No mid-sized headings.

Numbers — prices, dates, the year 1866 — set in Cormorant at display size.
A price is the most looked-at figure on the page; it should be beautiful.

## 4. Colour direction

Five values, from §2 of DESIGN.md, no additions:

```
--ground        #251A0F   the dark room
--ground-deep   #160D06   the deepest shade
--ground-cream  #FAF3E7   the sunlit courtyard
--ink-on-dark   #F5E8CC
--brass         #C8882A   aged metal, not yellow
--terracotta    #C4452D   one paid action per view
```

Brass is a **line and a number**, never a fill larger than a word.

## 5. Layout strategy

- **Alternate ground every major section.** Dark room, light courtyard, dark
  room. The change of temperature is the section break; no other divider is
  needed.
- **Break the grid at the tickets.** Four tall panels, unequal widths, sitting
  on one baseline like an architectural elevation.
- **Full-bleed photography** wherever the photograph is the subject.
- Text columns never exceed 62ch and are never centred except a section title.

## 6. Image strategy

**Stop cropping portraits into landscapes.**

- Ticket panels: **3:4 and 9:16 at full height** — the photograph's own shape.
- Editorial rows: tall crop on one side, text on the other.
- Detail shots (zellige, plaster, cedar) used as **texture at large scale**,
  not as thumbnails.
- No two adjacent images share a crop ratio.

## 7. Ticket section concept — **The Four Doors**

Not cards. Not a grid.

Four **full-height vertical panels**, edge to edge, no gaps and no rounded
corners — the way four doorways sit in a courtyard wall. Each panel is one
portrait photograph running its full height, darkening toward the base.

At the base of each panel, in the shadow: the price in Cormorant at display
size, the name beneath it, and a single brass rule that extends on hover.

The widths are **unequal** — the cheapest and most-booked option is wider than
the others, because a wall of four identical openings is a grid again, and
because that is the one most visitors want.

No buttons inside the panels. The whole panel is the target. One terracotta
action lives beneath the row for anyone who wants an explicit button.

Scannability is preserved: four prices, four names, four inclusions, in one
horizontal read.

## 8. The memorable moment

**The wall of doors.** A full-bleed row of four tall lit openings in a dark
wall, with the prices set like inscriptions at their base. It is the only
place on the page where photography runs floor to ceiling, and it lands exactly
where the visitor decides.

Nothing else on the page is allowed to look like it.

---

## What this does not touch

Viator links, affiliate disclosure, LeadButton, the pack logic, prices, the
payments guard, and every string in the seven locale files. This is
composition, type, colour and crop. The functionality underneath is unchanged.
