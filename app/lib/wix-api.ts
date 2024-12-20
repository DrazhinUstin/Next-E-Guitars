import { cache } from 'react';
import type { WixClientType } from '@/app/lib/wix-client.base';

export const fetchProductById = cache(async (wixClient: WixClientType, id: string) => {
  try {
    const { product } = await wixClient.products.getProduct(id);
    return product?.visible ? product : null;
  } catch (error) {
    console.error(error);
    throw Error('Database error: Failed to fetch a product by ID');
  }
});
