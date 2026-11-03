// Authentication helpers
// Reads and writes to localStorage using the same key ("enviro_token")
// that the existing fetchApi() utility already reads from.

const TOKEN_KEY = 'enviro_token';
const USER_KEY = 'enviro_user';

export interface StoredUser {
  id: number;
  email: string;
  full_name: string;
  role: string; // "citizen" | "government" | "admin"
  organization?: string | null;
  created_at: string;
}

/** Persist JWT token and user object to localStorage after a successful login. */
export function storeAuth(token: string, user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/** Return the stored user object, or null if not authenticated. */
export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

/** Return the raw JWT token string, or null. */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Remove token and user from localStorage (logout). */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Return the stored user's role string, or null. */
export function getUserRole(): string | null {
  return getStoredUser()?.role ?? null;
}

/** True if a valid token + user object are both present in localStorage. */
export function isAuthenticated(): boolean {
  return !!getStoredToken() && !!getStoredUser();
}

/** True if the stored user has a government-level role. */
export function isGovernmentUser(): boolean {
  const role = getUserRole();
  return role === 'government' || role === 'admin';
}

/** True if the stored user has a regional manager role. */
export function isRegionalManager(): boolean {
  const role = getUserRole();
  return role === 'regional_manager' || role === 'admin';
}
