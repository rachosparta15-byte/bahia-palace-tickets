'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Ticket, QrCode } from 'lucide-react';
import { DatePicker } from '@/components/ui/DatePicker';
import { daysUntil, todayISO } from '@/config/booking-partners';
import { setChosenDate } from '@/config/chosen-date';

/*
 * Pick the day, then buy — in the hero, where the two secondary buttons were.
 *
 * ── WHY A DATE BELONGS ON THE FIRST SCREEN ──
 *
 * The visitor this page is built for is already in Marrakech and means to go
 * today or tomorrow. The date is the first thing they know and the last thing
 * the site asked them. Asking here turns one generic CTA into a question they
 * can answer, and it is the answer that decides which marketplace can actually
 * sell them a ticket — see booking-partners.ts for the whole story.
 *
 * ── ONE BUTTON, NOT TWO ──
 *
 * Get Tickets stays the single CTA and becomes the confirm step for the date.
 * The hero was carrying four buttons a moment ago and got none of them pressed;
 * adding a second one beside the calendar would put it straight back.
 *
 * ── DEFAULTING TO TODAY ──
 *
 * Deliberate, and it is a claim: it says "you can go today", which is true
 * during opening hours and is what most of this traffic wants to hear. An empty
 * field would make the visitor do work before they see a price.
 *
 * The picker's own minimum is today too, so a past date cannot be chosen and
 * the partner logic never sees one.
 */

/*
 * BOTH CONTROLS BELOW CARRY min-h-[3.25rem]. Keep them the same.
 *
 * Written out twice on purpose. A shared constant interpolated into the class
 * string is the obvious way to say it once — and Tailwind never sees it:
 * classes are found by scanning the source text, so a name assembled at
 * runtime is simply never generated and the rule silently does nothing. The
 * duplication is the price of the class existing at all.
 *
 * The number itself is the button's natural height with its own padding. The
 * complaint that prompted it was 46px against 51px — a gap small enough to
 * read as a bug rather than a decision.
 */
export type HeroBookingStrings = {
  /** Accessible name for the date field, e.g. "Visit date". */
  field: string;
  /** The question above it — "When are you visiting?" */
  prompt: string;
  today: string;
  tomorrow: string;
  previousMonth: string;
  nextMonth: string;
  /** The CTA, reused from the button this replaces. */
  cta: string;
  /** "Tickets for {when}" — the label that repeats the date back. */
  ctaFor: string;
  /** The flat alternative, for comparing the two. */
  checkAvailability: string;
  /** today/tomorrow as they read mid-sentence, not as button labels. */
  whenToday: string;
  whenTomorrow: string;
};

/**
 * Which CTA wording to render.
 *
 * Here as a constant rather than a prop because it is a question to be
 * settled by measurement, not configured per page: every Viator click
 * already carries a campaign, so changing this one word and reading the
 * numbers two weeks later answers it properly.
 *
 *   'date'  Tickets for today / for 3 Oct — repeats the visitor's choice
 *   'check' Check availability — the pattern every OTA uses beside a picker
 *   'get'   Get Tickets — what the button said before there was a date
 */
const CTA_STYLE: 'date' | 'check' | 'get' = 'date';

export function HeroBooking({
  locale,
  strings,
}: {
  locale: string;
  strings: HeroBookingStrings;
}) {
  /*
   * Initialised once from the browser's clock, not the server's.
   *
   * The page is served from cache, so a server-rendered "today" would be
   * whatever day the build ran — which after midnight is yesterday, and
   * yesterday is a date this component refuses to book.
   */
  const [date, setDate] = useState(() => todayISO());

  /*
   * Published on every change rather than only when the button is pressed.
   *
   * The cards a screen below react to the date, and a visitor who scrolls past
   * this block without touching the button should still see them agree with
   * the calendar. Pressing the button then confirms a state they can already
   * see rather than causing it.
   */
  const choose = (iso: string) => {
    setDate(iso);
    setChosenDate(iso);
  };

  /*
   * Publish the default on mount, not only on a change.
   *
   * The field opens on today, and that is a statement — the button beside it
   * reads "Tickets for today". Without this the cards a screen below know
   * nothing, so the hero offered today while the cards offered the one
   * marketplace that cannot serve it. The page contradicted itself for every
   * visitor who did not happen to touch the calendar.
   *
   * Runs once. A visitor who then picks a date goes through `choose`.
   */
  useEffect(() => {
    setChosenDate(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * No partner is chosen here any more.
   *
   * It was, while this button led straight out to Viator. Now that it moves
   * the visitor down to the four options instead, the marketplace is decided
   * by the card they pick. TicketCards and TicketOptions each read the date
   * this component publishes and route their own skip-the-line link. Choosing
   * a partner here as well would put the decision in three places and let them
   * disagree.
   */

  /*
   * "today", "tomorrow", or a short date.
   *
   * Short on purpose — "3 Oct", not "Saturday 3 October 2026". The field
   * beside this already spells the day out in full, and a button that grows
   * and shrinks as the visitor scrolls through months reads as unstable.
   *
   * today and tomorrow have their own lowercase forms here. The picker's are
   * standalone button labels and capitalised — "Tickets for Today" reads as a
   * typo, and lowercasing in code would be wrong for any language that
   * capitalises the word for its own reasons.
   */
  const days = daysUntil(date);
  const when =
    days === 0
      ? strings.whenToday
      : days === 1
        ? strings.whenTomorrow
        : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(
            new Date(`${date}T12:00:00`),
          );

  const label =
    CTA_STYLE === 'date'
      ? strings.ctaFor.replace('{when}', when)
      : CTA_STYLE === 'check'
        ? strings.checkAvailability
        : strings.cta;

  return (
    /*
     * items-end, so the button's bottom edge lines up with the field's —
     * the field now carries a label above it, and stretching would have made
     * the button as tall as label plus field.
     *
     * The date field came out 46px against the button's 51 — close enough to
     * look like a mistake rather than a choice, which is worse than a large
     * difference. Matching them with a fixed height would mean copying a
     * number out of the button's padding and waiting for one of them to
     * change; stretching makes the row itself the single source of the
     * height, whatever either side is padded with.
     *
     * Both carry the same minimum height instead, so they match whether they
     * sit side by side or stack on a phone.
     *
     * The selector is `> div > button`: the picker wraps its trigger in a
     * relative div, so the trigger is a grandchild, not a child. `> button`
     * matched nothing and the field quietly stayed 46px against the button's
     * 52 — the same mismatch this was written to remove. A descendant `button` would have caught every
     * day cell in the open calendar as well and stretched the whole grid.
     *
     * The alternative was a height prop on DatePicker, which the checkout
     * shares — a shared component should not grow an option for one caller's
     * layout.
     */
    <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-end">
      <div className="w-full sm:w-auto sm:min-w-[15rem]">
        {/*
          * A question, not a caption.
          *
          * This was "VISIT DATE" in small uppercase — the field named, and
          * nothing asked. Above a box already showing today, it read as a
          * label on something settled, so visitors passed over it. The field
          * is the one thing on this screen we need them to touch: it decides
          * which marketplace can sell them a ticket at all.
          *
          * So it asks, at a size worth reading, and the chevron on the field
          * says the box opens. Between them the visitor is told there is an
          * answer to give and where to give it.
          *
          * aria-hidden because the trigger below already carries "Visit date"
          * as its accessible name; a screen reader would otherwise hear the
          * field announced twice.
          */}
        <span
          className="mb-1.5 block text-sm font-semibold text-[#F5E8CC]"
          aria-hidden="true"
        >
          {strings.prompt}
        </span>
        <div className="relative [&>div>button]:min-h-[3.25rem] [&>div>button]:pe-10">
          {/*
            * Placed over the trigger rather than inside it: DatePicker is
            * shared with the checkout, and a chevron is this hero's need, not
            * that form's. pointer-events-none so the click still lands on the
            * button underneath.
            */}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute end-3 top-1/2 z-10 -translate-y-1/2 text-[#E8A33D]"
          />
        <DatePicker
          value={date}
          onChange={choose}
          min={todayISO()}
          locale={locale}
          labels={{
            field: strings.field,
            today: strings.today,
            tomorrow: strings.tomorrow,
            previousMonth: strings.previousMonth,
            nextMonth: strings.nextMonth,
          }}
          />
        </div>
      </div>

      {/*
        * Down to the ticket options, NOT straight out to the marketplace.
        *
        * This briefly sent the visitor directly to the Viator product page,
        * which skipped the one screen where the site does its own work:
        * four options, side by side, with prices and what each includes.
        * Sending somebody who has just named a date straight to one product
        * throws away the comparison and the three other things they might
        * have bought.
        *
        * So the button confirms the date and moves them one step down the
        * page. The partner hand-off happens from the card they choose.
        *
        * The date is remembered for that next step — see rememberDate.
        *
        * Same ring and same id as the button this replaces: StickyMobileCTA
        * watches #ticket-book-btn to decide whether to show the mobile bar,
        * and losing the id would leave that bar on screen permanently.
        */}
      <div className="spin-ring inline-block rounded-lg">
        <a
          href="#ticket-options"
          id="ticket-book-btn"
          onClick={() => setChosenDate(date)}
          className="btn-primary relative min-h-[3.25rem] w-full justify-center text-sm sm:w-auto sm:text-base"
        >
          <Ticket size={18} aria-hidden="true" />
          {label}
          <QrCode size={16} aria-hidden="true" className="opacity-80" />
        </a>
      </div>
    </div>
  );
}
