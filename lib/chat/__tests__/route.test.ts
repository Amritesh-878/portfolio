import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/chat/route';

function post(body: string, ip: string): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body,
  });
}

describe('POST /api/chat guards', () => {
  it('rejects invalid JSON with 400', async () => {
    const res = await POST(post('not json', 'route-ip-1'));
    expect(res.status).toBe(400);
  });

  it('rejects an empty message with 400', async () => {
    const res = await POST(
      post(JSON.stringify({ message: '   ' }), 'route-ip-2'),
    );
    expect(res.status).toBe(400);
  });

  it('rate-limits after the per-window maximum', async () => {
    const ip = 'route-ip-3';
    for (let i = 0; i < 12; i++) await POST(post('not json', ip));
    const res = await POST(post('not json', ip));
    expect(res.status).toBe(429);
  });
});
