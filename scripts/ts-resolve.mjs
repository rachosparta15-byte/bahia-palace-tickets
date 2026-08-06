/**
 * Lets plain node run the app's TypeScript: resolves the `@/` alias and the
 * extensionless imports that Next handles for us, so a test can import the real
 * modules instead of a copy that drifts.
 */
import { register } from 'node:module';
import { statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = pathToFileURL(process.cwd() + '/src/').href;
const EXT = ['', '.ts', '.tsx', '/index.ts'];
const isFile = (u) => { try { return statSync(fileURLToPath(u)).isFile(); } catch { return false; } };

export function resolve(spec, ctx, next) {
  const base = spec.startsWith('@/') ? SRC + spec.slice(2)
    : spec.startsWith('.') && ctx.parentURL ? new URL(spec, ctx.parentURL).href
    : null;
  if (base) for (const e of EXT) if (isFile(base + e)) return next(base + e, ctx);
  return next(spec, ctx);
}

register(import.meta.url, pathToFileURL('./'));
