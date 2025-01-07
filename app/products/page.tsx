import type { Metadata } from 'next';
import { Suspense } from 'react';
import Products, { ProductsSkeleton } from '@/app/components/products';

interface Props {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = (await searchParams).query;
  return {
    title: query ? `Search results for "${query}"` : 'Products',
  };
}

export default async function Page({ searchParams }: Props) {
  const { query, page } = await searchParams;
  return (
    <main>
      <div className="space-y-8">
        <h2 className="text-center text-2xl font-semibold">
          {query ? `Search results for "${query}"` : 'Products'}
        </h2>
        <Suspense key={`${query}${page}`} fallback={<ProductsSkeleton />}>
          <Products queryOptions={{ filters: { name: query }, page: Number(page) || undefined }} />
        </Suspense>
      </div>
    </main>
  );
}
