import { LINKEDIN_URL } from '@/lib/profiles';

const PDF = '/resume.pdf';

const BUTTON_CLASS =
  'rounded-lg border border-fd-border px-3 py-1.5 font-mono text-xs text-fd-foreground transition-colors hover:border-fd-primary/60 hover:text-fd-primary';

export function ResumeViewer() {
  return (
    <div className="not-prose my-6">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={PDF}
          target="_blank"
          rel="noreferrer noopener"
          className={BUTTON_CLASS}
        >
          Open in a new tab
        </a>
        <a href={PDF} download className={BUTTON_CLASS}>
          Download the PDF
        </a>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noreferrer noopener"
          className={BUTTON_CLASS}
        >
          LinkedIn
        </a>
      </div>

      <iframe
        src={`${PDF}#view=FitH&toolbar=0&navpanes=0&pagemode=none`}
        title="Résumé of Amritesh Praveen"
        className="mt-4 hidden aspect-[1/1.414] w-full rounded-lg border border-fd-border bg-fd-card sm:block"
      />

      <p className="mt-4 text-sm text-fd-muted-foreground sm:hidden">
        Phone browsers do not render an embedded PDF reliably, so open it with
        the button above.
      </p>
    </div>
  );
}
