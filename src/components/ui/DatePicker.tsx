'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';

/**
 * Visit-date picker for the checkout.
 *
 * WHY NOT `<input type="date">`: the native control renders as an empty
 * "mm/dd/yyyy" in the browser's own locale and chrome — on this dark palette
 * it read as a broken text field, it showed US month-first order to French
 * and German visitors, and its calendar cannot be styled at all. For the one
 * field where picking the wrong value costs the customer real money (a wrong
 * visit date is non-refundable once the QR ships — Terms §5 and §7), it is
 * worth owning the interaction.
 *
 * The value is still an ISO `YYYY-MM-DD` string, so the form, the API and
 * the database see exactly what they saw before.
 *
 * DATES ARE LOCAL, NOT UTC. Everything here is built from local Y/M/D parts
 * rather than `toISOString()`, which converts to UTC first — for a visitor
 * east of Greenwich that turns "today" into yesterday, and the min-date rule
 * would then reject the very day they are standing in Marrakech on.
 */

export interface DatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  /** Earliest selectable day, ISO. Defaults to today. */
  min?: string;
  /** BCP-47 tag, for month, weekday and date formatting. */
  locale: string;
  labels: {
    /** Accessible name for the trigger, e.g. "Visit date". */
    field: string;
    today: string;
    tomorrow: string;
    previousMonth: string;
    nextMonth: string;
  };
  id?: string;
  invalid?: boolean;
}

/** Local calendar date as YYYY-MM-DD. Never round-trips through UTC. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

/** Parse YYYY-MM-DD as a LOCAL midnight date. `new Date(iso)` would be UTC. */
function fromISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/**
 * The cells for one month: leading blanks so the 1st lands on the right
 * weekday, then one entry per day.
 */
function monthCells(month: Date, weekStartsOn: number): Array<Date | null> {
  const offset = firstWeekdayOffset(month, weekStartsOn);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = Array.from({ length: offset }, () => null);
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  return cells;
}

/**
 * Weekday index of the first cell, so the grid starts on the locale's first
 * day of the week — Monday across our five locales, not Sunday.
 */
function firstWeekdayOffset(monthStart: Date, weekStartsOn: number): number {
  return (monthStart.getDay() - weekStartsOn + 7) % 7;
}

export function DatePicker({
  value,
  onChange,
  min,
  locale,
  labels,
  id,
  invalid,
}: DatePickerProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const minDate = useMemo(() => fromISODate(min ?? toISODate(today)) ?? today, [min, today]);
  const selected = useMemo(() => fromISODate(value), [value]);

  // Which month the grid is showing.
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfMonth(selected ?? minDate)
  );

  /**
   * Jump to the selected date's month, then open.
   *
   * Done here rather than in an effect watching `selected`: an effect would
   * fire on every value change including the user's own click inside the
   * grid, which is a cascading render the React compiler rejects — and it
   * would also yank the view back mid-browse. Opening is the only moment
   * the month should be recomputed.
   */
  function openPanel() {
    setViewMonth(startOfMonth(selected ?? minDate));
    setOpen(true);
  }

  // Close on outside click and on Escape. Without this the panel stays open
  // behind the rest of the form and swallows taps on mobile.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const weekStartsOn = 1; // Monday — correct for en-GB, fr, de, it, es.

  /**
   * Two months at once: the one being viewed and the one after it.
   *
   * A single month hides the answer to the most common question at this step —
   * "which days am I actually in Marrakech?" — whenever the trip straddles a
   * month end. Someone landing on the 28th saw four selectable days and had to
   * discover the arrow to find the rest. Two panes make the next four weeks
   * visible without any interaction at all.
   */
  const months = useMemo(() => [viewMonth, addMonths(viewMonth, 1)], [viewMonth]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale]
  );

  // Weekday initials straight from Intl, so we never ship a translation table.
  const weekdayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // 2024-01-01 was a Monday; walk seven days from the locale's week start.
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(addDays(monday, (i + weekStartsOn - 1 + 7) % 7))
    );
  }, [locale]);

  const selectedLabel = useMemo(() => {
    if (!selected) return null;
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(selected);
  }, [locale, selected]);

  const isDisabled = (d: Date) => d < minDate;
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  function pick(d: Date) {
    if (isDisabled(d)) return;
    onChange(toISODate(d));
    setOpen(false);
  }

  const canGoBack = startOfMonth(viewMonth) > startOfMonth(minDate);

  const quickPicks = [
    { label: labels.today, date: today },
    { label: labels.tomorrow, date: addDays(today, 1) },
  ].filter((q) => !isDisabled(q.date));

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger. A real button, not a styled div, so it is focusable and
          announced correctly; the selected date is part of its label so a
          screen reader hears the current value without opening the panel. */}
      <button
        type="button"
        id={fieldId}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={selectedLabel ? `${labels.field}: ${selectedLabel}` : labels.field}
        className={`flex w-full items-center gap-3 rounded-lg border bg-[#2E1F12] px-4 py-3 text-start transition-colors focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 ${
          invalid
            ? 'border-[#C4452D]'
            : 'border-[rgba(232,163,61,0.20)] hover:border-[rgba(232,163,61,0.45)]'
        }`}
      >
        <Calendar size={16} className="shrink-0 text-[#E8A33D]" aria-hidden="true" />
        <span className={`text-sm ${selectedLabel ? 'text-[#F5E8CC]' : 'text-[#C4A882]/60'}`}>
          {selectedLabel ?? labels.field}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={labels.field}
          className="absolute left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-[rgba(232,163,61,0.25)] bg-[#251A0F] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.55)] sm:right-auto sm:max-h-none sm:w-[min(34rem,calc(100vw-3rem))] sm:overflow-visible"
        >
          {/* Month navigation. The arrows move the pair, so "next" goes from
              [Aug, Sep] to [Sep, Oct] rather than sliding a single pane. */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              disabled={!canGoBack}
              aria-label={labels.previousMonth}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#C4A882] transition-colors hover:bg-[#2E1F12] hover:text-[#E8A33D] disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft size={16} />
            </button>
            {/* One live region for the pair, so a screen reader announces the
                range once per navigation instead of twice. */}
            <span aria-live="polite" className="sr-only">
              {months.map((m) => monthFormatter.format(m)).join(' – ')}
            </span>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              aria-label={labels.nextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#C4A882] transition-colors hover:bg-[#2E1F12] hover:text-[#E8A33D]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Stacked on a phone (the panel scrolls), side by side from sm up. */}
          <div className="mt-1 grid grid-cols-1 gap-5 sm:mt-0 sm:grid-cols-2 sm:gap-6">
            {months.map((month) => (
              <div key={month.getTime()}>
                <p className="text-center text-sm font-semibold capitalize text-[#F5E8CC]">
                  {monthFormatter.format(month)}
                </p>

                {/* Weekday header — repeated per pane so each grid is readable
                    on its own once they stack. */}
                <div className="mt-3 grid grid-cols-7 gap-1">
                  {weekdayNames.map((w) => (
                    <span
                      key={w}
                      aria-hidden="true"
                      className="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[#C4A882]/60"
                    >
                      {w.slice(0, 2)}
                    </span>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1">
                  {monthCells(month, weekStartsOn).map((d, i) => {
                    if (!d) return <span key={`pad-${month.getTime()}-${i}`} />;
                    const disabled = isDisabled(d);
                    const isSelected = selected ? isSameDay(d, selected) : false;
                    const isToday = isSameDay(d, today);
                    return (
                      <button
                        key={d.getTime()}
                        type="button"
                        onClick={() => pick(d)}
                        disabled={disabled}
                        aria-pressed={isSelected}
                        aria-label={new Intl.DateTimeFormat(locale, {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        }).format(d)}
                        // 40px tall: below about 44px, thumbs start hitting the
                        // neighbouring day on a phone, and this grid is dense.
                        className={`flex h-10 items-center justify-center rounded-lg text-sm transition-colors ${
                          isSelected
                            ? 'bg-[#C4452D] font-semibold text-white'
                            : disabled
                              ? 'cursor-not-allowed text-[#C4A882]/20'
                              : isToday
                                ? 'text-[#E8A33D] ring-1 ring-inset ring-[#E8A33D]/40 hover:bg-[#2E1F12]'
                                : 'text-[#F5E8CC] hover:bg-[#2E1F12]'
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Shortcuts for the two dates most people actually want. */}
          {quickPicks.length > 0 && (
            <div className="mt-3 flex gap-2 border-t border-[rgba(232,163,61,0.15)] pt-3">
              {quickPicks.map((q) => {
                const active = selected ? isSameDay(q.date, selected) : false;
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => pick(q.date)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'bg-[#C4452D] text-white'
                        : 'border border-[rgba(232,163,61,0.25)] text-[#C4A882] hover:border-[#E8A33D] hover:text-[#E8A33D]'
                    }`}
                  >
                    {active && <Check size={12} aria-hidden="true" />}
                    {q.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
