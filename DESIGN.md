# DESIGN.md — visitbahiapalace.com

One ground, one ink, one shape. Written because the site currently has 103.

---

## 0. Why this file exists

Measured on `src/` before writing a line of it:

| | Found | Should be |
|---|---|---|
| Unique hex colours | **103** | ~10 |
| Distinct dark browns | **42** | **1** ground + 1 deeper |
| Distinct light tones | **16** | **1** ground + 1 raised |
| `rounded-*` values | **8** | **1** + pill |
| Dark background bands on the homepage | 11, in 5 different browns | one brown |

Nothing on this page is ugly on its own. The page is a patchwork because every
section decided its own colour and its own corner in isolation, and eleven
sections making eleven local decisions produce eleven slightly different
browns. A visitor does not see eleven decisions; they see a site that looks
unfinished.

This file makes those decisions once.

---

## 1. Visual Theme & Atmosphere

**A Moroccan palace interior: dark, warm, and covered in worked surface.**

The Bahia is cedar, plaster and zellige in low light — deep browns with gold
catching the edges. The site is dark for the same reason the palace is: it is
the ground the ornament and the photographs sit on, and both need it.

Two grounds only. A deep brown that carries most of the page, and a single
cream block at the moment money is discussed, so the commercial section is the
one place that changes temperature. That change is the page's only structural
break and it should stay that way.

Ornament is zellige geometry, drawn large enough to see. A pattern too faint to
notice is not restraint, it is waste — and this site's subject is a building
covered floor to ceiling in the stuff.

**Key characteristics:**
- One dark ground and one cream ground. No third, no near-misses.
- The cream block marks the ticketing zone and nothing else.
- Zellige at a scale you can read, on both grounds.
- Photographs are the brightest thing in any section they appear in.
- Seven locales including Arabic — every rule must survive RTL.

---

## 2. Color Palette & Roles

Ten colours. Anything not on this list is a bug.

### Grounds

| Token | Value | Role — the only role |
|---|---|---|
| `--ground` | `#251A0F` | **The** dark ground. Every dark section. |
| `--ground-deep` | `#160D06` | Footer and the hero's base only. |
| `--ground-cream` | `#FAF3E7` | **The** light ground. The ticketing block only. |
| `--surface` | `#2E1F12` | Raised on dark: cards, hover states. |

`#1C1108`, `#2A1A0E`, `#3D2817`-as-a-background and the other 38 darks are
**deleted**. They are the patchwork.

### Ink

| Token | Value | Role |
|---|---|---|
| `--ink-on-dark` | `#F5E8CC` | All body text and headings on dark. |
| `--ink-on-dark-soft` | `rgba(245,232,204,0.66)` | Secondary text on dark. |
| `--ink-on-cream` | `#3D2817` | All text on cream. |
| `--ink-on-cream-soft` | `#5C3D20` | Secondary text on cream. |

### Accent

| Token | Value | Role |
|---|---|---|
| `--accent` | `#E8A33D` | Saffron. Links, eyebrows, ornament, active state. |
| `--cta` | `#C4452D` | Terracotta. **Buttons that take money, and nothing else.** |

`--cta` is rationed on purpose: if terracotta appears on a newsletter field and
on the ticket button, the ticket button stops being the loudest thing on the
page. One terracotta button per view.

`#2E4A7B`, `#F0F7FF` and the other blues are from a component that does not
belong to this palette. Replace, do not extend.

---

## 3. Typography Rules

```
Section title   var(--font-heading)  clamp(1.75rem, 3.5vw, 2.75rem)
Card title      var(--font-heading)  0.95–1rem
Body            system sans          0.875rem   line-height 1.7   max 68ch
Small / note    system sans          0.68rem
Eyebrow         system sans          0.68rem  uppercase  tracking 0.18em
```

- Body measure never exceeds **68 characters** on either ground.
- Uppercase is for eyebrows only, always in `--accent`.
- **No text effects.** No gradient text, no glow, no shadow on type.
- Headings on cream are `--ink-on-cream`; on dark they are `--ink-on-dark`.
  There is no third heading colour.

---

## 4. Component Stylings

### One card

Every card on the site is this card:

```
image (16:10, flush to the card edge)
   price or eyebrow over a bottom scrim, if there is one
body on --surface
   title, then one action line in --accent
```

Radius `rounded-xl`. One border: `1px rgba(196,168,130,0.45)` on cream,
`rgba(245,232,204,0.14)` on dark. One shadow, and only on cream.

`rounded-lg` and `rounded-2xl` are **deleted** — 97 and 89 uses of two corners
nobody can tell apart from the one we keep.

### Buttons

Pill (`rounded-full`), uppercase, `0.12em` tracking.
Primary is `--cta` fill. Secondary is a 1px `--accent` border on nothing.
**Two buttons maximum in any view, one of them terracotta.**

### The zellige ground

`ZelligeGround` — gradient, star field, centre wash. Used on the cream
ticketing block as one continuous surface across both its sections. On dark it
uses the same geometry in `--accent` at lower strength.

Ornament is a **ground**, never a decoration floating in a gap.

### Section edges

A section fades to the ground of the section that actually follows it. Fading
to a colour that is not there paints a band — which is exactly what
TicketCards did against TicketOptions.

---

## 5. Layout Principles

- Container `max-w-5xl` for text-led sections, `max-w-6xl` for card grids.
- Section padding `py-16`.
- **The page has one temperature change**: dark → cream at the ticketing
  block → dark. Not two, not five.
- No section repeats the previous section's shape. If two adjacent sections
  render the same object, one of them is wrong.
- Photographs run to the edge of whatever holds them.

---

## 6. Depth & Elevation

- On dark: elevation is `--surface`, or a 1px hairline. **Never a shadow** —
  a shadow on a dark ground is invisible and costs a repaint.
- On cream: one shadow, `0 2px 10px rgba(61,40,23,0.10)`, lifting to
  `0 10px 28px rgba(61,40,23,0.20)` on hover.
- No blur, no glass, no glow.

---

## 7. Do's and Don'ts

### Do
- **Do** use `#251A0F` for every dark section, without exception.
- **Do** keep the cream block to the ticketing zone.
- **Do** use `rounded-xl` for every card and `rounded-full` for every button.
- **Do** draw ornament large enough to see, or leave it out.
- **Do** give both cream sections the same ground component.
- **Do** fade a section edge to the colour of the section that follows it.
- **Do** hold body text to 68 characters.
- **Do** use logical properties — `border-s`, `ps-*`, `ms-*` — so Arabic works.

### Don't
- **Don't** introduce a new brown. There are 42 and that is the whole problem.
- **Don't** use `rounded-lg` or `rounded-2xl`.
- **Don't** put `--cta` terracotta on anything that is not a paid action.
- **Don't** put a shadow on a dark ground.
- **Don't** apply an ornament so faint it cannot be seen — it costs the same
  and buys nothing.
- **Don't** decorate one of two adjacent sections and leave the other bare.
- **Don't** use physical `border-l` / `pl-*` where the layout mirrors in RTL.
- **Don't** let a section pick its own background because it looks fine alone.

---

## 8. Responsive Behavior

- Card grids: 2 across on a phone, 4 from `md`.
- The zellige tile stays 132px at every width; it is a wall, not a layout.
- Media in a split panel goes full-bleed on top when the panel stacks.
- **RTL:** rules, padding and the photo scrim all mirror. CSS gradients have no
  logical direction, so any directional gradient needs an explicit `rtl:`
  variant. Test `/ar` before calling a layout change done.
- Touch targets 44px minimum.

---

## 9. Agent Prompt Guide

1. **Read §7 before writing CSS.**
2. **Screenshot the whole page, not the section you changed.** Every defect in
   this file was invisible from inside one component and obvious in a full-page
   capture.
3. Sample the ground colour of every band before and after a change. Five
   browns are not visible to the eye one at a time; they are obvious in a list.
4. Load a section by its `id` anchor to force lazy images, or a below-the-fold
   photograph reads as an empty box.
5. Where this file and the code disagree, the code changes.

### Migration — what is not yet true

Nothing below has been done. This is the work list, in the order that gives the
most back per change:

| # | Change | Scale |
|---|---|---|
| 1 | Every dark section background → `#251A0F` | ~11 components |
| 2 | `rounded-lg` and `rounded-2xl` → `rounded-xl` | 186 uses |
| 3 | Delete the blues (`#2E4A7B`, `#F0F7FF`) | 35 uses |
| 4 | Shadows on dark grounds → `--surface` or hairline | audit needed |
| 5 | Collapse the 16 light tones to `--ground-cream` + `--surface` | ~30 uses |
| 6 | Restrict `--cta` terracotta to paid actions | audit needed |

Done already, and consistent with this file: the ticketing block's shared
zellige ground, the ticket card shape, and the WhyBookAhead panel.
