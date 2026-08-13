import prisma from '@/lib/db';
import { MousePointerClick, Eye, PenLine, Send, CreditCard, CheckCircle2, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * What happens after someone presses "Get tickets".
 *
 * Search Console showed clicks arriving and the Leads page showed nothing, and
 * there was no way to tell which of a dozen explanations was the true one. The
 * old funnel — modal_open, lead_submit — measures a flow that no longer runs:
 * once PAYMENTS_ENABLED went true, LeadButton stopped opening the lead modal
 * and started routing straight to /visitor-pack, so no Lead row is created by
 * design. "No leads" was never the symptom. The symptom is that nothing
 * measured the checkout.
 *
 * So this page follows one person through six steps, and the gap between two
 * adjacent numbers is the answer to a different question:
 *
 *   clicked  -> reached   the button, the routing, the page load
 *   reached  -> started   the page: price, layout, first impression
 *   started  -> submitted the form: fields, validation, length
 *   submitted-> payable   our API refusing them, with the reason
 *   payable  -> paid      the card step
 *
 * Counted by DISTINCT VISITOR, never by event. One person pressing three CTAs
 * is one person deciding to buy, and counting the presses would show a funnel
 * losing 66% of its traffic at the first step for no reason.
 */

const WINDOWS = { '24h': 1, '7d': 7, '30d': 30, all: 0 } as const;
type WindowKey = keyof typeof WINDOWS;

/** The funnel, in order. Each name is fired by exactly one place in the app. */
const STEPS = [
  { key: 'ticket_cta_click', label: 'Pressed “Get tickets”', icon: MousePointerClick, hint: 'Any ticket CTA, anywhere on the site' },
  { key: 'pack_view', label: 'Reached the checkout', icon: Eye, hint: '/visitor-pack actually loaded for them' },
  { key: 'pack_form_start', label: 'Started filling it', icon: PenLine, hint: 'Touched a field' },
  { key: 'pack_submit', label: 'Submitted the form', icon: Send, hint: 'Passed validation and pressed the button' },
  { key: 'pack_payment_ready', label: 'Reached payment', icon: CreditCard, hint: 'Card fields mounted' },
  { key: 'pack_paid', label: 'Paid', icon: CheckCircle2, hint: 'Server confirmed the capture' },
] as const;

interface Props {
  searchParams: Promise<{ w?: string }>;
}

function since(days: number): Date | undefined {
  return days > 0 ? new Date(Date.now() - days * 86_400_000) : undefined;
}

function readMeta(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function ago(d: Date): string {
  const m = (Date.now() - d.getTime()) / 60000;
  if (m < 1) return 'just now';
  if (m < 60) return `${Math.round(m)}m ago`;
  if (m < 48 * 60) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 1440)}d ago`;
}

export default async function AdminClicksPage({ searchParams }: Props) {
  const { w } = await searchParams;
  const windowKey: WindowKey = (w && w in WINDOWS ? w : '7d') as WindowKey;
  const gte = since(WINDOWS[windowKey]);

  /*
   * One query, then all the arithmetic in memory.
   *
   * Event only ever holds these named events — page views live in their own
   * table — so the window is small enough that six grouped queries would cost
   * more round trips than they save, and having every row here is what makes
   * the per-visitor journeys below possible at all.
   */
  const events = await prisma.event.findMany({
    where: {
      ...(gte ? { createdAt: { gte } } : {}),
      name: {
        in: [
          ...STEPS.map((s) => s.key),
          'pack_blocked',
          'pack_pay_failed',
          'pack_card_fields',
          // The old lead-modal flow. Still counted so that if payments are
          // ever switched off, this page keeps telling the truth instead of
          // showing an empty funnel.
          'modal_open',
          'lead_submit',
        ],
      },
    },
    select: { name: true, visitorId: true, metadata: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    // A ceiling so a busy month cannot make the admin time out. Ordered
    // newest-first, so hitting it loses the oldest rows in the window rather
    // than a random slice.
    take: 20000,
  });

  const visitorsByStep = new Map<string, Set<string>>();
  for (const e of events) {
    if (!visitorsByStep.has(e.name)) visitorsByStep.set(e.name, new Set());
    visitorsByStep.get(e.name)!.add(e.visitorId);
  }
  const countOf = (name: string) => visitorsByStep.get(name)?.size ?? 0;

  const funnel = STEPS.map((step, i) => {
    const n = countOf(step.key);
    const prev = i === 0 ? n : countOf(STEPS[i - 1].key);
    const lost = Math.max(0, prev - n);
    return { ...step, n, lost, lostPct: prev > 0 ? Math.round((lost / prev) * 100) : 0, first: i === 0 };
  });

  /* Why people were stopped, in our own words. This is the actionable list:
     every row here is a person our own code turned away, with the reason it
     used, and most of them are ours to fix. */
  const blockedReasons = new Map<string, number>();
  for (const e of events) {
    if (e.name !== 'pack_blocked' && e.name !== 'pack_pay_failed') continue;
    const reason = String(readMeta(e.metadata).reason ?? 'unknown');
    const key = `${e.name === 'pack_pay_failed' ? 'payment' : 'checkout'}: ${reason}`;
    blockedReasons.set(key, (blockedReasons.get(key) ?? 0) + 1);
  }
  const blocked = [...blockedReasons.entries()].sort((a, b) => b[1] - a[1]);

  /* Which button gets pressed. A CTA nobody presses and a CTA everyone
     presses that converts nobody are different problems. */
  const byLocation = new Map<string, Set<string>>();
  for (const e of events) {
    if (e.name !== 'ticket_cta_click') continue;
    const loc = String(readMeta(e.metadata).cta_location ?? 'unknown');
    if (!byLocation.has(loc)) byLocation.set(loc, new Set());
    byLocation.get(loc)!.add(e.visitorId);
  }
  const locations = [...byLocation.entries()]
    .map(([loc, set]) => ({ loc, n: set.size }))
    .sort((a, b) => b.n - a.n);

  /*
   * The last twenty people, each as the sequence they actually performed.
   *
   * The aggregate says where the drop-off is; this says what it looks like.
   * "clicked, and nothing else" twenty times over is a routing fault. "clicked,
   * reached, started, stopped" twenty times over is the form.
   */
  const journeys: { visitorId: string; at: Date; steps: string[] }[] = [];
  const seen = new Set<string>();
  for (const e of events) {
    if (seen.has(e.visitorId)) continue;
    seen.add(e.visitorId);
    const theirs = events
      .filter((x) => x.visitorId === e.visitorId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    journeys.push({
      visitorId: e.visitorId,
      at: theirs[theirs.length - 1].createdAt,
      steps: theirs.map((x) => x.name),
    });
    if (journeys.length >= 20) break;
  }

  const paid = countOf('pack_paid');
  const clicked = countOf('ticket_cta_click');

  /*
   * Whether card payers can type their card here, or are handed to PayPal.
   *
   * PayPal only lets the fields be embedded when Advanced (Expanded) Checkout
   * is switched on for the account. When it is not, the black "Debit or Credit
   * Card" button opens PayPal's own hosted page instead — the customer leaves
   * the site at the moment they decided to buy, which the checkout is built
   * from top to bottom to avoid. It is an account setting, not code, so this
   * says which of the two is happening rather than trying to fix it.
   */
  const cardFieldsEvents = events.filter((e) => e.name === 'pack_card_fields');
  const cardFieldsOff = cardFieldsEvents.some((e) => readMeta(e.metadata).eligible === false);
  const cardFieldsOn = cardFieldsEvents.some((e) => readMeta(e.metadata).eligible === true);

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[#F5E8CC]">Clicks</h1>
        <p className="mt-1 text-sm text-[#C4A882] max-w-2xl leading-relaxed">
          Every press of a ticket button, and what became of it. Counted by person, not by press —
          one visitor pressing three CTAs is one visitor deciding to buy.
        </p>
      </header>

      <nav className="mb-6 flex gap-2 text-sm">
        {(Object.keys(WINDOWS) as WindowKey[]).map((k) => (
          <a
            key={k}
            href={`/admin/clicks?w=${k}`}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              k === windowKey
                ? 'bg-[#C4452D] border-[#C4452D] text-white'
                : 'border-[rgba(232,163,61,0.25)] text-[#C4A882] hover:border-[#E8A33D]'
            }`}
          >
            {k === 'all' ? 'All time' : k}
          </a>
        ))}
      </nav>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[rgba(232,163,61,0.3)] p-10 text-center">
          <p className="font-semibold text-[#F5E8CC]">Nothing recorded in this window</p>
          <p className="mt-2 text-sm text-[#C4A882] max-w-md mx-auto leading-relaxed">
            Either nobody pressed a ticket button, or the tracking has not reached the live site
            yet. Everything below the first row is new — it will stay empty until someone visits
            after this deploy.
          </p>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <ol className="space-y-2">
              {funnel.map((s) => {
                const Icon = s.icon;
                const width = clicked > 0 ? Math.max(4, Math.round((s.n / clicked) * 100)) : 0;
                return (
                  <li key={s.key} className="rounded-xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F] p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0 text-[#E8A33D]" />
                      <span className="text-sm font-medium text-[#F5E8CC]">{s.label}</span>
                      <span className="ml-auto text-xl font-semibold tabular-nums text-[#F5E8CC]">{s.n}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#1B120A] overflow-hidden">
                      <div className="h-full rounded-full bg-[#E8A33D]" style={{ width: `${width}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[#C4A882]">
                      {s.hint}
                      {!s.first && s.lost > 0 && (
                        <span className="text-[#C4452D]"> · {s.lost} lost here ({s.lostPct}%)</span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 text-xs text-[#C4A882]">
              {clicked === 0
                ? 'No ticket button was pressed in this window.'
                : `${paid} of ${clicked} who pressed a ticket button paid.`}
            </p>
          </section>

          {cardFieldsOff && !cardFieldsOn && (
            <section className="mb-8">
              <div className="rounded-xl border border-[#C4452D]/50 bg-[#2A1710] p-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#F5E8CC]">
                  <AlertTriangle className="w-4 h-4 text-[#C4452D]" /> Card payers are being sent to
                  PayPal
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#C4A882] max-w-2xl">
                  PayPal reported that embedded card fields are not available on this account, so
                  the checkout falls back to the black “Debit or Credit Card” button — which opens
                  PayPal’s own hosted page. Anyone paying by card leaves the site at the moment they
                  decided to buy, and the ones without a PayPal account have to find the card option
                  on someone else’s screen.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#C4A882] max-w-2xl">
                  This is an account setting, not code: switch on{' '}
                  <strong className="text-[#F5E8CC]">
                    Advanced (Expanded) Credit and Debit Card Payments
                  </strong>{' '}
                  in the PayPal business account. The fields appear here by themselves once it is
                  on.
                </p>
              </div>
            </section>
          )}

          {blocked.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-[#F5E8CC]">
                <AlertTriangle className="w-4 h-4 text-[#C4452D]" /> Stopped by us
              </h2>
              <p className="mb-3 text-xs text-[#C4A882] max-w-2xl leading-relaxed">
                People our own code turned away, with the reason it gave. The customer saw one
                sentence for all of these; the code below is which fault it actually was.
              </p>
              <ul className="rounded-xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F] divide-y divide-[rgba(232,163,61,0.1)]">
                {blocked.map(([reason, n]) => (
                  <li key={reason} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="font-mono text-xs text-[#C4A882]">{reason}</span>
                    <span className="tabular-nums text-[#F5E8CC]">{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {locations.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold text-[#F5E8CC]">Which button they pressed</h2>
              <ul className="rounded-xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F] divide-y divide-[rgba(232,163,61,0.1)]">
                {locations.map((l) => (
                  <li key={l.loc} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-[#C4A882]">{l.loc}</span>
                    <span className="tabular-nums text-[#F5E8CC]">{l.n}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-1 text-sm font-semibold text-[#F5E8CC]">The last 20 people, one line each</h2>
            <p className="mb-3 text-xs text-[#C4A882] max-w-2xl leading-relaxed">
              The chart says where they stop. This says what stopping looks like — twenty rows
              reading “clicked” and nothing else is a routing fault, twenty reading “clicked,
              reached, started” is the form.
            </p>
            <ul className="rounded-xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F] divide-y divide-[rgba(232,163,61,0.1)]">
              {journeys.map((j) => (
                <li key={j.visitorId} className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {j.steps.map((name, i) => (
                      <span
                        key={`${name}-${i}`}
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          name === 'pack_paid'
                            ? 'bg-[#2F4A2A] text-[#C6E4BC]'
                            : name === 'pack_blocked' || name === 'pack_pay_failed'
                              ? 'bg-[#4A241C] text-[#F0B5A6]'
                              : 'bg-[#1B120A] text-[#C4A882]'
                        }`}
                      >
                        {name.replace(/^(pack_|ticket_)/, '')}
                      </span>
                    ))}
                    <span className="ml-auto text-[11px] text-[#8C7A63]">{ago(j.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
