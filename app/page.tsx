import { getWixServerClient } from '@/app/lib/wix-client.server';
import { Suspense } from 'react';
import Hero from '@/app/hero';
import ProductsCarousel, {
  ProductsCarouselSkeleton,
} from '@/app/components/products/products-carousel';

export default function Home() {
  return (
    <main className="space-y-8">
      <Hero />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  const serverClient = await getWixServerClient();
  const { collection } = await serverClient.collections.getCollectionBySlug('featured');

  if (!collection) {
    return null;
  }

  const { items } = await serverClient.products
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
      <ProductsCarousel products={items} />
    </section>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Featured products</h2>
      <ProductsCarouselSkeleton />
    </section>
  );
}
