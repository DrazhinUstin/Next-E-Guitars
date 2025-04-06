'use client';

import type { reviews } from '@wix/reviews';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import LoadingButton from '@/app/components/loading-button';
import StarsRatingInput from '@/app/components/stars-rating-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEditReviewMutation } from '@/app/hooks/reviews';
import { usePathname, useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, {
      message: 'Title must be at least 5 characters.',
    })
    .max(100, {
      message: 'Title must be no longer than 100 characters.',
    })
    .or(z.literal('')),
  body: z
    .string()
    .trim()
    .min(20, {
      message: 'Body must be at least 20 characters.',
    })
    .max(1000, {
      message: 'Body must be no longer than 1000 characters.',
    })
    .or(z.literal('')),
  rating: z.number().int().gte(1).lte(5),
});

export default function EditReviewDialog({
  review,
  open,
  onOpenChange,
}: {
  review: reviews.Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useEditReviewMutation();
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: review.content?.title ?? '',
      body: review.content?.body ?? '',
      rating: review.content?.rating ?? 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(
      { oldReview: review, newContent: values },
      {
        onSuccess: () => {
          if (pathname === `/products/${review.entityId}`) router.refresh();
          onOpenChange(false);
        },
      }
    );
  }

  const wasReviewEdited = Object.entries(form.getValues()).some(
    ([key, val]) => ({ ...form.formState.defaultValues })[key] !== val
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !mutation.isPending && onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit review</DialogTitle>
          <DialogDescription>
            Fill out the form fields and click the edit button to edit your product review.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarsRatingInput value={field.value} onValueChange={field.onChange} />
                  </FormControl>
                  <FormDescription>Rate the product from 1 to 5</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My review" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your opinion about the product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={mutation.isPending}>
                  Close
                </Button>
              </DialogClose>
              <LoadingButton type="submit" disabled={!wasReviewEdited} loading={mutation.isPending}>
                Edit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
