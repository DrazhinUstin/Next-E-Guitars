import {
  type MutationKey,
  type QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { cart } from '@wix/ecom';
import {
  addToCart,
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from '@/app/lib/wix-api.cart';
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
      queryClient.setQueryData<cart.Cart | null>(queryKey, updatedCart);
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

export const useUpdateCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutationKey: MutationKey = ['update-cart-item-quantity'];

  return useMutation({
    mutationKey,
    mutationFn: (quantityUpdate: cart.LineItemQuantityUpdate) =>
      updateCartItemQuantity(getWixBrowserClient(), quantityUpdate),
    onMutate: async (quantityUpdate) => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<cart.Cart | null>(queryKey);
      queryClient.setQueryData<cart.Cart | null>(queryKey, (oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          lineItems: oldCart.lineItems?.map((lineItem) =>
            lineItem._id === quantityUpdate._id
              ? { ...lineItem, quantity: quantityUpdate.quantity }
              : lineItem
          ),
        };
      });
      return { prevState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to update cart item quantity. Please try again.',
      });
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => removeCartItem(getWixBrowserClient(), id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<cart.Cart | null>(queryKey);
      queryClient.setQueryData<cart.Cart | null>(queryKey, (oldCart) => {
        if (!oldCart) return oldCart;
        return {
          ...oldCart,
          lineItems: oldCart.lineItems?.filter((lineItem) => lineItem._id !== id),
        };
      });
      return { prevState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'Failed to remove cart item. Please try again.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
