'use client';

import type { ButtonProps } from '@/app/components/ui/button';
import { useCartCheckout } from '@/app/hooks/checkout';
import LoadingButton from '@/app/components/loading-button';

export default function CartCheckoutButton(props: ButtonProps) {
  const { isPending, startCheckoutFlow } = useCartCheckout();
  return (
    <LoadingButton {...props} loading={isPending} onClick={startCheckoutFlow}>
      Checkout
    </LoadingButton>
  );
}
