import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import type { reviews } from '@wix/reviews';
import { EllipsisIcon, FilePenLineIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import DeleteReviewDialog from '@/app/components/reviews/delete-review-dialog';
import EditReviewDialog from '@/app/components/reviews/edit-review-dialog';

export default function ReviewCardControls({ review }: { review: reviews.Review }) {
  const [isEditReviewDialogOpen, setIsEditReviewDialogOpen] = useState<boolean>(false);
  const [isDeleteReviewDialogOpen, setIsDeleteReviewDialogOpen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsEditReviewDialogOpen(true)}>
            <FilePenLineIcon className="text-primary" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteReviewDialogOpen(true)}
          >
            <Trash2Icon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditReviewDialog
        review={review}
        open={isEditReviewDialogOpen}
        onOpenChange={setIsEditReviewDialogOpen}
      />
      <DeleteReviewDialog
        review={review}
        open={isDeleteReviewDialogOpen}
        onOpenChange={setIsDeleteReviewDialogOpen}
      />
    </>
  );
}
