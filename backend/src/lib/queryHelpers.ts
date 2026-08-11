/**
 * Shared query helpers and sanitizers.
 */

/** Standard pagination defaults */
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

/** Parse pagination query params */
export function parsePagination(query: Record<string, any>): {
  skip: number;
  take: number;
} {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const size = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(query.size, 10) || DEFAULT_PAGE_SIZE)
  );
  return { skip: (page - 1) * size, take: size };
}

/**
 * Remove passwordHash from a user object or nested relation object cleanly and safely.
 */
export function sanitizeUser<T = any>(obj: T): any {
  if (!obj || typeof obj !== 'object') return obj;

  const target = Array.isArray(obj) ? [...obj] : { ...obj };

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeUser(item));
  }

  const { passwordHash, ...safe } = target as any;

  if (safe.user) safe.user = sanitizeUser(safe.user);
  if (safe.author) safe.author = sanitizeUser(safe.author);
  if (safe.host) safe.host = sanitizeUser(safe.host);
  if (safe.lead) safe.lead = sanitizeUser(safe.lead);
  if (safe.mentor) safe.mentor = sanitizeUser(safe.mentor);
  if (safe.mentee) safe.mentee = sanitizeUser(safe.mentee);

  if (safe.members && Array.isArray(safe.members)) {
    safe.members = safe.members.map((m: any) => ({
      ...m,
      user: sanitizeUser(m.user),
    }));
  }

  if (safe.attendances && Array.isArray(safe.attendances)) {
    safe.attendances = safe.attendances.map((a: any) => ({
      ...a,
      user: sanitizeUser(a.user),
    }));
  }

  return safe;
}

/**
 * Remove passwordHash from an array of objects
 */
export function sanitizeUsers<T = any>(items: T[]): any[] {
  if (!Array.isArray(items)) return items;
  return items.map((item) => sanitizeUser(item));
}
