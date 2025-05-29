import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="grid min-h-[calc(var(--page-min-height)_-_var(--page-padding)_*_2)] place-items-center">
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  );
}
