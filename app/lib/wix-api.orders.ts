import type { WixClientType } from '@/app/lib/wix-client.base';
import type { orders } from '@wix/ecom';

export async function fetchOrderById(wixClient: WixClientType, orderId: string) {
  try {
    const order = await wixClient.orders.getOrder(orderId);
    return order;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch an order by id');
  }
}

export async function fetchOrders(
  wixClient: WixClientType,
  { cursor, limit = 4 }: orders.CursorPaging
) {
  try {
    const orders = await wixClient.orders.searchOrders({
      search: {
        cursorPaging: { cursor, limit },
      },
    });
    return orders;
  } catch (error) {
    console.error(error);
    throw Error('Error: Failed to fetch orders');
  }
}
