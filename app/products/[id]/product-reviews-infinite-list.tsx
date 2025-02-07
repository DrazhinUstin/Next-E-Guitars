'use client';

import LoadingButton from '@/app/components/loading-button';
import { useProductReviewsInfiniteQuery } from '@/app/hooks/reviews';
import type { products } from '@wix/stores';
import ProductReviewCard, { ProductReviewCardSkeleton } from './product-review-card';

export default function ProductReviewsInfiniteList({ product }: { product: products.Product }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useProductReviewsInfiniteQuery(product._id as string);

  const reviews = data?.pages.flatMap((page) => page.items);

  return (
    <div className="space-y-8">
      {status === 'pending' && <ProductReviewsListSkeleton />}
      {status === 'error' && (
        <p className="text-center text-destructive">There was an error while loading reviews...</p>
      )}
      {status === 'success' && !hasNextPage && !reviews?.length && (
        <p className="text-center text-muted-foreground">
          No reviews were found for this product...
        </p>
      )}
      {reviews?.map((review) => <ProductReviewCard key={review._id} review={review} />)}
      {hasNextPage && (
        <div className="text-center">
          <LoadingButton
            variant="link"
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Load more reviews
          </LoadingButton>
        </div>
      )}
    </div>
  );
}

export function ProductReviewsListSkeleton({ length = 2 }: { length?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length }).map((_, i) => (
        <ProductReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}
