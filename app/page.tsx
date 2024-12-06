import { Loader2 } from 'lucide-react';
import { client } from '@/app/lib/wix-client';
import { Suspense } from 'react';
import ProductCard from '@/app/components/product-card';
import Hero from './hero';

export default function Home() {
  return (
    <main className="space-y-8">
      <Hero />
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  const { collection } = await client.collections.getCollectionBySlug('featured');

  if (!collection) {
    return null;
  }

  const { items } = await client.products
    .queryProducts()
    .hasSome('collectionIds', [collection._id])
    .descending('lastUpdated')
    .find();

  if (!items.length) {
    return null;
  }

  return (
    <section className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Featured products</h2>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-8">
        {items.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </section>
  );
}
