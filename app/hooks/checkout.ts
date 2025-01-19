'use client';

import { useToast } from '@/app/hooks/use-toast';
import { useState } from 'react';
import { createCheckoutUrlFromCart } from '@/app/lib/wix-api.cart';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';

export const useCheckout = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { toast } = useToast();

  async function startCheckoutFlow() {
    setIsPending(true);
    try {
      const checkoutUrl = await createCheckoutUrlFromCart(getWixBrowserClient());
      if (!checkoutUrl) throw Error();
      window.location.href = checkoutUrl;
    } catch (error) {
      setIsPending(false);
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to start a checkout flow. Please try again.',
      });
    }
  }

  return { isPending, startCheckoutFlow };
};
