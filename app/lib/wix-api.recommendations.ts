import type { WixClientType } from '@/app/lib/wix-client.base';
import { WIX_STORES_APP_ID } from '@/app/lib/constants';
import { recommendations } from '@wix/ecom';

export async function fetchRelatedProducts(
  wixClient: WixClientType,
  productId: string,
  limit: number = 4
) {
  try {
    const { availableAlgorithms } = await wixClient.recommendations.listAvailableAlgorithms();

    const algorithms: recommendations.Algorithm[] = availableAlgorithms
      .filter(({ config }) => config?.algorithmType === recommendations.AlgorithmType.RELATED_ITEMS)
      .map(({ appId, config }) => ({ _id: config?.algorithmId, appId }))
      .slice(0, 3);

    const { recommendation } = await wixClient.recommendations.getRecommendation(algorithms, {
      items: [{ appId: WIX_STORES_APP_ID, catalogItemId: productId }],
      minimumRecommendedItems: 1,
    });

    if (!recommendation?.items.length) {
      return [];
    }

    const { items: products } = await wixClient.products
      .queryProducts()
      .in(
        '_id',
        recommendation.items.map((item) => item.catalogItemId)
      )
      .limit(limit)
      .find();

    return products;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch related products');
  }
}
