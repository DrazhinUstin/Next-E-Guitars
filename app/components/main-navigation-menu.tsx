'use client';

import type { collections } from '@wix/stores';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/app/components/ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import WixImage from '@/app/components/wix-image';

export default function MainNavigationMenu({
  collections,
  className,
}: {
  collections: collections.Collection[];
  className?: string;
}) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/products" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Shop</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-max grid-cols-2 gap-2 p-2">
              {collections.map(({ _id, slug, name, media }) => (
                <li key={_id}>
                  <Link href={`/collections/${slug}`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'h-full w-full gap-x-2 text-base'
                      )}
                    >
                      <WixImage
                        wixMediaIdentifier={media?.mainMedia?.image?.url}
                        targetWidth={40}
                        targetHeight={40}
                        scaleToFill
                        alt={media?.mainMedia?.image?.altText}
                        className="size-10 rounded-sm"
                      />
                      {name}
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
