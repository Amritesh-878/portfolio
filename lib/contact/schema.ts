export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  token: string;
}

export type ContactParseResult =
  { ok: true; value: ContactRequest } | { ok: false; error: string };

const LIMITS = { name: 100, email: 200, subject: 200, message: 5000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parseContactRequest(body: unknown): ContactParseResult {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Request body must be a JSON object.' };
  }
  const record = body as Record<string, unknown>;
  const name = str(record.name);
  const email = str(record.email);
  const subject = str(record.subject);
  const message = str(record.message);
  const token = str(record.token);

  if (!name) return { ok: false, error: 'Your name is required.' };
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'A valid email is required.' };
  }
  if (!subject) return { ok: false, error: 'A subject is required.' };
  if (!message) return { ok: false, error: 'A message is required.' };
  if (!token) return { ok: false, error: 'Human verification is missing.' };

  if (name.length > LIMITS.name) {
    return { ok: false, error: 'Name is too long.' };
  }
  if (email.length > LIMITS.email) {
    return { ok: false, error: 'Email is too long.' };
  }
  if (subject.length > LIMITS.subject) {
    return { ok: false, error: 'Subject is too long.' };
  }
  if (message.length > LIMITS.message) {
    return { ok: false, error: 'Message is too long.' };
  }

  return { ok: true, value: { name, email, subject, message, token } };
}
