import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import ProductCard, { ProductCardSkeleton, ProductGrid } from "@/components/product/ProductCard";
import { useCollections, useProducts } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/format";
import type { Product } from "@/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

const sortProducts = (products: Product[], sort: SortKey) => {
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => (a.priceInNaira ?? Infinity) - (b.priceInNaira ?? Infinity));
    case "price-desc":
      return [...products].sort((a, b) => (b.priceInNaira ?? -1) - (a.priceInNaira ?? -1));
    case "newest":
      return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    default:
      return products;
  }
};

const CollectionsPage = () => {
  const [params, setParams] = useSearchParams();
  const active = params.get("c") || "";
  const search = params.get("q") || "";
  const sort = (params.get("sort") as SortKey) || "featured";
  const { data: collections = [] } = useCollections();
  const products = useProducts({ collection: active || undefined, search: search || undefined });
  const activeCollection = useMemo(() => collections.find((c) => c.slug === active), [collections, active]);
  const sorted = useMemo(() => sortProducts(products.data ?? [], sort), [products.data, sort]);

  useDocumentTitle(activeCollection ? activeCollection.name : "Shop");

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  const title = search ? `Search: “${search}”` : activeCollection ? activeCollection.name : "Shop all";
  const tabs = [{ slug: "", name: "All" }, ...collections];

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <div className="py-8 sm:py-10">
        <h1 className="text-[24px] sm:text-[28px]">{title}</h1>
        {activeCollection?.description && !search && (
          <p className="mt-2 max-w-xl text-xs text-stone">{activeCollection.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-4 border-y border-line py-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Collections">
          {tabs.map((tab) => {
            const isActive = !search && tab.slug === active;
            return (
              <button
                key={tab.slug || "all"}
                type="button"
                onClick={() => update({ c: tab.slug, q: "" })}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 whitespace-nowrap text-xs uppercase tracking-[0.12em]",
                  isActive ? "underline underline-offset-[6px]" : "text-stone hover:text-ink",
                )}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center justify-between gap-4 text-xs sm:justify-end">
          <span className="tabular text-stone">
            {products.isLoading ? "" : `${sorted.length} ${sorted.length === 1 ? "item" : "items"}`}
          </span>
          {search && (
            <button
              type="button"
              onClick={() => update({ q: "" })}
              className="inline-flex items-center gap-1 text-stone hover:text-ink"
            >
              Clear search <X className="h-3 w-3" strokeWidth={1.5} />
            </button>
          )}
          <label className="flex items-center gap-2">
            <span className="text-stone">Sort</span>
            <select
              value={sort}
              onChange={(event) => update({ sort: event.target.value === "featured" ? "" : event.target.value })}
              className="bg-transparent text-xs focus:outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="pt-6">
        {products.isLoading ? (
          <ProductGrid>
            {Array.from({ length: 8 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </ProductGrid>
        ) : sorted.length > 0 ? (
          <ProductGrid>
            {sorted.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </ProductGrid>
        ) : (
          <div className="py-20 text-center text-xs">
            <p>{products.isError ? "We couldn't load the products." : "No products found."}</p>
            <Link to="/collections" className="mt-3 inline-block underline underline-offset-4">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;
