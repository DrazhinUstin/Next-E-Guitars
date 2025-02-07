'use client';

import StarsRatingInput from '@/app/components/stars-rating-input';
import { Skeleton } from '@/app/components/ui/skeleton';
import { cn, formatDate } from '@/app/lib/utils';
import { reviews } from '@wix/reviews';
import { ReplyIcon, StarIcon } from 'lucide-react';
import { useState } from 'react';

export default function ProductReviewCard({ review }: { review: reviews.Review }) {
  const [isShowMoreEnabled, setIsShowMoreEnabled] = useState(false);
  const maxBodyLength = 200;
  const isBodyTooBig = (review.content?.body?.length ?? 0) > maxBodyLength;
  return (
    <article className="mx-auto w-full max-w-xl space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-md">
      <h4 className="font-medium">{review.content?.title}</h4>
      <p className="text-sm text-muted-foreground">
        By {review.author?.authorName} on {formatDate(review._createdDate as Date)}
      </p>
      {review.content?.rating && <StarsRatingInput value={review.content.rating} />}
      <p
        className={cn(
          !isShowMoreEnabled &&
            isBodyTooBig &&
            'bg-gradient-to-b from-card-foreground via-card-foreground to-card-foreground/20 bg-clip-text text-transparent'
        )}
      >
        {isShowMoreEnabled ? review.content?.body : review.content?.body?.slice(0, maxBodyLength)}
        {isBodyTooBig && (
          <button
            className="ml-1 text-sm text-primary hover:underline"
            onClick={() => setIsShowMoreEnabled(!isShowMoreEnabled)}
          >
            {isShowMoreEnabled ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>
      {review.reply && (
        <>
          <hr />
          <div className="grid grid-cols-[auto_1fr] gap-x-2">
            <ReplyIcon className="text-primary" />
            <div className="space-y-4">
              <h4 className="font-medium">Next-E-Guitars team</h4>
              <p>{review.reply.message}</p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export function ProductReviewCardSkeleton() {
  return (
    <article className="mx-auto w-full max-w-xl space-y-4 rounded-lg border border-muted bg-card p-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="animate-pulse fill-muted text-muted" />
        ))}
      </div>
      <Skeleton className="h-16" />
    </article>
  );
}
