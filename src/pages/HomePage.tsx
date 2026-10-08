import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryShop from "@/components/product/CategoryShop";
import { useSettings } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { whatsappLink } from "@/lib/whatsapp";

const STEPS = [
  ["Choose", "Pick your piece, size and colour, and add it to your bag."],
  ["Send", "Your bag is sent to us as one WhatsApp message."],
  ["Receive", "We confirm fit and payment, then deliver in Lagos or prepare it for pick up."],
];

const HomePage = () => {
  const settings = useSettings();
  const [category, setCategory] = useState("");
  useDocumentTitle();

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <section className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16 sm:min-h-[70vh]">
        <p className="text-2xs uppercase tracking-[0.16em] text-stone">African. Relaxed. Sustainable.</p>
        <h1 className="mt-4 text-[34px] leading-tight sm:text-[48px]">About Carbon Culture</h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft">
          Carbon Culture is a contemporary African fashion brand celebrating effortless style, individuality and the
          beauty of African-inspired design. Relaxed silhouettes, expressive details and a modern African aesthetic,
          made to be lived in.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#shop" className="btn">
            Shop the collection
          </a>
          <Link to="/our-story" className="btn-outline">
            Our story
          </Link>
        </div>
      </section>

      <section id="shop" className="scroll-mt-20 border-t border-line pt-10">
        <h2 className="mb-6 text-[24px] sm:text-[28px]">Shop the collection</h2>
        <CategoryShop active={category} onSelect={setCategory} />
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
