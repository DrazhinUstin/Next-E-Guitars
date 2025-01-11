'use client';

import type { collections } from '@wix/stores';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useEffect, useState } from 'react';

export default function Filters({ collections }: { collections: collections.Collection[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [values, setValues] = useState<{
    collectionIds: string[];
    minPrice: string;
    maxPrice: string;
  }>({
    collectionIds: searchParams.getAll('collectionIds'),
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
  });

  useEffect(() => {
    setValues({
      collectionIds: searchParams.getAll('collectionIds'),
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
    });
  }, [searchParams]);

  const applyFilters = (filters: typeof values) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('page');
    Object.entries(filters).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((item) => newSearchParams.append(key, item));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const isAnyFilterApplied = Object.values(values).some((val) =>
    Array.isArray(val) ? !!val.length : !!val
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters(values);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <h4 className="font-medium">Collections:</h4>
        <ul className="space-y-2">
          {collections.map(({ _id, name }) =>
            _id ? (
              <li key={_id} className="flex items-center gap-2">
                <Checkbox
                  id={_id}
                  value={_id}
                  checked={values.collectionIds.includes(_id)}
                  onCheckedChange={(checked) =>
                    setValues((prev) => ({
                      ...prev,
                      collectionIds: checked
                        ? [...prev.collectionIds, _id]
                        : prev.collectionIds.filter((id) => id !== _id),
                    }))
                  }
                />
                <Label htmlFor={_id}>{name}</Label>
              </li>
            ) : null
          )}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Price range:</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="min price"
            value={values.minPrice}
            onChange={(e) => setValues((prev) => ({ ...prev, minPrice: e.target.value }))}
            min={0}
            step={0.01}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="max price"
            value={values.maxPrice}
            onChange={(e) => setValues((prev) => ({ ...prev, maxPrice: e.target.value }))}
            min={0}
            step={0.01}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!isAnyFilterApplied}>
        Apply
      </Button>
      {isAnyFilterApplied && (
        <button
          type="button"
          className="inline-block text-sm text-destructive"
          onClick={() => {
            setValues({ collectionIds: [], minPrice: '', maxPrice: '' });
            applyFilters({ collectionIds: [], minPrice: '', maxPrice: '' });
          }}
        >
          Clear filters
        </button>
      )}
    </form>
  );
}
