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
import LoadingButton from '@/app/components/loading-button';
import { useDeleteReviewMutation } from '@/app/hooks/reviews';

export default function DeleteReviewDialog({
  review,
  open,
  onOpenChange,
}: {
  review: reviews.Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useDeleteReviewMutation();

  const handleDelete = () => {
    mutation.mutate(review, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !mutation.isPending && onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete review</DialogTitle>
          <DialogDescription>
            Are you sure that you want to delete the review? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton variant="destructive" loading={mutation.isPending} onClick={handleDelete}>
            Delete
          </LoadingButton>
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
