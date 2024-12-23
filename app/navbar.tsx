import Link from 'next/link';
import CartButton from '@/app/components/cart-button';
import { fetchCart } from '@/app/lib/wix-api.cart';
import { getWixServerClient } from '@/app/lib/wix-client.server';

export default async function Navbar() {
  const wixServerClient = await getWixServerClient();
  const cart = await fetchCart(wixServerClient);
  return (
    <header className="py-4 shadow-lg">
      <div className="mx-auto flex w-[90vw] max-w-7xl items-center justify-between gap-2">
        <Link href="/">
          <h2 className="text-2xl font-semibold">E-guitars</h2>
        </Link>
        <CartButton initialData={cart} />
      </div>
    </header>
  );
}
