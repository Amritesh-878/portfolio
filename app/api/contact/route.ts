import { createHash, randomUUID } from 'node:crypto';
import { parseContactRequest, type ContactRequest } from '@/lib/contact/schema';
import { contactRateLimit } from '@/lib/contact/rate-limit';

export const runtime = 'nodejs';

const PUBLIC_ADDRESS = 'contact@amritesh.net';
const FROM = `Amritesh Praveen <${PUBLIC_ADDRESS}>`;
const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_URL = 'https://api.resend.com/emails';

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  );
}

interface ContactEvent {
  requestId: string;
  timestamp: string;
  ipHash: string;
  userAgent: string;
  turnstile: 'pass' | 'fail' | 'skipped';
  mail: 'sent' | 'failed' | 'unconfigured' | 'dropped' | 'skipped';
  resendId: string | null;
  latencyMs: number;
  detail?: string;
}

// One structured line per submission so a "form doesn't work" report is
// debuggable from logs alone. Metadata only: the IP is hashed, and the message
// body and sender address are never logged.
function logContactEvent(event: ContactEvent): void {
  console.log(JSON.stringify({ event: 'contact_submission', ...event }));
}

async function verifyHuman(
  token: string,
  ip: string,
  secret: string,
): Promise<{ ok: boolean; detail?: string }> {
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      'error-codes'?: string[];
    };
    if (data.success === true) return { ok: true };
    return {
      ok: false,
      detail: (data['error-codes'] ?? []).join(',') || 'rejected',
    };
  } catch {
    return { ok: false, detail: 'unreachable' };
  }
}

async function sendViaResend(
  input: ContactRequest,
  apiKey: string,
  to: string,
): Promise<{ id: string } | { error: string }> {
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: input.email,
        subject: `[portfolio] ${input.subject}`,
        text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
      }),
    });
    if (!res.ok) return { error: `resend_${res.status}` };
    const data = (await res.json()) as { id?: string };
    return data.id ? { id: data.id } : { error: 'resend_no_id' };
  } catch {
    return { error: 'resend_unreachable' };
  }
}

export async function POST(request: Request): Promise<Response> {
  const start = Date.now();
  const requestId = randomUUID();
  const ip = clientIp(request);
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  const emit = (
    fields: Pick<ContactEvent, 'turnstile' | 'mail' | 'resendId' | 'detail'>,
  ): void => {
    logContactEvent({
      requestId,
      timestamp: new Date().toISOString(),
      ipHash: createHash('sha256').update(ip).digest('hex').slice(0, 16),
      userAgent,
      latencyMs: Date.now() - start,
      ...fields,
    });
  };

  if (!contactRateLimit(ip, start).allowed) {
    return json(
      { error: 'Too many messages in a short window. Give it a minute.' },
      429,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400);
  }

  // Honeypot: a hidden field no human fills. A filled one is a bot, so accept
  // and silently drop it; the bot learns nothing and never reaches the mail path.
  const record = (typeof body === 'object' && body ? body : {}) as Record<
    string,
    unknown
  >;
  if (typeof record.company === 'string' && record.company.trim().length > 0) {
    emit({ turnstile: 'skipped', mail: 'dropped', resendId: null });
    return json({ ok: true, id: null, routedTo: PUBLIC_ADDRESS }, 200);
  }

  const parsed = parseContactRequest(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!secret || !apiKey || !to) {
    emit({ turnstile: 'skipped', mail: 'unconfigured', resendId: null });
    return json(
      {
        error: `The form isn't fully configured yet. Email ${PUBLIC_ADDRESS} directly.`,
      },
      503,
    );
  }

  const human = await verifyHuman(parsed.value.token, ip, secret);
  if (!human.ok) {
    emit({
      turnstile: 'fail',
      mail: 'skipped',
      resendId: null,
      detail: human.detail,
    });
    return json(
      {
        error: `Human check failed. Refresh and try again, or email ${PUBLIC_ADDRESS}.`,
      },
      403,
    );
  }

  const sent = await sendViaResend(parsed.value, apiKey, to);
  if ('error' in sent) {
    emit({
      turnstile: 'pass',
      mail: 'failed',
      resendId: null,
      detail: sent.error,
    });
    return json(
      { error: `Couldn't send just now. Email ${PUBLIC_ADDRESS} directly.` },
      502,
    );
  }

  emit({ turnstile: 'pass', mail: 'sent', resendId: sent.id });
  return json({ ok: true, id: sent.id, routedTo: PUBLIC_ADDRESS }, 200);
}
