import { cache } from 'react';
import type { WixClientType } from '@/app/lib/wix-client.base';

export const fetchProductById = cache(async (wixClient: WixClientType, id: string) => {
  try {
    const { product } = await wixClient.products.getProduct(id);
    return product?.visible ? product : null;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch a product by ID');
  }
});

export interface FetchProductsOptions {
  filters?: {
    name?: string;
    collectionIds?: string[] | string;
  };
  sort?: 'lastUpdated_asc' | 'lastUpdated_desc' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export async function fetchProducts(
  wixClient: WixClientType,
  { filters = {}, sort = 'lastUpdated_desc', page = 1, limit = 12 }: FetchProductsOptions
) {
  try {
    let query = wixClient.products.queryProducts();

    const { name, collectionIds } = filters;
    if (name) {
      query = query.startsWith('name', name);
    }
    if (collectionIds) {
      query = query.hasAll(
        'collectionIds',
        Array.isArray(collectionIds) ? collectionIds : [collectionIds]
      );
    }

    switch (sort) {
      case 'lastUpdated_asc':
        query = query.ascending('lastUpdated');
        break;
      case 'lastUpdated_desc':
        query = query.descending('lastUpdated');
        break;
      case 'price_asc':
        query = query.ascending('priceData.price');
        break;
      case 'price_desc':
        query = query.descending('priceData.price');
        break;
    }

    query = query.skip((page - 1) * limit);
    query = query.limit(limit);

    const response = await query.find();
    return response;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch a products');
  }
}
