'use client';

import { Button, type ButtonProps } from '@/app/components/ui/button';
import { useState } from 'react';
import CreateProductReviewDialog from './create-product-review-dialog';
import type { products } from '@wix/stores';
import { PlusIcon } from 'lucide-react';
import type { members } from '@wix/members';
import { useAuth } from '@/app/hooks/use-auth';

export default function CreateProductReviewButton({
  product,
  loggedInMember,
  ...props
}: {
  product: products.Product;
  loggedInMember: members.Member | null;
} & ButtonProps) {
  const { login } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  if (!loggedInMember) {
    return (
      <Button {...props} type="button" onClick={login}>
        Login to create review
      </Button>
    );
  }

  return (
    <>
      <Button {...props} type="button" onClick={() => setIsDialogOpen(true)}>
        <PlusIcon /> Create review
      </Button>
      <CreateProductReviewDialog
        product={product}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
