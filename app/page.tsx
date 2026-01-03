'use client';

import { useState } from 'react';
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-12">
        <header className="space-y-2">
          <h1 className="text-lg font-medium tracking-tight">there</h1>
          <p className="text-sm text-muted-foreground">Paste a URL. Get it clean.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="https://example.com/page?utm_source=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-11"
            autoFocus
          />
          <Button
            type="submit"
            disabled={mutation.isPending || !url.trim()}
            className="w-full h-11"
          >
            {mutation.isPending ? 'Cleaning...' : 'Clean'}
          </Button>
        </form>

        {mutation.error && (
          <p className="text-sm text-destructive">
            {mutation.error.message}
          </p>
        )}

        {result && (
          <div className="space-y-3">
            <div
              onClick={handleCopy}
              className="p-4 bg-muted rounded-lg cursor-pointer transition-colors hover:bg-muted/80"
              title="Click to copy"
            >
              <p className="text-sm break-all font-mono">{result}</p>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {copied ? 'Copied.' : 'Click to copy.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
