import { fetchRelatedProducts } from '@/app/lib/wix-api.recommendations';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import ProductsCarousel, { ProductsCarouselSkeleton } from '@/app/components/products-carousel';

export default async function RelatedProducts({ productId }: { productId: string }) {
  const wixClient = await getWixServerClient();
  const products = await fetchRelatedProducts(wixClient, productId);

  if (!products.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Related products</h2>
      <ProductsCarousel products={products} />
    </div>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Related products</h2>
      <ProductsCarouselSkeleton />
    </div>
  );
}
