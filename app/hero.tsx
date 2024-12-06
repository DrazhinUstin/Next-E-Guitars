import { Button } from '@/app/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import heroImage from '@/public/girl_with_guitar.jpg';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative grid sm:grid-cols-2">
      <div className="grid place-items-center px-4 py-8 sm:bg-secondary">
        <div className="space-y-4 text-center text-white sm:text-foreground">
          <h2 className="text-2xl font-semibold">Buy the guitar of your dream</h2>
          <p>We have many guitars to please you at a good price</p>
          <Button asChild>
            <Link href="/products" className="group">
              Shop now
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 sm:relative">
        <Image src={heroImage} alt="hero image" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 sm:bg-gradient-to-r sm:from-secondary sm:via-transparent sm:to-transparent" />
      </div>
    </section>
  );
}
