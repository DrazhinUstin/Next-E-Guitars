'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { Button, type ButtonProps } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { useRouter } from 'next/navigation';

export default function SearchButton({ className, ...props }: ButtonProps) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={cn('[&_svg]:size-6', className)}
        {...props}
        onClick={() => setIsSearchOpen(true)}
      >
        <SearchIcon />
      </Button>
      {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}

function Search({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get('query') as string;
    if (!query.trim()) return;
    router.push(`/products?query=${encodeURIComponent(query)}`);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="absolute right-0 top-0 z-50 w-40">
      <Input name="query" placeholder="Search..." className="pe-10" autoFocus />
      <button
        type="button"
        className="absolute right-0 top-0 grid size-10 place-items-center"
        onClick={onClose}
      >
        <XIcon className="size-6 text-destructive" />
      </button>
    </form>
  );
}
