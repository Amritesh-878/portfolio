export const INVITE_KEY = 'portfolio-invited';

export function alreadyInvited(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(INVITE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markInvited(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(INVITE_KEY, '1');
  } catch {}
}
