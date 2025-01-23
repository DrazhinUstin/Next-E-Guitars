import type { WixClientType } from '@/app/lib/wix-client.base';

export async function fetchOrderById(wixClient: WixClientType, orderId: string) {
  try {
    const order = await wixClient.orders.getOrder(orderId);
    return order;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch an order by id');
  }
}
