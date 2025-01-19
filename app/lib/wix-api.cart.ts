import type { WixClientType } from '@/app/lib/wix-client.base';
import type { products } from '@wix/stores';
import { WIX_STORES_APP_ID } from '@/app/lib/constants';
import { findProductVariant } from '@/app/lib/utils';
import { currentCart } from '@wix/ecom';

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
    const response = await wixClient.currentCart.addToCurrentCart({
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
    return response.cart;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to add a product to the cart');
  }
}

export async function updateCartItemQuantity(
  wixClient: WixClientType,
  quantityUpdate: currentCart.LineItemQuantityUpdate
) {
  try {
    const response = await wixClient.currentCart.updateCurrentCartLineItemQuantity([
      quantityUpdate,
    ]);
    return response.cart;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to update cart item quantity');
  }
}

export async function removeCartItem(wixClient: WixClientType, id: string) {
  try {
    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart([id]);
    return response.cart;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to remove cart item');
  }
}

export async function deleteCart(wixClient: WixClientType) {
  try {
    await wixClient.currentCart.deleteCurrentCart();
  } catch (error) {
    if ((error as any)?.details?.applicationError?.code === 'OWNED_CART_NOT_FOUND') {
      return;
    }
    console.error(error);
    throw Error('Error: Failed to delete a cart');
  }
}

export async function createCheckoutUrlFromCart(wixClient: WixClientType) {
  try {
    const { checkoutId } = await wixClient.currentCart.createCheckoutFromCurrentCart({
      channelType: currentCart.ChannelType.WEB,
    });
    const { redirectSession } = await wixClient.redirects.createRedirectSession({
      ecomCheckout: { checkoutId },
      callbacks: { postFlowUrl: window.location.href, thankYouPageUrl: '/thank-you' },
    });
    return redirectSession?.fullUrl ?? null;
  } catch (error) {
    if ((error as any)?.details?.applicationError?.code === 'OWNED_CART_NOT_FOUND') {
      return null;
    }
    console.error(error);
    throw error;
  }
}
