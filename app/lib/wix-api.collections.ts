import { cache } from 'react';
import type { WixClientType } from '@/app/lib/wix-client.base';

export const fetchCollectionBySlug = cache(async (wixClient: WixClientType, slug: string) => {
  try {
    const response = await wixClient.collections.getCollectionBySlug(slug);
    return response.collection ?? null;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch a collection by slug');
  }
});

export const fetchCollections = cache(async (wixClient: WixClientType) => {
  try {
    const response = await wixClient.collections
      .queryCollections()
      .ne('_id', '00000000-000000-000000-000000000001') // All Products
      .ne('_id', 'e1869e71-7aed-e7ae-412d-1b1a88248596') // Featured
      .find();
    return response.items;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch collections');
  }
});
