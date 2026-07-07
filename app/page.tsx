import Link from 'next/link';
import type { Metadata } from 'next';

import { LandingHeader } from '@/components/site/landing/LandingHeader';
import { Hero } from '@/components/site/landing/Hero';
import { BuiltWith } from '@/components/site/landing/BuiltWith';
import { Evidence } from '@/components/site/landing/Evidence';
import { SpecSheet } from '@/components/site/landing/SpecSheet';
import { FeaturedWork } from '@/components/site/landing/FeaturedWork';
import { DocsDoor } from '@/components/site/landing/DocsDoor';

const DESCRIPTION =
  'AI/ML engineer building production RAG systems, reinforcement-learning agents, and NLP. Explore the docs, chat with my AI twin, or play against a PPO agent.';

export const metadata: Metadata = {
  title: { absolute: 'Amritesh Praveen: AI/ML Engineer' },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Amritesh Praveen: AI/ML Engineer',
    description: DESCRIPTION,
    url: '/',
  },
};

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <BuiltWith />
        <Evidence />
        <SpecSheet />
        <FeaturedWork />
        <DocsDoor />
      </main>
      <footer className="border-t-2" style={{ borderColor: 'var(--nb-line)' }}>
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center">
          <div className="font-mono text-xs text-fd-muted-foreground">
            <p>
              Building retrieval systems, reinforcement-learning agents, and
              production AI tools.
            </p>
            <p className="mt-1.5 text-fd-muted-foreground/70">
              © 2026 Amritesh Praveen. Built with Next.js, Fumadocs, and Vercel.
            </p>
          </div>
          <nav className="flex items-center gap-4 font-mono text-xs">
            <Link
              href="/contact"
              className="text-fd-muted-foreground transition-colors hover:text-fd-primary"
            >
              Contact
            </Link>
            <Link
              href="/introduction"
              className="text-fd-muted-foreground transition-colors hover:text-fd-primary"
            >
              Docs
            </Link>
            <a
              href="https://github.com/Amritesh-878"
              target="_blank"
              rel="noreferrer noopener"
              className="text-fd-muted-foreground transition-colors hover:text-fd-primary"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
