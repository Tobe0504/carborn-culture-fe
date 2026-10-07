import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/ui/Reveal";
import { BRAND_IMAGES } from "@/lib/brandImages";
import { sizedImage } from "@/lib/image";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Chapter = ({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) => (
  <section className="grid gap-6 border-t border-line px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
    <Reveal className="lg:col-span-4">
      <h2 className="text-[26px] leading-tight lg:text-[30px]">{title}</h2>
    </Reveal>
    <Reveal className="lg:col-span-6 lg:col-start-6" delay={80}>
      {lead && <p className="text-[20px] leading-[1.4] lg:text-[22px]">{lead}</p>}
      <div className={lead ? "mt-6 space-y-4 text-sm leading-relaxed text-ink-soft" : "space-y-4 text-sm leading-relaxed text-ink-soft"}>
        {children}
      </div>
    </Reveal>
  </section>
);

const StoryPage = () => {
  useDocumentTitle("About Carbon Culture");

  return (
    <>
      <section className="relative h-[86svh] min-h-[520px] overflow-hidden bg-ink">
        <img
          src={sizedImage(BRAND_IMAGES.iroBubaPair, 2000)}
          alt="Two women in matching iro and buba with gele"
          className="h-full w-full animate-fade-in object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/30" />
        <div className="absolute bottom-0 left-0 px-4 pb-10 text-paper sm:px-6 lg:px-10 lg:pb-14">
          <h1 className="animate-fade-up text-[34px] leading-[1.1] sm:text-[44px]">About Carbon Culture</h1>
          <p className="mt-2 animate-fade-up text-xs text-paper/90" style={{ animationDelay: "80ms" }}>
            African. Relaxed. Sustainable.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[24px] leading-[1.4] sm:text-[30px]">
            Carbon Culture is a contemporary African fashion brand celebrating effortless style, individuality and the
            beauty of African-inspired design.
          </p>
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-xl space-y-4 text-sm leading-relaxed text-ink-soft" delay={100}>
          <p>
            Our collections are created for people who appreciate clothing that feels distinctive without feeling
            complicated. We bring together relaxed silhouettes, expressive details and a modern African aesthetic to
            create pieces that are comfortable, versatile and easy to wear.
          </p>
          <p>
            At the heart of Carbon Culture is a belief that African fashion can be both culturally expressive and
            beautifully contemporary. Our designs take inspiration from the colours, forms, textures and creative
            energy of Africa, reinterpreted through a modern lens.
          </p>
          <p>
            From our signature face motif to our kaftans, iro and buba sets and statement separates, each Carbon
            Culture piece is designed with character. We embrace thoughtful details, interesting shapes and fabrics
            that allow the wearer to make the look their own.
          </p>
        </Reveal>
      </section>

      <section className="grid grid-cols-3 gap-px border-t border-line bg-line">
        {[BRAND_IMAGES.zebraSkirt, BRAND_IMAGES.redStripedGarden, BRAND_IMAGES.stripedKaftan].map((url, index) => (
          <Reveal key={url} delay={index * 80} className="overflow-hidden bg-sand">
            <img src={sizedImage(url, 900)} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </Reveal>
        ))}
      </section>

      <Chapter title="Designed for Real Life" lead="We believe beautiful clothes should be worn, enjoyed and lived in.">
        <p>
          That is why ease is central to the Carbon Culture aesthetic. Our pieces are designed to move effortlessly
          from relaxed daytime dressing to dinners, celebrations, holidays and special occasions.
        </p>
        <p>
          They are clothes you can style differently, return to season after season and make part of your own story.
        </p>
      </Chapter>

      <section className="grid border-t border-line md:grid-cols-2">
        <Reveal className="overflow-hidden bg-sand">
          <img
            src={sizedImage(BRAND_IMAGES.faceMotifKaftans, 1400)}
            alt="Two face-motif kaftans"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </Reveal>
        <div className="flex flex-col justify-center px-4 py-16 sm:px-6 md:px-12 lg:px-20">
          <Reveal>
            <h2 className="text-[26px] leading-tight lg:text-[30px]">Our Approach to Sustainability</h2>
            <p className="mt-5 max-w-md text-[20px] leading-[1.4]">
              For us, sustainability begins with being more thoughtful about what we create and how we consume
              fashion.
            </p>
            <div className="mt-6 max-w-md space-y-4 text-sm leading-relaxed text-ink-soft">
              <p>
                Rather than designing around disposable trends, Carbon Culture focuses on pieces with longevity —
                clothing that can remain relevant beyond a single season and be worn repeatedly in different ways.
              </p>
              <p>
                As the brand grows, we remain committed to making considered choices around our fabrics, production
                and quantities, while continuing to explore better ways of reducing unnecessary waste.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Chapter title="The Culture" lead="Carbon Culture is more than what we wear.">
        <p>
          It is about heritage without limitation, individuality without excess, and African creativity without
          boundaries.
        </p>
      </Chapter>

      <section className="border-t border-line px-4 py-24 text-center sm:px-6 lg:py-32">
        <Reveal>
          <p className="text-[26px] leading-[1.3] sm:text-[34px]">
            Rooted in Africa. Designed for today.
            <br />
            Made to be lived in.
          </p>
          <p className="mt-10 text-xs tracking-[0.2em]">CARBON CULTURE</p>
          <p className="mt-1 text-xs text-stone">African. Relaxed. Sustainable.</p>
          <Link to="/collections" className="text-link mt-10 inline-block text-xs">
            Discover the collections
          </Link>
        </Reveal>
      </section>
    </>
  );
};

export default StoryPage;
