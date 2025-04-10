'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import { Button } from '@/app/components/ui/button';
import { cart } from '@wix/ecom';
import {
  useCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from '@/app/hooks/cart';
import WixImage from '@/app/components/wix-image';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import CartCheckoutButton from '@/app/components/cart/cart-checkout-button';

export default function CartSheet({
  initialCartData,
  open,
  onOpenChange,
}: {
  initialCartData: cart.Cart | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { isFetching, data } = useCartQuery(initialCartData);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="grid grid-rows-[auto_1fr_auto]">
        <SheetHeader>
          <SheetTitle>Your shopping cart</SheetTitle>
          <SheetDescription className="hidden" />
        </SheetHeader>
        <ul className="space-y-4 overflow-y-auto pt-1">
          {data?.lineItems?.map((lineItem) => (
            <CartLineItem
              key={lineItem._id}
              lineItem={lineItem}
              onLinkClick={() => onOpenChange(false)}
            />
          ))}
          {!data?.lineItems?.length && (
            <li className="grid h-full place-items-center text-center">
              <div className="space-y-4">
                <h4 className="text-muted-foreground">You cart is empty</h4>
                <Button asChild>
                  <Link href="/products">Fill It</Link>
                </Button>
              </div>
            </li>
          )}
        </ul>
        <div className="grid grid-cols-[1fr_auto] items-center gap-1">
          <div>
            <p>Subtotal amount:</p>
            {/* @ts-expect-error subtotal currently is not included in WIX SDK  */}
            <p className="font-medium">{data?.subtotal?.formattedConvertedAmount}</p>
          </div>
          <CartCheckoutButton disabled={isFetching || !data?.lineItems?.length} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CartLineItem({
  lineItem,
  onLinkClick,
}: {
  lineItem: cart.LineItem;
  onLinkClick: () => void;
}) {
  const updateQuantityMutation = useUpdateCartItemQuantityMutation();
  const removeCartItemMutation = useRemoveCartItemMutation();
  return (
    <li className="grid grid-cols-[auto_1fr] gap-2">
      <div className="relative">
        <Link href={`/products/${lineItem.catalogReference?.catalogItemId}`} onClick={onLinkClick}>
          <WixImage
            wixMediaIdentifier={lineItem.image}
            targetWidth={100}
            targetHeight={100}
            scaleToFill
            alt={lineItem.productName?.translated}
            className="size-24 rounded-sm border"
          />
        </Link>
        <button
          className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-destructive-foreground"
          onClick={() => removeCartItemMutation.mutate(lineItem._id as string)}
        >
          <XIcon className="size-4" />
        </button>
      </div>
      <div className="space-y-1 text-sm">
        <h4 className="font-semibold">
          <Link
            href={`/products/${lineItem.catalogReference?.catalogItemId}`}
            onClick={onLinkClick}
          >
            {lineItem.productName?.translated}
          </Link>
        </h4>
        {!!lineItem.descriptionLines?.length && (
          <ul className="flex flex-wrap items-center gap-x-1">
            {lineItem.descriptionLines.map(({ name, colorInfo, plainText }, index, arr) => (
              <li key={name?.translated} className="flex items-center gap-x-1">
                <span className="font-medium">{name?.translated}:</span>
                {colorInfo ? (
                  <>
                    <span
                      className="size-3 shrink-0 rounded-full border"
                      style={{ backgroundColor: colorInfo.code ?? undefined }}
                    />
                    {colorInfo.translated}
                  </>
                ) : (
                  plainText?.translated
                )}
                {index < arr.length - 1 && ','}
              </li>
            ))}
          </ul>
        )}
        <p className="font-medium">
          {lineItem.price?.formattedConvertedAmount}
          {lineItem.fullPrice?.convertedAmount !== lineItem.price?.convertedAmount && (
            <>
              {' '}
              <span className="text-destructive line-through">
                {lineItem.fullPrice?.formattedConvertedAmount}
              </span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2 font-medium">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() =>
              updateQuantityMutation.mutate({
                _id: lineItem._id as string,
                quantity: (lineItem.quantity as number) - 1,
              })
            }
            disabled={!!lineItem.quantity && lineItem.quantity <= 1}
          >
            <MinusIcon />
          </Button>
          {lineItem.quantity}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() =>
              updateQuantityMutation.mutate({
                _id: lineItem._id as string,
                quantity: (lineItem.quantity as number) + 1,
              })
            }
            disabled={
              !!lineItem.quantity &&
              !!lineItem.availability?.quantityAvailable &&
              lineItem.quantity >= lineItem.availability.quantityAvailable
            }
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </li>
  );
}
