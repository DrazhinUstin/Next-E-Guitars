'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { Label } from '@/app/components/ui/label';

export default function Sort({
  selectedValue,
  values,
  className,
}: {
  selectedValue: string;
  values: { [value: string]: string };
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort', value);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Label htmlFor="sort">Sort by</Label>
      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger id="sort" className={cn('w-max', className)}>
          <SelectValue placeholder="Select a sorting" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(values).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
