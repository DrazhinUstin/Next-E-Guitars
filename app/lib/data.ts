import { cache } from 'react';
import { client } from '@/app/lib/wix-client';

export const fetchProductById = cache(async (id: string) => {
  try {
    const { product } = await client.products.getProduct(id);
    return product?.visible ? product : null;
  } catch (error) {
    console.error(error);
    throw Error('Database error: Failed to fetch a product by ID');
  }
});
