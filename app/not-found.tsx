import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-sm text-fd-muted-foreground">
        error 404: you feel a breeze
      </p>
      <h1 className="text-3xl font-semibold text-fd-primary">
        You fell into a pit.
      </h1>
      <p className="max-w-md text-fd-muted-foreground">
        There&apos;s no page here, just a long way down. The Wumpus sends its
        regards.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-4 font-mono text-sm">
        <Link href="/" className="text-fd-primary hover:underline">
          ▸ climb back home
        </Link>
        <Link
          href="/projects/hunter-wumpus/play"
          className="text-fd-primary hover:underline"
        >
          ▸ fight the Wumpus
        </Link>
      </div>
    </main>
  );
}
