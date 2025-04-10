'use client';

import type { ButtonProps } from '@/app/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import { useAddToCartMutation } from '@/app/hooks/cart';
import type { products } from '@wix/stores';
import LoadingButton from '@/app/components/loading-button';

interface Props extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({ product, selectedOptions, quantity, ...props }: Props) {
  const mutation = useAddToCartMutation();
  return (
    <LoadingButton
      {...props}
      type="button"
      onClick={() => mutation.mutate({ product, selectedOptions, quantity })}
      loading={mutation.isPending}
    >
      <ShoppingCartIcon /> Add to cart
    </LoadingButton>
  );
}
