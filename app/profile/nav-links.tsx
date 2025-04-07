'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';

const links = [
  { id: 1, name: 'Contact info', href: '/profile' },
  { id: 2, name: 'Orders', href: '/profile/orders' },
  { id: 3, name: 'Reviews', href: '/profile/reviews' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col md:flex-row md:justify-center md:gap-x-2">
      {links.map(({ id, name, href }) => (
        <Button key={id} variant="ghost" size="sm" asChild>
          <Link
            href={href}
            className={cn(
              'hover:bg-background hover:text-foreground',
              href === pathname &&
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
            )}
          >
            {name}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
