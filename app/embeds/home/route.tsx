import { componentEmbedResponse } from 'discord-component-embed';
import { HomeCard } from '@/components/site/embeds/home';
import { siteOrigin } from '@/lib/site-origin';

export function GET(): Response {
  return componentEmbedResponse(<HomeCard origin={siteOrigin()} />);
}
