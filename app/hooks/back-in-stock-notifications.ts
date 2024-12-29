import { useMutation } from '@tanstack/react-query';
import { createBackInStockNotificationRequest } from '@/app/lib/wix-api.back-in-stock-notifications';
import { getWixBrowserClient } from '../lib/wix-client.browser';
import type { products } from '@wix/stores';
import { useToast } from '@/app/hooks/use-toast';

export const useCreateBackInStockNotificationRequestMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      product,
      selectedOptions,
      email,
    }: {
      product: products.Product;
      selectedOptions: Record<string, string>;
      email: string;
    }) =>
      createBackInStockNotificationRequest(getWixBrowserClient(), {
        product,
        selectedOptions,
        email,
      }),
    onSuccess: () =>
      toast({
        description:
          'We have accepted your request. We will send you an automated email when this product becomes available.',
      }),
    onError: (error) => {
      if (
        (error as any)?.details?.applicationError?.code ===
        'BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS'
      ) {
        toast({
          description:
            'Your request has already been accepted. We will send you an automated email when this product becomes available.',
        });
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Sorry, but there was an error. Please try again.',
      });
    },
  });
};
