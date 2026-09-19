import {
  ActionRow,
  Container,
  LinkButton,
  TextDisplay,
} from 'discord-component-embed';
import type { ReactElement } from 'react';
import { GITHUB_URL, LINKEDIN_URL } from '@/lib/profiles';

// Custom emoji uploaded to a Discord server he owns; deleting it there drops the cat from the card.
const SITE_EMOJI = '<:icon:1550817005081202748>';

const HOOK =
  "**AI/ML developer.** Fresher on paper. There's a monster, a bot of me, and a patent application on this one.";

export function HomeCard({ origin }: { origin: string }): ReactElement {
  return (
    <Container>
      <TextDisplay>
        {`# ${SITE_EMOJI} [Amritesh Praveen](${origin}/)\n${HOOK}`}
      </TextDisplay>
      <ActionRow>
        <LinkButton url={`${origin}/twin/chat`} label="Chat with my AI twin" />
        <LinkButton url={GITHUB_URL} label="GitHub" />
        <LinkButton url={LINKEDIN_URL} label="LinkedIn" />
      </ActionRow>
    </Container>
  );
}
