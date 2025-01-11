import { fetchProducts, type FetchProductsOptions } from '@/app/lib/wix-api';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import ProductCard from '@/app/components/product-card';
import { Skeleton } from '@/app/components/ui/skeleton';
import PaginationBar from '@/app/components/pagination-bar';

export default async function Products({ queryOptions }: { queryOptions?: FetchProductsOptions }) {
  const wixClient = await getWixServerClient();
  const data = await fetchProducts(wixClient, queryOptions ?? {});
  const currentPage = (data.currentPage ?? 0) + 1;
  const totalPages = data.totalPages ?? 1;
  return (
    <div className="space-y-8">
      {!data.items.length && (
        <p className="text-center text-muted-foreground">&#x1F614; No products were found...</p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-8">
        {data.items.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}

export function ProductsSkeleton({ length = 12 }: { length?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-8">
      {Array.from({ length }).map((_, index) => (
        <Skeleton key={index} className="h-64" />
      ))}
    </div>
  );
}
