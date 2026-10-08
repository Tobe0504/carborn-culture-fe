import { useMemo } from "react";
import { useCollections, useProducts } from "@/hooks/useStore";
import { cn } from "@/lib/format";
import ProductCard, { ProductCardSkeleton, ProductGrid } from "./ProductCard";

interface CategoryShopProps {
  active: string;
  onSelect: (slug: string) => void;
  search?: string;
}

const CategoryShop = ({ active, onSelect, search }: CategoryShopProps) => {
  const { data: collections = [], isLoading: collectionsLoading } = useCollections();
  const selected = useMemo(
    () => (search ? undefined : collections.find((c) => c.slug === active) ?? collections[0]),
    [collections, active, search],
  );
  const products = useProducts(
    search ? { search } : { collection: selected?.slug },
  );
  const waiting = collectionsLoading || (!search && !selected) || products.isLoading;

  return (
    <div>
      <nav className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0" aria-label="Categories">
        {collections.map((collection) => {
          const isActive = selected?.slug === collection.slug;
          return (
            <button
              key={collection.id}
              type="button"
              onClick={() => onSelect(collection.slug)}
              aria-pressed={isActive}
              className={cn(
                "-mb-px shrink-0 whitespace-nowrap border-b-2 pb-3 text-xs uppercase tracking-[0.12em] transition-colors",
                isActive ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink",
              )}
            >
              {collection.name}
            </button>
          );
        })}
      </nav>

      {selected?.description && <p className="mt-4 max-w-xl text-xs text-stone">{selected.description}</p>}

      <div className="pt-6">
        {waiting ? (
          <ProductGrid>
            {Array.from({ length: 4 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </ProductGrid>
        ) : products.data && products.data.length > 0 ? (
          <ProductGrid>
            {products.data.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </ProductGrid>
        ) : (
          <p className="py-16 text-center text-xs text-stone">
            {products.isError ? "We couldn't load the products. Please refresh." : "New pieces coming soon."}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryShop;
