import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-line py-10">
    <h2 className="text-2xs uppercase tracking-[0.16em] text-stone">{title}</h2>
    <div className="mt-4 space-y-4 text-sm leading-relaxed">{children}</div>
  </section>
);

const StoryPage = () => {
  useDocumentTitle("About");

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-2xs uppercase tracking-[0.16em] text-stone">African. Relaxed. Sustainable.</p>
      <h1 className="mt-3 text-[26px] leading-snug sm:text-[32px]">About Carbon Culture</h1>

      <div className="mt-8 space-y-4 pb-10 text-sm leading-relaxed">
        <p>
          Carbon Culture is a contemporary African fashion brand celebrating effortless style, individuality and the
          beauty of African-inspired design.
        </p>
        <p>
          Our collections are created for people who appreciate clothing that feels distinctive without feeling
          complicated. We bring together relaxed silhouettes, expressive details and a modern African aesthetic to
          create pieces that are comfortable, versatile and easy to wear.
        </p>
        <p>
          At the heart of Carbon Culture is a belief that African fashion can be both culturally expressive and
          beautifully contemporary. Our designs take inspiration from the colours, forms, textures and creative energy
          of Africa, reinterpreted through a modern lens.
        </p>
        <p>
          From our signature face motif to our kaftans, iro and buba sets and statement separates, each Carbon Culture
          piece is designed with character. We embrace thoughtful details, interesting shapes and fabrics that allow
          the wearer to make the look their own.
        </p>
      </div>

      <Section title="Designed for Real Life">
        <p>We believe beautiful clothes should be worn, enjoyed and lived in.</p>
        <p>
          That is why ease is central to the Carbon Culture aesthetic. Our pieces are designed to move effortlessly
          from relaxed daytime dressing to dinners, celebrations, holidays and special occasions.
        </p>
        <p>They are clothes you can style differently, return to season after season and make part of your own story.</p>
      </Section>

      <Section title="Our Approach to Sustainability">
        <p>
          For us, sustainability begins with being more thoughtful about what we create and how we consume fashion.
        </p>
        <p>
          Rather than designing around disposable trends, Carbon Culture focuses on pieces with longevity — clothing
          that can remain relevant beyond a single season and be worn repeatedly in different ways.
        </p>
        <p>
          As the brand grows, we remain committed to making considered choices around our fabrics, production and
          quantities, while continuing to explore better ways of reducing unnecessary waste.
        </p>
      </Section>

      <Section title="The Culture">
        <p>Carbon Culture is more than what we wear.</p>
        <p>
          It is about heritage without limitation, individuality without excess, and African creativity without
          boundaries.
        </p>
        <p className="font-medium">Rooted in Africa. Designed for today. Made to be lived in.</p>
      </Section>

      <div className="border-t border-line pt-10">
        <Link to="/collections" className="btn">
          Shop the collection
        </Link>
      </div>
    </article>
  );
};

export default StoryPage;
