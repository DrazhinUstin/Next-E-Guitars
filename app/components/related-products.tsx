import ProductCard from '@/app/components/product-card';
import { fetchRelatedProducts } from '@/app/lib/wix-api.recommendations';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { ProductsSkeleton } from '@/app/components/products';

export default async function RelatedProducts({ productId }: { productId: string }) {
  const wixClient = await getWixServerClient();
  const products = await fetchRelatedProducts(wixClient, productId);

  if (!products.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Related products</h2>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function RelatedProductsSkeleton({ length = 4 }: { length?: number }) {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Related products</h2>
      <ProductsSkeleton length={length} />
    </div>
  );
}
