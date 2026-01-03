import Link from 'next/link';

export default function Terms() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-sm space-y-8">
        <header className="space-y-3">
          <h1 className="text-base font-medium tracking-tight">Terms</h1>
        </header>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Use this tool at your own discretion.</p>
          <p>We provide no guarantees about URL cleaning accuracy or availability.</p>
          <p>No warranties. No liability.</p>
        </div>

        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
          ← Back
        </Link>
      </div>
    </main>
  );
}

