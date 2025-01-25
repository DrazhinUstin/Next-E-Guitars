import type { Metadata } from 'next';
import { fetchOrderById } from '@/app/lib/wix-api.orders';
import { notFound } from 'next/navigation';
import OrderCard from '@/app/components/order-card';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import Link from 'next/link';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import DeleteCart from '@/app/checkout-success/delete-cart';

export const metadata: Metadata = {
  title: 'Thank you for your order!',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();
  const wixClient = await getWixServerClient();
  const [order, member] = await Promise.all([
    fetchOrderById(wixClient, orderId),
    fetchLoggedInMember(wixClient),
  ]);
  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Thank you for your order!</h2>
      <p className="text-center">A summary of your order was sent to your email address.</p>
      <div className="flex justify-center">
        <OrderCard order={order} />
      </div>
      {member && (
        <p className="text-center">
          <Link href="/profile/orders" className="text-primary hover:underline">
            View all your orders
          </Link>
        </p>
      )}
      {!!order._createdDate &&
        new Date(order._createdDate).getTime() > new Date().getTime() - 10 * 60 * 1000 && (
          <DeleteCart />
        )}
    </main>
  );
}
