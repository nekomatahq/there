'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/trpc/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mutation = trpc.there.clean.useMutation({
    onSuccess: (data) => {
      setResult(data.url);
      setCopied(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    mutation.mutate({ url: url.trim() });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen flex flex-col relative">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm space-y-16">
        <header className="space-y-3">
          <h1 className="text-base font-medium tracking-tight">There.</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Paste a URL. Get it clean.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="url"
            placeholder="Paste URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-9 text-sm"
            aria-label="URL to clean"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Button
            type="submit"
            disabled={mutation.isPending || !url.trim()}
            className="w-full h-9 text-sm"
            aria-busy={mutation.isPending}
          >
            {mutation.isPending ? 'Cleaning' : 'Clean'}
          </Button>
        </form>

        {mutation.error && (
          <p className="text-sm text-destructive" role="alert">
            {mutation.error.message}
          </p>
        )}

        {result && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full px-3 py-2.5 bg-muted rounded-lg text-left transition-colors duration-300 ease-out hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={copied ? 'Copied to clipboard' : 'Copy cleaned URL'}
            >
              <p className="text-xs break-all font-mono leading-relaxed">{result}</p>
            </button>
            <p className="text-xs text-muted-foreground text-center select-none">
              {copied ? 'Copied' : 'Click to copy'}
            </p>
          </div>
        )}
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 px-8 py-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="space-x-1">
          <Link href="/privacy" className="hover:text-foreground transition-colors duration-300">privacy</Link>
          <span>/</span>
          <Link href="/terms" className="hover:text-foreground transition-colors duration-300">terms</Link>
        </div>
        <div>
          <a href="https://github.com/nekomatahq" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
            Nekomata Suite tools / ネコマタ
          </a>
        </div>
      </footer>
    </main>
  );
}
