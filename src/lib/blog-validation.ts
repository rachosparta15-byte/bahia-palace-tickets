/** Returns an error string if the value fails, undefined if it passes. */

// Detects strings made of 4+ consecutive identical characters: "zzzz", "xdxxxx", etc.
const REPEATED_CHARS = /(.)\1{3,}/;

export function validateSlug(slug: string): string | undefined {
  if (slug.length < 4) return 'Slug must be at least 4 characters';
  if (REPEATED_CHARS.test(slug)) return 'Slug contains too many repeated characters';
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Slug may only contain lowercase letters, numbers, and hyphens';
  return undefined;
}

export function validateTitle(title: string): string | undefined {
  if (title.trim().length < 10) return 'Title must be at least 10 characters';
  if (REPEATED_CHARS.test(title.trim())) return 'Title contains too many repeated characters';
  return undefined;
}

/** Only enforced when published=true. Draft posts may have empty content. */
export function validateContentForPublish(content: string | null | undefined): string | undefined {
  const len = (content ?? '').trim().length;
  if (len < 200) return `Content is too short to publish (${len} chars — minimum 200)`;
  return undefined;
}
