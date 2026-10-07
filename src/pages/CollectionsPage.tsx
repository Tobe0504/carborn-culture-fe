import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import ProductCard, { ProductCardSkeleton, ProductGrid } from "@/components/product/ProductCard";
import { useCollections, useProducts } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/format";
import { BRAND_IMAGES } from "@/lib/brandImages";
import { sizedImage } from "@/lib/image";
import type { Product } from "@/types";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Our selection" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price, low to high" },
  { key: "price-desc", label: "Price, high to low" },
];

const sortProducts = (products: Product[], sort: SortKey) => {
  const priced = (p: Product) => p.priceInNaira ?? Number.POSITIVE_INFINITY;
  switch (sort) {
    case "price-asc":
      return [...products].sort((a, b) => priced(a) - priced(b));
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
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(activeCollection ? activeCollection.name : "All Collections");

  useEffect(() => {
    if (!sortOpen) return;
    const close = (event: MouseEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [sortOpen]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const heroImage = activeCollection?.image || BRAND_IMAGES.monochromeStreet;
  const title = search ? `Results for “${search}”` : activeCollection ? activeCollection.name : "All Collections";
  const description =
    activeCollection?.description ||
    "Relaxed silhouettes, expressive details and a modern African aesthetic. Comfortable, versatile and easy to wear.";
  const tabs = [{ slug: "", name: "All Collections" }, ...collections];

  const editorialAfter = 4;
  const editorial = !search && sorted.length > editorialAfter ? sorted[editorialAfter] : null;

  return (
    <>
      <section className="relative h-[62svh] min-h-[420px] overflow-hidden bg-ink lg:h-[78vh]">
        <img
          key={heroImage}
          src={sizedImage(heroImage, 2000)}
          alt=""
          className={cn(
            "h-full w-full animate-fade-in object-cover",
            "object-[center_25%]",
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/25" />
        <div className="absolute bottom-0 left-0 max-w-[460px] px-4 pb-8 text-paper sm:px-6 lg:px-10 lg:pb-10">
          <h1 className="animate-fade-up text-[26px] leading-tight">{title}</h1>
          <p className="mt-2 animate-fade-up text-xs text-paper/90" style={{ animationDelay: "80ms" }}>
            {description}
          </p>
        </div>
      </section>

      <nav className="border-b border-line" aria-label="Collections">
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-4 py-5 sm:px-6 lg:px-10">
          {tabs.map((tab) => {
            const isActive = !search && tab.slug === active;
            return (
              <button
                key={tab.slug || "all"}
                type="button"
                onClick={() => {
                  const next = new URLSearchParams();
                  if (tab.slug) next.set("c", tab.slug);
                  if (sort !== "featured") next.set("sort", sort);
                  setParams(next, { replace: true });
                }}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 whitespace-nowrap text-[17px] decoration-1 underline-offset-[6px] lg:text-[19px]",
                  isActive ? "underline" : "hover:underline",
                )}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="sticky top-[72px] z-30 flex items-center justify-between border-b border-line bg-paper px-4 py-3.5 text-xs sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="tabular">
            {products.isLoading ? "…" : `${sorted.length} ${sorted.length === 1 ? "Item" : "Items"}`}
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setParam("q", "")}
              className="inline-flex items-center gap-1 text-stone hover:text-ink"
            >
              Clear search <X className="h-3 w-3" strokeWidth={1.4} />
            </button>
          )}
        </div>
        <div ref={sortRef} className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((value) => !value)}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            className="flex items-center gap-2"
          >
            Sort By
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", sortOpen && "rotate-180")} strokeWidth={1.2} />
          </button>
          {sortOpen && (
            <ul
              role="listbox"
              className="absolute right-0 top-[calc(100%+14px)] w-56 animate-fade-in border border-line bg-paper py-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              {SORTS.map((option) => (
                <li key={option.key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={sort === option.key}
                    onClick={() => {
                      setParam("sort", option.key === "featured" ? "" : option.key);
                      setSortOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left decoration-1 underline-offset-4 hover:underline",
                      sort === option.key && "underline",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {products.isLoading ? (
        <ProductGrid>
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </ProductGrid>
      ) : sorted.length > 0 ? (
        <>
          <ProductGrid>
            {sorted.slice(0, editorialAfter).map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </ProductGrid>

          {editorial && (
            <Link
              to={`/product/${editorial.slug}`}
              className="group grid border-y border-line bg-paper md:grid-cols-4"
            >
              <div className="overflow-hidden bg-sand md:col-span-2 md:col-start-2">
                <img
                  src={sizedImage(editorial.images[0]?.url, 1400)}
                  alt={editorial.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-col justify-end px-4 pb-8 pt-4 sm:px-6 md:col-start-4 md:pb-10">
                <p className="text-xs text-stone">{editorial.collectionName}</p>
                <p className="mt-1 text-[20px] leading-snug">{editorial.name}</p>
                <span className="text-link mt-3 self-start text-xs">Discover</span>
              </div>
            </Link>
          )}

          {sorted.length > editorialAfter + (editorial ? 1 : 0) && (
            <ProductGrid>
              {sorted.slice(editorialAfter + (editorial ? 1 : 0)).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          )}
        </>
      ) : (
        <div className="px-4 py-28 text-center">
          <p className="text-[22px]">{products.isError ? "We couldn't load the collection" : "Nothing here yet"}</p>
          <p className="mt-2 text-xs text-stone">
            {products.isError
              ? "Please refresh the page."
              : search
                ? "No pieces match that search."
                : "New pieces for this collection are on the way."}
          </p>
          <Link to="/collections" className="text-link mt-6 inline-block text-xs">
            View all collections
          </Link>
        </div>
      )}
    </>
  );
};

export default CollectionsPage;
