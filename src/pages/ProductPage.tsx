import { useEffect, useRef, useState } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(product?.name);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes.length === 1 ? product.sizes[0] : "");
    setColour(product.colours[0]?.name ?? "");
    setShowSizeError(false);
    setExpanded(false);
  }, [product]);

  useEffect(() => {
    const node = buyRef.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(node);
    return () => observer.disconnect();
  }, [product]);

  if (isLoading) {
    return (
      <div className="grid bg-sand lg:min-h-[calc(100vh-72px)] lg:grid-cols-12">
        <div className="aspect-[4/5] animate-pulse lg:col-span-8 lg:aspect-auto" />
        <div className="space-y-3 bg-sand p-6 lg:col-span-4">
          <div className="h-4 w-2/3 animate-pulse bg-line" />
          <div className="h-3 w-1/3 animate-pulse bg-line" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="px-4 py-36 text-center">
        <h1 className="text-[26px]">This piece is no longer available</h1>
        <p className="mt-2 text-xs text-stone">It may have sold out or been renamed.</p>
        <Link to="/collections" className="text-link mt-6 inline-block text-xs">
          View all collections
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

  const flagMissingSize = () => {
    setShowSizeError(true);
    document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const addToBag = () => {
    if (needsSize) return flagMissingSize();
    add(bagItem);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  const orderNow = () => {
    if (needsSize) return flagMissingSize();
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

  const specs = [
    ["Collection", product.collectionName],
    product.madeToOrder ? ["Made to order", product.leadTime || "Ask for timing"] : null,
    ["Reference", product.slug.toUpperCase()],
  ].filter(Boolean) as [string, string][];

  return (
    <>
      <section className="grid bg-sand lg:min-h-[calc(100vh-72px)] lg:grid-cols-12">
        <div className="lg:col-span-8 lg:px-10 lg:py-8">
          <Gallery images={product.images} alt={product.name} />
        </div>

        <div className="px-4 py-6 sm:px-6 lg:col-span-4 lg:py-8 lg:pl-6 lg:pr-10">
          <div className="lg:sticky lg:top-[96px]">
            <nav aria-label="Breadcrumb" className="mb-6 text-2xs text-stone">
              <Link to="/collections" className="link-underline">
                Collections
              </Link>
              <span className="mx-1.5">/</span>
              <Link to={`/collections?c=${product.collectionSlug}`} className="link-underline">
                {product.collectionName}
              </Link>
            </nav>

            <h1 className="text-[17px] leading-snug">{product.name}</h1>
            <p className="text-xs">{product.subtitle || product.collectionName}</p>
            <p className="tabular mt-2 text-xs">{formatPrice(product.priceInNaira)}</p>
            <p className="mt-0.5 text-2xs text-stone">Confirmed and paid for on WhatsApp</p>

            <div className="mt-6 border-t border-ink/10 pt-5">
              {product.colours.length > 0 && (
                <fieldset>
                  <legend className="text-xs">Colour: {colour}</legend>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {product.colours.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setColour(option.name)}
                        aria-pressed={colour === option.name}
                        aria-label={option.name}
                        title={option.name}
                        className="pb-1.5"
                      >
                        <span
                          className="block h-8 w-8 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"
                          style={{ background: option.hex }}
                        />
                        <span
                          className={cn(
                            "mt-1.5 block h-px w-full bg-ink transition-transform",
                            colour === option.name ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {product.sizes.length > 0 && (
                <fieldset id="size-picker" className="mt-5 scroll-mt-40">
                  <div className="flex items-baseline justify-between">
                    <legend className="text-xs">Size{size && product.sizes.length > 1 ? `: ${size}` : ""}</legend>
                    <a href={enquiryHref} target="_blank" rel="noreferrer" className="text-link text-xs">
                      Size guide
                    </a>
                  </div>
                  {product.sizes.length > 1 ? (
                    <div className="mt-3 grid grid-cols-6 gap-px border border-ink/10 bg-ink/10">
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
                            "py-2.5 text-xs transition-colors",
                            size === option ? "bg-ink text-paper" : "bg-sand hover:bg-paper",
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-stone">{product.sizes[0]}</p>
                  )}
                  {showSizeError && (
                    <p role="alert" className="mt-2 text-xs text-[#9B1C1C]">
                      Please select a size.
                    </p>
                  )}
                </fieldset>
              )}

              <div ref={buyRef} className="mt-6">
                <button
                  type="button"
                  onClick={addToBag}
                  disabled={product.soldOut}
                  className="btn w-full py-4"
                >
                  <span>{product.soldOut ? "Sold Out" : added ? "Added to Bag" : "Add to Bag"}</span>
                  <span className="tabular">{formatPrice(product.priceInNaira)}</span>
                </button>
                {!product.soldOut && (
                  <button type="button" onClick={orderNow} className="btn-outline mt-2 w-full py-4">
                    <span>Order this piece on WhatsApp</span>
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>

              {product.description && (
                <div className="mt-6 text-xs leading-relaxed">
                  <p className={cn(!expanded && "line-clamp-4")}>{product.description}</p>
                  {product.description.length > 220 && (
                    <button type="button" onClick={() => setExpanded((v) => !v)} className="text-link mt-1">
                      {expanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-between text-xs">
                <a href={enquiryHref} target="_blank" rel="noreferrer" className="link-underline">
                  Ask the studio ›
                </a>
                <a href="#contact" className="link-underline">
                  Contact us ›
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-20">
        <div className="lg:col-span-5">
          <h2 className="text-[20px]">Details</h2>
          <div className="mt-6 border-t border-line">
            {product.details.length > 0 && (
              <AccordionItem title="Fabric & care" defaultOpen>
                <ul className="space-y-0.5">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </AccordionItem>
            )}
            <AccordionItem title="Delivery & collection">
              <p>Lagos delivery: {settings.deliveryNote.toLowerCase()}.</p>
              <p>Collection from the studio: {settings.address}.</p>
              <p className="mt-2 text-stone">Delivery outside Lagos is arranged on WhatsApp.</p>
            </AccordionItem>
            <AccordionItem title="How ordering works">
              <p>
                Add pieces to your bag and send the order to the studio on WhatsApp. We confirm availability, fit and
                payment, then arrange delivery or collection.
              </p>
            </AccordionItem>
          </div>
        </div>
        <dl className="self-start border-t border-line text-xs lg:col-span-5 lg:col-start-8 lg:mt-[52px]">
          {specs.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[140px_1fr] gap-4 border-b border-line py-4">
              <dt className="text-stone">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {data.related.length > 0 && (
        <section className="border-t border-line">
          <h2 className="px-4 py-6 text-[20px] sm:px-6 lg:px-10">You may also like</h2>
          <ProductGrid>
            {data.related.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </ProductGrid>
        </section>
      )}

      {!product.soldOut && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            showBar ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center gap-4 px-4 py-3 sm:px-6 lg:px-10">
            <p className="hidden min-w-0 flex-1 truncate text-xs sm:block">
              {product.name} <span className="tabular ml-2">{formatPrice(product.priceInNaira)}</span>
            </p>
            <p className="min-w-0 flex-1 truncate text-xs sm:hidden">{formatPrice(product.priceInNaira)}</p>
            {product.sizes.length > 1 && (
              <select
                value={size}
                onChange={(event) => {
                  setSize(event.target.value);
                  setShowSizeError(false);
                }}
                className="hidden border-0 border-b border-line bg-transparent py-2 pr-6 text-xs focus:outline-none sm:block"
                aria-label="Select size"
              >
                <option value="">Select Size</option>
                {product.sizes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            <button type="button" onClick={addToBag} className="btn w-[180px] py-3 sm:w-[240px]">
              <span>{added ? "Added" : "Add to Bag"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
