import type { WixClientType } from '@/app/lib/wix-client.base';
import type { products } from '@wix/stores';
import { WIX_STORES_APP_ID } from '@/app/lib/constants';
import { findProductVariant } from '@/app/lib/utils';

export async function fetchCart(wixClient: WixClientType) {
  try {
    const cart = await wixClient.currentCart.getCurrentCart();
    return cart;
  } catch (error) {
    if ((error as any)?.details?.applicationError?.code === 'OWNED_CART_NOT_FOUND') {
      return null;
    }
    console.error(error);
    throw Error('Error: Failed to fetch a cart');
  }
}

export async function addToCart(
  wixClient: WixClientType,
  {
    product,
    selectedOptions,
    quantity,
  }: { product: products.Product; selectedOptions: Record<string, string>; quantity: number }
) {
  try {
    const productVariant = findProductVariant(product, selectedOptions);
    const data = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: WIX_STORES_APP_ID,
            catalogItemId: product._id,
            options: productVariant
              ? { variantId: productVariant._id }
              : { options: selectedOptions },
          },
          quantity,
        },
      ],
    });
    return data.cart;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to add a product to the cart');
  }
}
