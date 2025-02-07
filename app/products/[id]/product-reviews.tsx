import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import type { products } from '@wix/stores';
import CreateProductReviewButton from './create-product-review-button';
import ProductReviewsInfiniteList, {
  ProductReviewsListSkeleton,
} from './product-reviews-infinite-list';

export default async function ProductReviews({ product }: { product: products.Product }) {
  const wixClient = await getWixServerClient();
  const member = await fetchLoggedInMember(wixClient);
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Product reviews</h2>
      {!!member && (
        <div className="text-center">
          <CreateProductReviewButton product={product} />
        </div>
      )}
      <ProductReviewsInfiniteList product={product} />
    </div>
  );
}

export function ProductReviewsSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Product reviews</h2>
      <ProductReviewsListSkeleton />
    </div>
  );
}
