'use client';

import { Button } from '@/app/components/ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import { useCartQuery } from '@/app/hooks/cart';
import type { cart } from '@wix/ecom';
import { useState } from 'react';
import CartSheet from '@/app/components/cart-sheet';

export default function CartButton({ initialData }: { initialData: cart.Cart | null }) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { data } = useCartQuery(initialData);
  const totalQuantity = data?.lineItems?.reduce((acc, item) => acc + (item.quantity ?? 0), 0);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative [&_svg]:size-6"
        onClick={() => setIsSheetOpen(true)}
      >
        <ShoppingCartIcon />
        <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
          {totalQuantity ?? 0}
        </span>
      </Button>
      <CartSheet initialCartData={initialData} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
