import { useToast } from '@/app/hooks/use-toast';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import {
  createReview,
  type CreateReviewValues,
  fetchReviews,
  type FetchReviewsOptions,
} from '@/app/lib/wix-api.reviews';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';

export const useReviewsInfiniteQuery = ({
  filters,
  sort,
}: Pick<FetchReviewsOptions, 'filters' | 'sort'>) => {
  return useInfiniteQuery({
    queryKey: ['reviews', filters, sort],
    queryFn: ({ pageParam }) =>
      fetchReviews(getWixBrowserClient(), {
        filters,
        sort,
        cursor: pageParam,
      }),
    initialPageParam: null as FetchReviewsOptions['cursor'],
    getNextPageParam: (lastPage) => lastPage.cursors.next,
  });
};

export const useCreateReviewMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: CreateReviewValues) => createReview(getWixBrowserClient(), values),
    onSuccess: () => {
      toast({
        title: 'Thank you for your review!',
        description: 'Your review will be visible after our team approves it.',
      });
    },
    onError: (error) => {
      if ((error as any)?.details?.applicationError?.code === 'ReviewExists') {
        toast({
          variant: 'destructive',
          title: 'Review already exist!',
          description:
            'You have already created a review. You cannot have two reviews for one product.',
        });
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to create a review. Please try again.',
      });
    },
  });
};
