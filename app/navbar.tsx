import Link from 'next/link';
import CartButton from '@/app/components/cart-button';
import { fetchCart } from '@/app/lib/wix-api.cart';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import UserButton from '@/app/components/user-button';

export default async function Navbar() {
  const wixServerClient = await getWixServerClient();
  const [member, cart] = await Promise.all([
    fetchLoggedInMember(wixServerClient),
    fetchCart(wixServerClient),
  ]);
  return (
    <header className="py-4 shadow-lg">
      <div className="mx-auto flex w-[90vw] max-w-7xl items-center justify-between gap-2">
        <Link href="/">
          <h2 className="text-2xl font-semibold">E-guitars</h2>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton user={member} />
          <CartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
}
