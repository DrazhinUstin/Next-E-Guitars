import { cn } from '@/app/lib/utils';

export default function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'rounded-sm bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-md',
        className
      )}
    >
      {children}
    </span>
  );
}
