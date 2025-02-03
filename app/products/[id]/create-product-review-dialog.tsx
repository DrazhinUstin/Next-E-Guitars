'use client';

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
import { useCreateProductReviewMutation } from '@/app/hooks/reviews';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import type { products } from '@wix/stores';
import WixImage from '@/app/components/wix-image';

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

export default function CreateProductReviewDialog({
  product,
  open,
  onOpenChange,
}: {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useCreateProductReviewMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      rating: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(
      { productId: product._id as string, content: values },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !mutation.isPending && onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a review</DialogTitle>
          <DialogDescription>
            Fill out the form fields and click a submit button to add a review about the product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <WixImage
                wixMediaIdentifier={product.media?.mainMedia?.image?.url}
                targetWidth={50}
                targetHeight={50}
                scaleToFill
                alt={product.media?.mainMedia?.image?.altText}
              />
              <h4 className="font-semibold">{product.name}</h4>
            </div>
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
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
