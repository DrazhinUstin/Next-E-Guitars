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

export const sortValues = {
  lastUpdated_desc: 'Last updated (descending)',
  lastUpdated_asc: 'Last updated (ascending)',
  name_desc: 'Name (descending)',
  name_asc: 'Name (ascending)',
  price_desc: 'Price (descending)',
  price_asc: 'Price (ascending)',
} as const;

export interface FetchProductsOptions {
  filters?: {
    name?: string;
    collectionIds?: string[] | string;
  };
  sort?: keyof typeof sortValues;
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
      case 'name_asc':
        query = query.ascending('name');
        break;
      case 'name_desc':
        query = query.descending('name');
        break;
      case 'price_asc':
        query = query.ascending('price');
        break;
      case 'price_desc':
        query = query.descending('price');
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
