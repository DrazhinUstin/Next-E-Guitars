'use client';

import LoadingButton from '@/app/components/loading-button';
import { useReviewsInfiniteQuery } from '@/app/hooks/reviews';
import type { products } from '@wix/stores';
import ReviewCard, { ReviewCardSkeleton } from '@/app/components/reviews/review-card';
import { useState } from 'react';
import { sortValues } from '@/app/lib/wix-api.reviews';
import Sort from '@/app/components/sort';
import type { members } from '@wix/members';

export default function ReviewsInfiniteList({
  product,
  author,
}: {
  product?: products.Product;
  author?: members.Member;
}) {
  const [sort, setSort] = useState<keyof typeof sortValues>('created_desc');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useReviewsInfiniteQuery({
    filters: { productId: product?._id, contactId: author?.contactId },
    sort,
  });

  const reviews = data?.pages.flatMap((page) => page.items);

  return (
    <div className="space-y-8">
      <Sort
        values={sortValues}
        selectedValue={sort}
        callback={(val) => setSort(val as typeof sort)}
      />
      {status === 'pending' && <ReviewsInfiniteListSkeleton />}
      {status === 'error' && (
        <p className="text-center text-destructive">There was an error while loading reviews...</p>
      )}
      {status === 'success' && !hasNextPage && !reviews?.length && (
        <p className="text-center text-muted-foreground">
          No reviews were found for this product...
        </p>
      )}
      {reviews?.map((review) => <ReviewCard key={review._id} review={review} />)}
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

export function ReviewsInfiniteListSkeleton({ length = 2 }: { length?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}
