import { Link } from "react-router-dom";
import ProductCard, { ProductCardSkeleton, ProductGrid } from "@/components/product/ProductCard";
import { useCollections, useProducts, useSettings } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { whatsappLink } from "@/lib/whatsapp";

const STEPS = [
  ["Choose", "Pick your piece, size and colour, and add it to your bag."],
  ["Send", "Your bag is sent to us as one WhatsApp message."],
  ["Receive", "We confirm fit and payment, then deliver in Lagos or prepare it for collection."],
];

const HomePage = () => {
  const settings = useSettings();
  const { data: collections = [] } = useCollections();
  const products = useProducts({ limit: 12 });
  useDocumentTitle();

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <section className="py-10 sm:py-14">
        <p className="text-2xs uppercase tracking-[0.16em] text-stone">African. Relaxed. Sustainable.</p>
        <h1 className="mt-3 max-w-2xl text-[26px] leading-snug sm:text-[32px]">
          Contemporary African clothing, designed for real life.
        </h1>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.12em]">
          <Link to="/collections" className="underline underline-offset-[6px] hover:opacity-60">
            Shop all
          </Link>
          {collections.map((collection) => (
            <Link key={collection.id} to={`/collections?c=${collection.slug}`} className="hover:opacity-60">
              {collection.name}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Products">
        <ProductGrid>
          {products.isLoading
            ? Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)
            : products.data?.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
        </ProductGrid>
        {products.data?.length === 0 && <p className="py-16 text-center text-xs text-stone">New pieces coming soon.</p>}
        {products.isError && (
          <p className="py-16 text-center text-xs text-stone">We couldn't load the products. Please refresh.</p>
        )}
        {(products.data?.length ?? 0) >= 12 && (
          <div className="mt-10 text-center">
            <Link to="/collections" className="btn">
              View all products
            </Link>
          </div>
        )}
      </section>

      <section id="order" className="mt-12 scroll-mt-20 border-t border-line pt-10">
        <h2 className="text-2xs uppercase tracking-[0.16em] text-stone">How to order</h2>
        <ol className="mt-6 grid gap-8 text-xs sm:grid-cols-3">
          {STEPS.map(([title, body], index) => (
            <li key={title}>
              <p className="font-medium">
                {index + 1}. {title}
              </p>
              <p className="mt-1 text-stone">{body}</p>
            </li>
          ))}
        </ol>
        <a
          href={whatsappLink(settings.whatsappNumber, "Hello Carbon Culture, I have a question.")}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block text-xs underline underline-offset-[6px] hover:opacity-60"
        >
          Message us on WhatsApp
        </a>
      </section>
    </div>
  );
};

export default HomePage;
