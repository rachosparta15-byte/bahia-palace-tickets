/**
 * Deep-merge a paid-model copy override onto the base (free-model) messages.
 *
 * WHY THIS EXISTS: the site's wording must flip together with the ticket
 * funnel, which is gated on PAYMENTS_ENABLED (see src/lib/payments/guard.ts
 * and LeadButton). Rather than branch every component, the base messages hold
 * the free-model copy (unchanged, live today) and messages/paid/<locale>.json
 * holds ONLY the keys that change once payments are on. This merges the two so
 * copy and funnel can never disagree — they read one flag.
 *
 * MERGE RULES (intentionally boring and predictable):
 *   - object + object  → recurse key by key
 *   - array  + array   → merge element-by-index; `null` in the override means
 *                        "keep the base element untouched", so an override can
 *                        change item 3 of a list without restating items 0–2.
 *                        Overriding a whole primitive list just restates it.
 *   - anything else     → the override value replaces the base value
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function isPlainObject(value: unknown): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepMergeMessages(base: JsonValue, override: JsonValue): JsonValue {
  if (Array.isArray(base) && Array.isArray(override)) {
    const out: JsonValue[] = base.slice();
    for (let i = 0; i < override.length; i++) {
      const o = override[i];
      // null placeholder → leave the base element as-is.
      if (o === null) continue;
      out[i] = i < base.length ? deepMergeMessages(base[i], o) : o;
    }
    return out;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const out: { [key: string]: JsonValue } = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = key in base ? deepMergeMessages(base[key], override[key]) : override[key];
    }
    return out;
  }

  return override;
}
