import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Gallery from "@/components/product/Gallery";
import ProductCard, { ProductGrid } from "@/components/product/ProductCard";
import { AccordionItem } from "@/components/ui/Accordion";
import { useBag } from "@/context/BagContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProduct, useSettings } from "@/hooks/useStore";
import { cn, formatPrice } from "@/lib/format";
import { buildEnquiryMessage, buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import type { BagItem } from "@/types";

const ProductPage = () => {
  const { slug = "" } = useParams();
  const { data, isLoading, isError } = useProduct(slug);
  const settings = useSettings();
  const { add } = useBag();
  const product = data?.product;

  const [size, setSize] = useState("");
  const [colour, setColour] = useState("");
  const [showSizeError, setShowSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  useDocumentTitle(product?.name);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes.length === 1 ? product.sizes[0] : "");
    setColour(product.colours[0]?.name ?? "");
    setShowSizeError(false);
  }, [product]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-site gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse bg-sand" />
        <div className="space-y-3">
          <div className="h-5 w-2/3 animate-pulse bg-sand" />
          <div className="h-4 w-1/4 animate-pulse bg-sand" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="px-4 py-24 text-center text-xs">
        <h1 className="text-[22px]">Product not found</h1>
        <Link to="/collections" className="mt-4 inline-block underline underline-offset-4">
          Back to shop
        </Link>
      </div>
    );
  }

  const needsSize = product.sizes.length > 0 && !size;
  const bagItem: Omit<BagItem, "key"> = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    collectionName: product.collectionName,
    image: product.images[0]?.url ?? "",
    priceInNaira: product.priceInNaira,
    size,
    colour,
    quantity: 1,
    madeToOrder: product.madeToOrder,
  };

  const addToBag = () => {
    if (needsSize) return setShowSizeError(true);
    add(bagItem);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const orderNow = () => {
    if (needsSize) return setShowSizeError(true);
    const message = buildOrderMessage(
      [{ ...bagItem, key: "direct" }],
      { name: "", fulfilment: "delivery", area: "", note: "" },
      window.location.origin,
    );
    window.open(whatsappLink(settings.whatsappNumber, message), "_blank", "noopener");
  };

  const enquiryHref = whatsappLink(
    settings.whatsappNumber,
    buildEnquiryMessage(product.name, product.slug, window.location.origin),
  );

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="py-4 text-2xs text-stone">
        <Link to="/collections" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-1.5">/</span>
        <Link to={`/collections?c=${product.collectionSlug}`} className="hover:text-ink">
          {product.collectionName}
        </Link>
      </nav>

      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Gallery images={product.images} alt={product.name} />

        <div className="lg:max-w-md">
          <h1 className="text-[22px] leading-snug sm:text-[26px]">{product.name}</h1>
          <p className="tabular mt-1 text-sm">{formatPrice(product.priceInNaira)}</p>
          {product.madeToOrder && (
            <p className="mt-2 text-xs text-stone">
              Made to order{product.leadTime ? ` · ${product.leadTime}` : ""}
            </p>
          )}

          {product.colours.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-xs">
                Colour: <span className="text-stone">{colour}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colours.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColour(option.name)}
                    aria-pressed={colour === option.name}
                    aria-label={option.name}
                    title={option.name}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-colors",
                      colour === option.name ? "border-ink" : "border-transparent",
                    )}
                  >
                    <span
                      className="block h-full w-full rounded-full border border-paper"
                      style={{ background: option.hex }}
                    />
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes.length > 0 && (
            <fieldset className="mt-6">
              <div className="flex items-baseline justify-between">
                <legend className="text-xs">Size</legend>
                <a href={enquiryHref} target="_blank" rel="noreferrer" className="text-xs text-stone underline underline-offset-4">
                  Size help
                </a>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSize(option);
                      setShowSizeError(false);
                    }}
                    aria-pressed={size === option}
                    className={cn(
                      "min-w-12 border px-3 py-2 text-xs transition-colors",
                      size === option ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p role="alert" className="mt-2 text-xs text-[#B42318]">
                  Please select a size.
                </p>
              )}
            </fieldset>
          )}

          <div className="mt-8 space-y-2">
            <button type="button" onClick={addToBag} disabled={product.soldOut} className="btn w-full justify-center py-4">
              {product.soldOut ? "Sold out" : added ? "Added to bag" : "Add to bag"}
            </button>
            {!product.soldOut && (
              <button type="button" onClick={orderNow} className="btn-outline w-full justify-center py-4">
                Order on WhatsApp
              </button>
            )}
          </div>

          <div className="mt-8 border-t border-line">
            {product.description && (
              <AccordionItem title="Description" defaultOpen>
                <p>{product.description}</p>
              </AccordionItem>
            )}
            {product.details.length > 0 && (
              <AccordionItem title="Fabric & care">
                <ul className="space-y-0.5">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </AccordionItem>
            )}
            <AccordionItem title="Delivery">
              <p>Lagos delivery: {settings.deliveryNote.toLowerCase()}.</p>
              <p>Collection: {settings.address}.</p>
            </AccordionItem>
          </div>
        </div>
      </section>

      {data.related.length > 0 && (
        <section className="mt-16 border-t border-line py-10">
          <h2 className="mb-6 text-2xs uppercase tracking-[0.16em] text-stone">You may also like</h2>
          <ProductGrid>
            {data.related.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
