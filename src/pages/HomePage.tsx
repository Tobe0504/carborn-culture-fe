import { Link } from "react-router-dom";
import ProductCard, { ProductCardSkeleton, ProductGrid } from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { useCollections, useProducts, useSettings } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { BRAND_IMAGES } from "@/lib/brandImages";
import { sizedImage } from "@/lib/image";
import { whatsappLink } from "@/lib/whatsapp";
import type { Collection } from "@/types";

const STEPS = [
  ["Choose", "Select your piece, size and colour, and add it to your bag."],
  ["Send", "Your bag is written into a single WhatsApp message to the studio."],
  ["Receive", "We confirm fit and payment, then deliver in Lagos or prepare it for collection."],
];

const Caption = ({ title, text, to }: { title: string; text?: string; to: string }) => (
  <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-10">
    <p className="text-[20px] leading-snug">{title}</p>
    {text && <p className="mt-1 max-w-md text-xs text-stone">{text}</p>}
    <Link to={to} className="text-link mt-3 inline-block text-xs">
      Discover
    </Link>
  </div>
);

const CollectionRow = ({ collections }: { collections: Collection[] }) => {
  if (collections.length === 0) return null;

  if (collections.length === 1) {
    const [collection] = collections;
    const to = `/collections?c=${collection.slug}`;
    return (
      <section className="grid md:grid-cols-2">
        <Reveal className="overflow-hidden bg-sand">
          <Link to={to} className="group block">
            <img
              src={sizedImage(collection.image, 1400)}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
          </Link>
        </Reveal>
        <div className="flex flex-col justify-end md:px-8 md:pb-6">
          <Caption title={collection.name} text={collection.description} to={to} />
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-px bg-line md:grid-cols-2">
      {collections.map((collection) => (
        <Reveal key={collection.id} className="bg-paper">
          <Link to={`/collections?c=${collection.slug}`} className="group block overflow-hidden bg-sand">
            <img
              src={sizedImage(collection.image, 1400)}
              alt=""
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
          </Link>
          <Caption title={collection.name} text={collection.description} to={`/collections?c=${collection.slug}`} />
        </Reveal>
      ))}
    </section>
  );
};

const HomePage = () => {
  const settings = useSettings();
  const { data: collections = [] } = useCollections();
  const featured = useProducts({ featured: true, limit: 4 });
  useDocumentTitle();

  const leadPair = collections.slice(0, 2);
  const remaining = collections.slice(2);

  return (
    <>
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
        <img
          src={sizedImage(BRAND_IMAGES.faceMotifGarden, 2000)}
          alt="Two women wearing the Carbon Culture face motif"
          className="h-full w-full animate-fade-in object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/30" />
        <div className="absolute bottom-0 left-0 px-4 pb-10 text-paper sm:px-6 lg:px-10 lg:pb-14">
          <h1 className="animate-fade-up text-[34px] leading-[1.1] sm:text-[44px]">The Face</h1>
          <p className="mt-2 max-w-sm animate-fade-up text-xs text-paper/90" style={{ animationDelay: "80ms" }}>
            Our signature face motif, on kaftans, boubous and iro and buba sets.
          </p>
          <Link
            to="/collections?c=the-face"
            className="mt-4 inline-block animate-fade-up text-xs underline decoration-1 underline-offset-[5px] hover:opacity-70"
            style={{ animationDelay: "160ms" }}
          >
            Discover the collection
          </Link>
        </div>
      </section>

      <CollectionRow collections={leadPair} />

      <section className="border-t border-line">
        <div className="flex items-baseline justify-between px-4 py-6 sm:px-6 lg:px-10">
          <h2 className="text-[20px]">Selected pieces</h2>
          <Link to="/collections" className="text-link text-xs">
            View all
          </Link>
        </div>
        <ProductGrid>
          {featured.isLoading
            ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
            : featured.data?.map((product) => <ProductCard key={product.id} product={product} />)}
        </ProductGrid>
      </section>

      <section className="grid border-t border-line md:grid-cols-2">
        <Reveal className="overflow-hidden bg-sand">
          <img
            src={sizedImage(BRAND_IMAGES.redStripedGarden, 1400)}
            alt="Red striped Carbon Culture dress"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>
        <div className="flex flex-col justify-center px-4 py-16 sm:px-6 md:px-12 lg:px-20">
          <Reveal>
            <p className="text-xs text-stone">African. Relaxed. Sustainable.</p>
            <p className="mt-4 max-w-md text-[26px] leading-[1.3] lg:text-[30px]">
              Rooted in Africa. Designed for today. Made to be lived in.
            </p>
            <p className="mt-5 max-w-md text-xs leading-relaxed text-ink-soft">
              Relaxed silhouettes, expressive details and a modern African aesthetic — pieces that are comfortable,
              versatile and easy to wear, from daytime dressing to dinners, celebrations and holidays.
            </p>
            <Link to="/our-story" className="text-link mt-6 inline-block text-xs">
              About Carbon Culture
            </Link>
          </Reveal>
        </div>
      </section>

      {remaining.length > 0 && (
        <div className="border-t border-line">
          {Array.from({ length: Math.ceil(remaining.length / 2) }, (_, row) => (
            <CollectionRow key={row} collections={remaining.slice(row * 2, row * 2 + 2)} />
          ))}
        </div>
      )}

      <section id="order" className="grid scroll-mt-20 gap-10 border-t border-line px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
        <div className="lg:col-span-4">
          <h2 className="text-[20px]">Ordering</h2>
          <p className="mt-2 max-w-xs text-xs text-stone">
            A personal service, handled by the studio over WhatsApp. No accounts, no checkout forms.
          </p>
          <a
            href={whatsappLink(settings.whatsappNumber, "Hello Carbon Culture, I have a question.")}
            target="_blank"
            rel="noreferrer"
            className="text-link mt-5 inline-block text-xs"
          >
            Message the studio
          </a>
        </div>
        <ol className="border-t border-line text-xs lg:col-span-7 lg:col-start-6">
          {STEPS.map(([title, body], index) => (
            <li key={title} className="grid grid-cols-[40px_120px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[60px_160px_1fr]">
              <span className="tabular text-stone">{String(index + 1).padStart(2, "0")}</span>
              <span>{title}</span>
              <span className="text-ink-soft">{body}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default HomePage;
