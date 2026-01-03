import Link from 'next/link';

export default function Privacy() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-sm space-y-8">
        <header className="space-y-3">
          <h1 className="text-base font-medium tracking-tight">Privacy</h1>
        </header>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>We do not collect, store, or share any personal information.</p>
          <p>URLs are processed server-side and immediately discarded.</p>
          <p>No cookies. No tracking. No analytics.</p>
        </div>

        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
          ← Back
        </Link>
      </div>
    </main>
  );
}

