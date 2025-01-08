import type { Metadata } from 'next';
import { Suspense } from 'react';
import Products, { ProductsSkeleton } from '@/app/components/products';
import Sort from '@/app/components/sort';
import { sortValues } from '@/app/lib/wix-api';

interface Props {
  searchParams: Promise<{ query?: string; sort?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = (await searchParams).query;
  return {
    title: query ? `Search results for "${query}"` : 'Products',
  };
}

export default async function Page({ searchParams }: Props) {
  const { query, sort, page } = await searchParams;
  return (
    <main>
      <div className="space-y-8">
        <h2 className="text-center text-2xl font-semibold">
          {query ? `Search results for "${query}"` : 'Products'}
        </h2>
        <Sort selectedValue={sort ?? Object.keys(sortValues)[0]} values={sortValues} />
        <Suspense key={`${query}${sort}${page}`} fallback={<ProductsSkeleton />}>
          <Products
            queryOptions={{
              filters: { name: query },
              sort: sort as keyof typeof sortValues,
              page: Number(page) || undefined,
            }}
          />
        </Suspense>
      </div>
    </main>
  );
}
