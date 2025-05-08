import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Undo2Icon } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(var(--page-min-height)_-_var(--page-padding)_*_2)] flex-col items-center justify-center gap-4 lg:flex-row">
      <h1 className="text-8xl">404</h1>
      <span className="h-1 w-16 bg-border lg:h-16 lg:w-1" />
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p>The page you are looking for doesn&apos;t exist</p>
        <Button asChild>
          <Link href="/">
            <Undo2Icon />
            Back to starter page
          </Link>
        </Button>
      </div>
    </main>
  );
}
