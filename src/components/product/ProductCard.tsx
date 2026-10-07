import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import { sizedImage } from "@/lib/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority }: ProductCardProps) => {
  const [first, second] = product.images;

  return (
    <Link to={`/product/${product.slug}`} className="group block border-b border-r border-line bg-paper">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <img
          src={sizedImage(first?.url, 900)}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
        />
        {second && (
          <img
            src={sizedImage(second.url, 900)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
      </div>

      <div className="px-3 pb-10 pt-3 sm:px-4 lg:px-[18px]">
        <h3 className="text-xs">{product.name}</h3>
        <p className="text-xs text-stone">{product.subtitle || product.collectionName}</p>
        <p className="tabular mt-2 text-xs">
          {product.soldOut ? <span className="text-stone">Sold out</span> : formatPrice(product.priceInNaira)}
        </p>
        {product.colours.length > 0 && (
          <div className="mt-3 flex gap-1" aria-label={`Colours: ${product.colours.map((c) => c.name).join(", ")}`}>
            {product.colours.map((colour) => (
              <span
                key={colour.name}
                className="h-[5px] w-[19px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
                style={{ background: colour.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div className="border-b border-r border-line bg-paper">
    <div className="aspect-[4/5] animate-pulse bg-sand" />
    <div className="space-y-2 px-3 pb-10 pt-3 sm:px-4">
      <div className="h-3 w-3/5 animate-pulse bg-sand" />
      <div className="h-3 w-2/5 animate-pulse bg-sand" />
    </div>
  </div>
);

export const ProductGrid = ({ children }: { children: ReactNode }) => (
  <div className="overflow-hidden">
    <div className="-mr-px grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">{children}</div>
  </div>
);

export default ProductCard;
