import { type QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { cart } from '@wix/ecom';
import { addToCart, fetchCart } from '@/app/lib/wix-api.cart';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';
import type { products } from '@wix/stores';
import { useToast } from '@/app/hooks/use-toast';

const queryKey: QueryKey = ['cart'];

export const useCartQuery = (initialData: cart.Cart | null) => {
  return useQuery({
    queryKey,
    queryFn: () => fetchCart(getWixBrowserClient()),
    initialData,
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      product,
      selectedOptions,
      quantity,
    }: {
      product: products.Product;
      selectedOptions: Record<string, string>;
      quantity: number;
    }) => addToCart(getWixBrowserClient(), { product, selectedOptions, quantity }),
    onSuccess: async (updatedCart) => {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<cart.Cart>(queryKey, updatedCart);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to add a product to the cart. Please try again.',
      });
    },
  });
};
