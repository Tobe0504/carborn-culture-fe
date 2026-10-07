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
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <img
          src={sizedImage(first?.url, 800)}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
        {second && (
          <img
            src={sizedImage(second.url, 800)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {product.soldOut && (
          <span className="absolute left-2 top-2 bg-paper px-2 py-0.5 text-2xs uppercase tracking-[0.08em]">
            Sold out
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-3 text-xs">
        <h3 className="group-hover:underline group-hover:underline-offset-4">{product.name}</h3>
        <p className="tabular shrink-0">{formatPrice(product.priceInNaira)}</p>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div>
    <div className="aspect-[4/5] animate-pulse bg-sand" />
    <div className="mt-2.5 h-3 w-2/3 animate-pulse bg-sand" />
  </div>
);

export const ProductGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{children}</div>
);

export default ProductCard;
