'use client';

import type { ButtonProps } from '@/app/components/ui/button';
import { useCheckout } from '@/app/hooks/checkout';
import LoadingButton from '@/app/components/loading-button';

export default function CheckoutButton(props: ButtonProps) {
  const { isPending, startCheckoutFlow } = useCheckout();
  return (
    <LoadingButton {...props} loading={isPending} onClick={startCheckoutFlow}>
      Checkout
    </LoadingButton>
  );
}
