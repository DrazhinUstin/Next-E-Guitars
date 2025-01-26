import LoadingButton from '@/app/components/loading-button';
import { ButtonProps } from '@/app/components/ui/button';
import { useProductCheckout } from '@/app/hooks/checkout';
import type { CreateCheckoutUrlFromProductValues } from '@/app/lib/wix-api.checkout';
import { CreditCardIcon } from 'lucide-react';

export default function ProductCheckoutButton({
  product,
  selectedOptions,
  quantity,
  ...props
}: CreateCheckoutUrlFromProductValues & ButtonProps) {
  const { isPending, startCheckoutFlow } = useProductCheckout();
  return (
    <LoadingButton
      variant="secondary"
      {...props}
      type="button"
      loading={isPending}
      onClick={() => startCheckoutFlow({ product, selectedOptions, quantity })}
    >
      <CreditCardIcon /> Buy now
    </LoadingButton>
  );
}
