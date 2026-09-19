const LOCAL_ORIGIN = 'http://localhost:3000';

export function siteOrigin(): string {
  const explicit = process.env.SITE_ORIGIN;
  if (explicit) return explicit.replace(/\/+$/, '');

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL_ENV === 'production' && production) {
    return `https://${production}`;
  }

  const branch = process.env.VERCEL_BRANCH_URL;
  if (branch) return `https://${branch}`;

  return LOCAL_ORIGIN;
}
