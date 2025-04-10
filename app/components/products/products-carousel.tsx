import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { products } from '@wix/stores';
import ProductCard from '@/app/components/products/product-card';
import { Skeleton } from '@/app/components/ui/skeleton';

export default function ProductsCarousel({ products }: { products: products.Product[] }) {
  return (
    <Carousel opts={{ align: 'start' }} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export function ProductsCarouselSkeleton() {
  return (
    <div className="-ml-4 flex overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="w-full shrink-0 pl-4 md:basis-1/2 lg:basis-1/3">
          <div className="p-1">
            <Skeleton className="h-80" />
          </div>
        </div>
      ))}
    </div>
  );
}
