import { useSettings } from "@/hooks/useStore";

const Footer = () => {
  const settings = useSettings();
  const handle = settings.instagramHandle.replace(/^@/, "");

  return (
    <footer id="contact" className="mt-12 scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-10 text-xs sm:grid-cols-3 sm:px-6">
        <div className="space-y-1">
          <p className="mb-3 text-2xs uppercase tracking-[0.16em] text-stone">Contact</p>
          <p>
            <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:underline">
              WhatsApp {settings.phoneDisplay}
            </a>
          </p>
          {settings.email && (
            <p>
              <a href={`mailto:${settings.email}`} className="hover:underline">
                {settings.email}
              </a>
            </p>
          )}
          <p>
            <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className="hover:underline">
              Instagram @{handle}
            </a>
          </p>
        </div>
        <div className="space-y-1">
          <p className="mb-3 text-2xs uppercase tracking-[0.16em] text-stone">Pick up</p>
          <p>{settings.address}</p>
        </div>
        <div className="space-y-1">
          <p className="mb-3 text-2xs uppercase tracking-[0.16em] text-stone">Order Fulfillment</p>
          <p>Customized Iro & Buba</p>
          <p className="text-stone">2-3 weeks</p>
        </div>
      </div>
      <div className="mx-auto max-w-site border-t border-line px-4 py-5 text-2xs text-stone sm:px-6">
        © {new Date().getFullYear()} Carbon Culture
      </div>
    </footer>
  );
};

export default Footer;
