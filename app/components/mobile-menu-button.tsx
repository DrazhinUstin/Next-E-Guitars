'use client';

import { Button } from '@/app/components/ui/button';
import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { collections } from '@wix/stores';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';

export default function MobileMenuButton({
  collections,
}: {
  collections: collections.Collection[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [menuHeight, setMenuHeight] = useState<number>(0);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleResize() {
      if (document.documentElement.clientWidth >= 768) {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (isMenuOpen) {
      const childrenHeight = [...menu.children].reduce(
        (acc, elem) => acc + (elem as HTMLElement).offsetHeight,
        0
      );
      setMenuHeight(childrenHeight);
    } else {
      setMenuHeight(0);
    }
  }, [isMenuOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden [&_svg]:size-6"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MenuIcon className={cn('transition-all', isMenuOpen && 'rotate-90')} />
      </Button>
      <ul
        style={{ height: menuHeight, visibility: isMenuOpen ? 'visible' : 'hidden' }}
        className="absolute left-0 top-full w-full overflow-hidden bg-background text-center shadow-lg transition-all"
        ref={menuRef}
      >
        <li className="border-t py-2">
          <Link
            href="/products"
            className="hover:text-primary hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Shop
          </Link>
        </li>
        <Submenu
          title="Collections"
          items={collections.map(({ _id, name, slug }) => ({
            id: _id as string,
            name: name as string,
            href: `/collections/${slug}`,
          }))}
          onOpenChange={(submenuHeight) => setMenuHeight(menuHeight + submenuHeight)}
          isMainMenuOpen={isMenuOpen}
          closeMainMenu={() => setIsMenuOpen(false)}
        />
      </ul>
    </>
  );
}

function Submenu({
  title,
  items,
  onOpenChange,
  isMainMenuOpen,
  closeMainMenu,
}: {
  title: string;
  items: { id: string; name: string; href: string }[];
  onOpenChange: (submenuHeight: number) => void;
  isMainMenuOpen: boolean;
  closeMainMenu: () => void;
}) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const [submenuHeight, setSubmenuHeight] = useState<number>(0);
  const submenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isMainMenuOpen) {
      setIsSubmenuOpen(false);
      setSubmenuHeight(0);
    }
  }, [isMainMenuOpen]);

  const handleClick = () => {
    const submenu = submenuRef.current;
    if (!submenu) return;
    const childrenHeight = [...submenu.children].reduce(
      (acc, elem) => acc + (elem as HTMLElement).offsetHeight,
      0
    );
    if (!isSubmenuOpen) {
      setSubmenuHeight(childrenHeight);
      onOpenChange(childrenHeight);
    } else {
      setSubmenuHeight(0);
      onOpenChange(-childrenHeight);
    }
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <li className="border-t py-2">
      <h4 className="flex cursor-pointer items-center justify-center gap-2" onClick={handleClick}>
        {title}
        <ChevronDownIcon className={cn('size-4 transition-all', isSubmenuOpen && 'rotate-180')} />
      </h4>
      <ul
        style={{ height: submenuHeight, visibility: isSubmenuOpen ? 'visible' : 'hidden' }}
        className="overflow-hidden bg-secondary transition-all"
        ref={submenuRef}
      >
        {items.map(({ id, name, href }, index) => (
          <li key={id} className={cn('py-2', index !== 0 && 'border-t')}>
            <Link
              href={href}
              className="hover:text-primary hover:underline"
              onClick={closeMainMenu}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
