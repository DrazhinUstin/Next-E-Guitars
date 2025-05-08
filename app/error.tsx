'use client';

import { Button } from '@/app/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-[calc(var(--page-min-height)_-_var(--page-padding)_*_2)] place-items-center">
      <div className="max-w-lg space-y-8 text-center">
        <h2 className="text-2xl font-semibold">Oops! There was an error! &#128560;</h2>
        {!!error.message && <p className="break-words">{error.message}</p>}
        <Button onClick={() => reset()}>
          <RefreshCwIcon />
          Reload
        </Button>
      </div>
    </main>
  );
}
