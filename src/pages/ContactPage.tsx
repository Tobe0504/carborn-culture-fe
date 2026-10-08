import { useState, type FormEvent } from "react";
import { useSettings } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { whatsappLink } from "@/lib/whatsapp";

const ContactPage = () => {
  const settings = useSettings();
  const handle = settings.instagramHandle.replace(/^@/, "");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  useDocumentTitle("Contact");

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = [`Hello Carbon Culture${name.trim() ? `, this is ${name.trim()}` : ""}.`, message.trim()]
      .filter(Boolean)
      .join("\n\n");
    window.open(whatsappLink(settings.whatsappNumber, text), "_blank", "noopener");
  };

  const details = [
    {
      label: "WhatsApp",
      value: settings.phoneDisplay,
      href: `https://wa.me/${settings.whatsappNumber}`,
    },
    { label: "Instagram", value: `@${handle}`, href: `https://instagram.com/${handle}` },
    settings.email ? { label: "Email", value: settings.email, href: `mailto:${settings.email}` } : null,
    { label: "Pick up", value: settings.address },
    { label: "Lagos delivery", value: settings.deliveryNote },
    { label: "Customized Iro & Buba", value: "2-3 weeks" },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <div className="mx-auto grid max-w-site gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2">
      <section>
        <h1 className="text-[26px] leading-snug sm:text-[32px]">Contact</h1>
        <p className="mt-3 max-w-md text-sm text-stone">
          Questions about sizing, an order or a customized piece? Reach us on WhatsApp or Instagram, or visit us for
          pick up.
        </p>
        <dl className="mt-8 border-t border-line text-xs">
          {details.map((item) => (
            <div key={item.label} className="grid grid-cols-[140px_1fr] gap-4 border-b border-line py-4">
              <dt className="text-stone">{item.label}</dt>
              <dd>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="underline underline-offset-4 hover:opacity-60"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lg:pt-[52px]">
        <h2 className="text-2xs uppercase tracking-[0.16em] text-stone">Send us a message</h2>
        <form onSubmit={send} className="mt-6 max-w-md space-y-5">
          <div>
            <label htmlFor="contact-name" className="field-label">
              Your name
            </label>
            <input
              id="contact-name"
              className="field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="field-label">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={4}
              className="field resize-none"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={!message.trim()} className="btn">
            Send on WhatsApp
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
