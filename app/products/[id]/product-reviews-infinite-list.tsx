'use client';

import LoadingButton from '@/app/components/loading-button';
import { useProductReviewsInfiniteQuery } from '@/app/hooks/reviews';
import type { products } from '@wix/stores';
import ProductReviewCard, { ProductReviewCardSkeleton } from './product-review-card';
import { useState } from 'react';
import { sortValues } from '@/app/lib/wix-api.reviews';
import Sort from '@/app/components/sort';

export default function ProductReviewsInfiniteList({ product }: { product: products.Product }) {
  const [sort, setSort] = useState<keyof typeof sortValues>('created_desc');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useProductReviewsInfiniteQuery({ filters: { productId: product._id }, sort });

  const reviews = data?.pages.flatMap((page) => page.items);

  return (
    <div className="space-y-8">
      <Sort
        values={sortValues}
        selectedValue={sort}
        callback={(val) => setSort(val as typeof sort)}
      />
      {status === 'pending' && <ProductReviewsInfiniteListSkeleton />}
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

export function ProductReviewsInfiniteListSkeleton({ length = 2 }: { length?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length }).map((_, i) => (
        <ProductReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}
