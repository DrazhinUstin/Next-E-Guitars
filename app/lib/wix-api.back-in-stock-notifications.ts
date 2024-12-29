import type { WixClientType } from '@/app/lib/wix-client.base';
import { products } from '@wix/stores';
import { findProductVariant } from '@/app/lib/utils';
import { env } from '@/env';

export async function createBackInStockNotificationRequest(
  wixClient: WixClientType,
  {
    product,
    selectedOptions,
    email,
  }: { product: products.Product; selectedOptions: Record<string, string>; email: string }
) {
  try {
    const productVariant = findProductVariant(product, selectedOptions);

    const response = await wixClient.backInStockNotifications.createBackInStockNotificationRequest(
      {
        email,
        itemUrl: `${env.NEXT_PUBLIC_APP_BASE_URL}/products/${product._id}`,
        catalogReference: {
          appId: '1380b703-ce81-ff05-f115-39571d94dfcd',
          catalogItemId: product._id,
          options: productVariant
            ? { variantId: productVariant._id }
            : { options: selectedOptions },
        },
      },
      {
        name: product.name ?? undefined,
        image:
          product.productOptions
            ?.flatMap(
              ({ name, choices }) =>
                choices?.find(({ description }) => selectedOptions[name ?? ''] === description)
                  ?.media?.items ?? []
            )
            .find(({ mediaType }) => mediaType === products.MediaItemType.image)?.image?.url ??
          product.media?.mainMedia?.image?.url,
        price:
          productVariant?.variant?.priceData?.discountedPrice?.toString() ??
          product.priceData?.discountedPrice?.toString(),
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
