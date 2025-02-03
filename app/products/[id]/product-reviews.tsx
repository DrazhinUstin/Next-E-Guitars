import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import type { products } from '@wix/stores';
import CreateProductReviewButton from './create-product-review-button';

export default async function ProductReviews({ product }: { product: products.Product }) {
  const wixClient = await getWixServerClient();
  const member = await fetchLoggedInMember(wixClient);
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold">Product reviews</h2>
      {!!member && <CreateProductReviewButton product={product} />}
    </div>
  );
}
