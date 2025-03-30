import { useToast } from '@/app/hooks/use-toast';
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createReview,
  type CreateReviewValues,
  deleteReview,
  fetchReviews,
  type FetchReviewsOptions,
} from '@/app/lib/wix-api.reviews';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';
import type { reviews } from '@wix/reviews';

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

export const useDeleteReviewMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: reviews.Review) => deleteReview(getWixBrowserClient(), review),
    onSuccess: (deletedReview) => {
      queryClient.setQueriesData<InfiniteData<reviews.ReviewsQueryResult>>(
        { queryKey: ['reviews'] },
        (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((review) => review._id !== deletedReview?._id),
            })),
          };
        }
      );
      toast({
        description: 'Your review was successfully deleted!',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to delete a review. Please try again.',
      });
    },
  });
};
