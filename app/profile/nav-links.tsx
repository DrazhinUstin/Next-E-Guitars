'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';

const links = [
  { id: 1, name: 'Edit profile', href: '/profile' },
  { id: 2, name: 'Orders', href: '/profile/orders' },
  { id: 3, name: 'Reviews', href: '/profile/reviews' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex justify-center gap-2">
      {links.map(({ id, name, href }) => (
        <Link
          key={id}
          href={href}
          className={cn('text-muted-foreground', href === pathname && 'text-primary underline')}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
