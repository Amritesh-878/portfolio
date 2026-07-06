import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { getMDXComponents } from '@/components/mdx';

interface DocsPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const isHome = !slug || slug.length === 0;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {!isHome && <DocsTitle>{page.data.title}</DocsTitle>}
      {!isHome && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const isHome = !slug || slug.length === 0;

  return {
    title: isHome ? 'Amritesh Praveen' : page.data.title,
    description: page.data.description,
  };
}
