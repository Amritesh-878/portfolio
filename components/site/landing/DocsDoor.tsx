import Link from 'next/link';

export function DocsDoor() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="nb-box flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-fd-foreground">
            The rest reads like docs.
          </h2>
          <p className="mt-1.5 text-sm text-fd-muted-foreground">
            Sidebar, search, and versioned pages. Everything here is tested in
            production and occasionally hunted by a Wumpus.
          </p>
        </div>
        <Link
          href="/introduction"
          className="shrink-0 rounded-full bg-fd-primary px-6 py-3 font-mono text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Read the documentation →
        </Link>
      </div>
    </section>
  );
}
