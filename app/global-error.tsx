'use client';

import { Button } from '@/app/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="mx-auto grid h-screen w-[90vw] max-w-7xl place-items-center py-8">
          <div className="max-w-lg space-y-8 text-center">
            <h2 className="text-2xl font-semibold">Oops! There was an error! &#128560;</h2>
            {!!error.message && <p className="break-words">{error.message}</p>}
            <Button onClick={() => reset()}>
              <RefreshCwIcon />
              Reload
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
