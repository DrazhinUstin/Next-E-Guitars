import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import type { reviews } from '@wix/reviews';
import { EllipsisIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import DeleteReviewDialog from '@/app/components/reviews/delete-review-dialog';

export default function ReviewCardControls({ review }: { review: reviews.Review }) {
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
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteReviewDialogOpen(true)}
          >
            <Trash2Icon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteReviewDialog
        review={review}
        open={isDeleteReviewDialogOpen}
        onOpenChange={setIsDeleteReviewDialogOpen}
      />
    </>
  );
}
