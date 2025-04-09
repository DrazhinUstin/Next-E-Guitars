import type { Metadata } from 'next';
import { Suspense } from 'react';
import Products, { ProductsSkeleton } from '@/app/components/products';
import Sort from '@/app/components/sort';
import { sortValues } from '@/app/lib/wix-api.products';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { fetchCollections } from '@/app/lib/wix-api.collections';
import Filters from '@/app/products/filters';

interface Props {
  searchParams: Promise<{
    query?: string;
    collectionIds?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = (await searchParams).query;
  return {
    title: query ? `Search results for "${query}"` : 'Products',
  };
}

export default async function Page({ searchParams }: Props) {
  const { query, collectionIds, minPrice, maxPrice, sort, page } = await searchParams;
  const wixClient = await getWixServerClient();
  const collections = await fetchCollections(wixClient);
  return (
    <main>
      <div className="space-y-8">
        <h2 className="text-center text-2xl font-semibold">
          {query ? `Search results for "${query}"` : 'Products'}
        </h2>
        <div className="grid gap-8 md:grid-cols-[240px_1fr] md:items-start">
          <aside className="md:sticky md:top-8">
            <Filters collections={collections} />
          </aside>
          <div className="space-y-8">
            <Sort selectedValue={sort ?? Object.keys(sortValues)[0]} values={sortValues} />
            <Suspense
              key={`${query}${collectionIds}${minPrice}${maxPrice}${sort}${page}`}
              fallback={<ProductsSkeleton />}
            >
              <Products
                queryOptions={{
                  filters: {
                    name: query,
                    collectionIds,
                    minPrice: Number(minPrice) || undefined,
                    maxPrice: Number(maxPrice) || undefined,
                  },
                  sort: sort as keyof typeof sortValues,
                  page: Number(page) || undefined,
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
