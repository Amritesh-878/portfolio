import { toComponentEmbed } from 'discord-component-embed';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomeCard } from '@/components/site/embeds/home';
import { embedHref } from '@/lib/discord-embed';
import { GITHUB_URL, LINKEDIN_URL } from '@/lib/profiles';
import { siteOrigin } from '@/lib/site-origin';

const ORIGIN = 'https://portfolio-preview.vercel.app';
const LINKED_JSON_LIMIT = 3000;

describe('home card', () => {
  const payload = toComponentEmbed(<HomeCard origin={ORIGIN} />);
  const json = JSON.stringify(payload);

  it('links to the site, the twin, GitHub and LinkedIn', () => {
    expect(json).toContain(`](${ORIGIN}/)`);
    expect(json).toContain(`${ORIGIN}/twin/chat`);
    expect(json).toContain(GITHUB_URL);
    expect(json).toContain(LINKEDIN_URL);
  });

  it('carries no accent bar, arrows or Unicode emoji', () => {
    expect(payload.component.accent_color).toBeFalsy();
    expect(json).not.toContain('↗');
    expect(json).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('stays under the linked JSON byte limit', () => {
    expect(Buffer.byteLength(json, 'utf8')).toBeLessThan(LINKED_JSON_LIMIT);
  });
});

describe('embed href', () => {
  it('points at the embed route on the given origin', () => {
    expect(embedHref(ORIGIN)).toBe(`${ORIGIN}/embeds/home`);
  });
});

describe('siteOrigin', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('prefers SITE_ORIGIN and trims trailing slashes', () => {
    vi.stubEnv('SITE_ORIGIN', 'https://tunnel.example.com//');
    expect(siteOrigin()).toBe('https://tunnel.example.com');
  });

  it('uses the production domain on Vercel production', () => {
    vi.stubEnv('SITE_ORIGIN', '');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'amritesh.net');
    vi.stubEnv('VERCEL_BRANCH_URL', 'branch.vercel.app');
    expect(siteOrigin()).toBe('https://amritesh.net');
  });

  it('uses the branch URL on previews', () => {
    vi.stubEnv('SITE_ORIGIN', '');
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('VERCEL_BRANCH_URL', 'branch.vercel.app');
    expect(siteOrigin()).toBe('https://branch.vercel.app');
  });

  it('falls back to localhost', () => {
    vi.stubEnv('SITE_ORIGIN', '');
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubEnv('VERCEL_BRANCH_URL', '');
    expect(siteOrigin()).toBe('http://localhost:3000');
  });
});
