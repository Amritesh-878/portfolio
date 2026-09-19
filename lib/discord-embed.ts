export const HOME_EMBED_PATH = '/embeds/home';

export function embedHref(origin: string): string {
  return `${origin}${HOME_EMBED_PATH}`;
}
