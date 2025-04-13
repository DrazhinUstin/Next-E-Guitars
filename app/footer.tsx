import Link from 'next/link';
import GithubIcon from '@/app/components/github-icon';

export default async function Footer() {
  return (
    <footer className="h-footer flex items-center border-t">
      <div className="mx-auto w-[90vw] max-w-7xl space-y-2 sm:space-y-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <Link href="/">
            <h2 className="text-xl font-semibold">E-guitars</h2>
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link href="/products" className="hover:underline">
              Shop
            </Link>
            <Link href="/collections" className="hover:underline">
              Collections
            </Link>
          </nav>
          <div className="flex gap-x-2">
            <a
              href="https://github.com/DrazhinUstin/Next-E-Guitars"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
        <p className="text-center text-xs">
          &copy; {new Date().getFullYear()} E-guitars. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
