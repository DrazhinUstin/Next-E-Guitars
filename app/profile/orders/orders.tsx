'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/app/lib/wix-api.orders';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';
import OrderCard from '@/app/components/order-card';
import LoadingButton from '@/app/components/loading-button';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function Orders() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['orders'],
    queryFn: ({ pageParam }) => fetchOrders(getWixBrowserClient(), { cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.metadata?.cursors?.next,
  });

  const orders = data?.pages.flatMap((item) => item.orders);

  return (
    <div className="space-y-8">
      {status === 'pending' && <OrdersSkeleton />}
      {status === 'error' && (
        <p className="text-center text-destructive">There was an error while loading orders...</p>
      )}
      {status === 'success' && !hasNextPage && !orders?.length && (
        <p className="text-center text-muted-foreground">You have no any orders to display...</p>
      )}
      {orders?.map((order) => <OrderCard key={order.number} order={order} />)}
      {hasNextPage && (
        <div className="text-center">
          <LoadingButton onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Load more
          </LoadingButton>
        </div>
      )}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="mx-auto h-80 max-w-2xl" />
      ))}
    </div>
  );
}
