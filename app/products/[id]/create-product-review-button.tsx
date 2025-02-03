'use client';

import { Button, type ButtonProps } from '@/app/components/ui/button';
import { useState } from 'react';
import CreateProductReviewDialog from './create-product-review-dialog';
import type { products } from '@wix/stores';

export default function CreateProductReviewButton({
  product,
  ...props
}: { product: products.Product } & ButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Button {...props} type="button" onClick={() => setIsDialogOpen(true)}>
        Create product review
      </Button>
      <CreateProductReviewDialog
        product={product}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
