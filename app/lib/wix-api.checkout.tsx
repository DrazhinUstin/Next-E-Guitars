import { WixClientType } from '@/app/lib/wix-client.base';
import { checkout } from '@wix/ecom';
import type { products } from '@wix/stores';
import { WIX_STORES_APP_ID } from '@/app/lib/constants';
import { findProductVariant } from '@/app/lib/utils';
import { env } from '@/env';

export type CreateCheckoutUrlFromProductValues = {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
};

export async function createCheckoutUrlFromProduct(
  wixClient: WixClientType,
  { product, selectedOptions, quantity }: CreateCheckoutUrlFromProductValues
) {
  const productVariant = findProductVariant(product, selectedOptions);
  try {
    const { _id: checkoutId } = await wixClient.checkout.createCheckout({
      channelType: checkout.ChannelType.WEB,
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

    if (!checkoutId) throw Error(`Checkout _id is ${checkoutId}`);

    const { redirectSession } = await wixClient.redirects.createRedirectSession({
      ecomCheckout: { checkoutId },
      callbacks: {
        postFlowUrl: window.location.href,
        thankYouPageUrl: `${env.NEXT_PUBLIC_APP_BASE_URL}/checkout-success`,
      },
    });

    if (!redirectSession) throw Error(`redirectSession is ${redirectSession}`);

    return redirectSession.fullUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
