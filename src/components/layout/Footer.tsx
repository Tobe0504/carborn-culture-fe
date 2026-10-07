import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCollections, useSettings } from "@/hooks/useStore";
import { whatsappLink } from "@/lib/whatsapp";
import Logo from "./Logo";

const Footer = () => {
  const settings = useSettings();
  const { data: collections = [] } = useCollections();
  const handle = settings.instagramHandle.replace(/^@/, "");
  const [message, setMessage] = useState("");

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    window.open(whatsappLink(settings.whatsappNumber, message || "Hello Carbon Culture"), "_blank", "noopener");
    setMessage("");
  };

  const columns = [
    {
      title: "Collections",
      links: [
        { label: "All Collections", to: "/collections" },
        ...collections.map((collection) => ({ label: collection.name, to: `/collections?c=${collection.slug}` })),
      ],
    },
    {
      title: "Maison",
      links: [
        { label: "Our Story", to: "/our-story" },
        { label: "Instagram", href: `https://instagram.com/${handle}` },
        { label: "WhatsApp", href: `https://wa.me/${settings.whatsappNumber}` },
      ],
    },
    {
      title: "Client Services",
      text: [
        `Lagos delivery: ${settings.deliveryNote.toLowerCase()}`,
        settings.madeToOrderNote,
        "Orders are confirmed and paid for on WhatsApp",
      ],
    },
  ];

  return (
    <footer id="contact" className="scroll-mt-20 border-t border-line bg-paper">
      <div className="grid gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-20">
        <div className="lg:col-span-4">
          <p className="text-[20px]">Write to the studio</p>
          <p className="mt-2 max-w-sm text-xs text-stone">
            Questions about sizing, fabric or a made-to-order piece. We reply on WhatsApp.
          </p>
          <form onSubmit={sendMessage} className="mt-6 flex max-w-sm items-end gap-4 border-b border-ink">
            <label htmlFor="footer-message" className="sr-only">
              Your message
            </label>
            <input
              id="footer-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Your message"
              className="w-full bg-transparent py-2.5 text-sm placeholder:text-stone focus:outline-none"
            />
            <button type="submit" className="shrink-0 py-2.5 text-xs hover:opacity-60">
              Send
            </button>
          </form>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="lg:col-span-2 lg:first-of-type:col-start-6">
            <p className="text-xs text-stone">{column.title}</p>
            <ul className="mt-4 space-y-2 text-xs">
              {column.links?.map((link) => (
                <li key={link.label}>
                  {"to" in link && link.to ? (
                    <Link to={link.to} className="link-underline">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noreferrer" className="link-underline">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              {column.text?.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-2">
          <p className="text-xs text-stone">The Studio</p>
          <address className="mt-4 space-y-2 text-xs not-italic">
            <p>{settings.address}</p>
            <p>
              <a href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`} className="link-underline">
                {settings.phoneDisplay}
              </a>
            </p>
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="link-underline">
                  {settings.email}
                </a>
              </p>
            )}
          </address>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-10">
        <Logo variant="mark" className="h-20" />
        <p className="text-2xs text-stone">© {new Date().getFullYear()} Carbon Culture, Lagos · Nigeria (₦)</p>
      </div>
    </footer>
  );
};

export default Footer;
