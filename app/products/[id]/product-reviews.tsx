import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import type { products } from '@wix/stores';
import CreateReviewButton from '@/app/components/reviews/create-review-button';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { fetchReviewsCount, fetchReviews } from '@/app/lib/wix-api.reviews';
import ReviewCard, { ReviewCardSkeleton } from '@/app/components/reviews/review-card';

export default async function ProductReviews({ product }: { product: products.Product }) {
  const wixClient = await getWixServerClient();
  const [member, reviewsCount, { items: reviews }] = await Promise.all([
    fetchLoggedInMember(wixClient),
    fetchReviewsCount(wixClient, { productId: product._id }),
    fetchReviews(wixClient, { filters: { productId: product._id } }),
  ]);

  if (!reviewsCount) {
    return (
      <div className="space-y-8 text-center">
        <h2 className="text-2xl font-semibold">No reviews yet &#128549;</h2>
        <p>You can write your own review for this product to share your experience with others.</p>
        <CreateReviewButton product={product} loggedInMember={member} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Recent reviews</h2>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} loggedInMember={member} />
      ))}
      <div className="flex items-center justify-center gap-x-4">
        <CreateReviewButton product={product} loggedInMember={member} />
        <Button asChild variant="link">
          <Link href={`/products/${product._id}/reviews`}>All reviews ({reviewsCount})</Link>
        </Button>
      </div>
    </div>
  );
}

export function ProductReviewsSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Recent reviews</h2>
      {Array.from({ length: 2 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}
