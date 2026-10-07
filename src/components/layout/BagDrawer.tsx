import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useBag } from "@/context/BagContext";
import { useSettings } from "@/hooks/useStore";
import { cn, formatPrice } from "@/lib/format";
import { sizedImage } from "@/lib/image";
import { bagSubtotal, buildOrderMessage, whatsappLink, type OrderDetails } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

const BagDrawer = () => {
  const { items, isOpen, close, setQuantity, remove, clear } = useBag();
  const settings = useSettings();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [sent, setSent] = useState(false);
  const [details, setDetails] = useState<OrderDetails>({
    name: "",
    fulfilment: "delivery",
    area: "",
    note: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setSent(false);
      return;
    }
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const subtotal = bagSubtotal(items);
  const hasUnpriced = items.some((item) => item.priceInNaira === null);
  const hasMadeToOrder = items.some((item) => item.madeToOrder);

  const sendOrder = () => {
    const message = buildOrderMessage(items, details, window.location.origin);
    window.open(whatsappLink(settings.whatsappNumber, message), "_blank", "noopener");
    setSent(true);
  };

  return (
    <div
      className={cn("fixed inset-0 z-[60]", isOpen ? "visible" : "invisible delay-300")}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-[17px]">Your Bag {items.length > 0 && <span className="text-stone">({items.length})</span>}</h2>
          <button ref={closeRef} type="button" onClick={close} className="-mr-2 p-2" aria-label="Close bag">
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-[22px]">Your bag is empty</p>
            <p className="mt-2 max-w-xs text-xs text-stone">
              Add pieces you love, then send the whole order to us on WhatsApp in one message.
            </p>
            <Link to="/collections" onClick={close} className="text-link mt-6 text-xs">
              Discover the collections
            </Link>
          </div>
        ) : sent ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="text-[22px]">Finish your order in WhatsApp</p>
            <p className="mt-2 max-w-xs text-xs text-stone">
              We've written the message for you. Press send in WhatsApp and we'll reply to confirm sizing, payment
              and delivery.
            </p>
            <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
              <button type="button" onClick={sendOrder} className="btn-outline">
                Open WhatsApp again
              </button>
              <button
                type="button"
                onClick={() => {
                  clear();
                  close();
                }}
                className="btn"
              >
                Done, clear bag
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-line px-6">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <Link to={`/product/${item.slug}`} onClick={close} className="w-[84px] shrink-0">
                      <img
                        src={sizedImage(item.image, 200)}
                        alt=""
                        className="aspect-[4/5] w-full bg-sand object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-2xs text-stone">{item.collectionName}</p>
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={close}
                            className="block truncate text-xs hover:opacity-70"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.key)}
                          className="-mr-1 -mt-1 p-1 text-stone transition-colors hover:text-ink"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-4 w-4" strokeWidth={1.4} />
                        </button>
                      </div>
                      <p className="mt-1 text-2xs text-stone">
                        {[item.size, item.colour].filter(Boolean).join(" · ")}
                        {item.madeToOrder && " · Made to order"}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-line">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.key, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="tabular w-7 text-center text-xs" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.key, item.quantity + 1)}
                            className="p-2"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="tabular text-xs">
                          {item.priceInNaira === null
                            ? "On request"
                            : formatPrice(item.priceInNaira * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-5 border-t border-line px-6 py-6">
                <p className="text-xs">Order details</p>
                <div>
                  <label htmlFor="bag-name" className="field-label">Your name</label>
                  <input
                    id="bag-name"
                    className="field"
                    value={details.name}
                    onChange={(event) => setDetails({ ...details, name: event.target.value })}
                    autoComplete="name"
                    placeholder="Optional"
                  />
                </div>
                <fieldset>
                  <legend className="field-label">How would you like to receive it?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["delivery", "Lagos delivery"],
                        ["collection", "Collect from studio"],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={cn(
                          "cursor-pointer border px-3 py-2.5 text-center text-xs transition-colors",
                          details.fulfilment === value
                            ? "border-ink bg-ink text-paper"
                            : "border-line hover:border-ink",
                        )}
                      >
                        <input
                          type="radio"
                          name="fulfilment"
                          value={value}
                          checked={details.fulfilment === value}
                          onChange={() => setDetails({ ...details, fulfilment: value })}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {details.fulfilment === "delivery" && (
                  <div>
                    <label htmlFor="bag-area" className="field-label">Delivery area</label>
                    <input
                      id="bag-area"
                      className="field"
                      value={details.area}
                      onChange={(event) => setDetails({ ...details, area: event.target.value })}
                      placeholder="e.g. Lekki Phase 1"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="bag-note" className="field-label">Note</label>
                  <textarea
                    id="bag-note"
                    rows={2}
                    className="field resize-none"
                    value={details.note}
                    onChange={(event) => setDetails({ ...details, note: event.target.value })}
                    placeholder="Measurements, occasion date, gele request…"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-line px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs">Subtotal</span>
                <span className="tabular text-xs">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1.5 text-2xs text-stone">
                {hasUnpriced && "Some pieces are priced on request. "}
                Delivery is confirmed on WhatsApp.
                {hasMadeToOrder && ` ${settings.madeToOrderNote}.`}
              </p>
              <button type="button" onClick={sendOrder} className="btn mt-5 w-full py-4">
                <span>Send Order on WhatsApp</span>
                <WhatsAppIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default BagDrawer;
