import { describe, it, expect } from 'vitest';
import { parseContactRequest } from '@/lib/contact/schema';

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'Nice site.',
  token: 'tok',
};

describe('parseContactRequest', () => {
  it('accepts a well-formed payload', () => {
    const result = parseContactRequest(valid);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.email).toBe('ada@example.com');
  });

  it('trims whitespace-padded fields', () => {
    const result = parseContactRequest({ ...valid, name: '  Ada  ' });
    if (result.ok) expect(result.value.name).toBe('Ada');
    else throw new Error('expected ok');
  });

  it('rejects a non-object body', () => {
    expect(parseContactRequest('nope').ok).toBe(false);
    expect(parseContactRequest(null).ok).toBe(false);
  });

  it('rejects a blank name', () => {
    expect(parseContactRequest({ ...valid, name: '   ' }).ok).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(parseContactRequest({ ...valid, email: 'not-an-email' }).ok).toBe(
      false,
    );
  });

  it('rejects a missing Turnstile token', () => {
    expect(parseContactRequest({ ...valid, token: '' }).ok).toBe(false);
  });

  it('rejects an over-long message', () => {
    expect(
      parseContactRequest({ ...valid, message: 'x'.repeat(5001) }).ok,
    ).toBe(false);
  });
});
