import type { BagItem } from "@/types";
import { formatPrice } from "./format";

export const whatsappLink = (number: string, message: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export interface OrderDetails {
  name: string;
  fulfilment: "delivery" | "collection";
  area: string;
  note: string;
}

export const bagSubtotal = (items: BagItem[]) =>
  items.reduce((sum, item) => sum + (item.priceInNaira ?? 0) * item.quantity, 0);

export const buildOrderMessage = (items: BagItem[], details: OrderDetails, siteUrl: string) => {
  const lines: string[] = ["Hello Carbon Culture, I'd like to place an order.", ""];

  items.forEach((item, index) => {
    const options = [
      item.size && `Size: ${item.size}`,
      item.colour && `Colour: ${item.colour}`,
      `Qty: ${item.quantity}`,
    ]
      .filter(Boolean)
      .join(" · ");
    const lineTotal =
      item.priceInNaira === null ? "Price on request" : formatPrice(item.priceInNaira * item.quantity);

    lines.push(`${index + 1}. ${item.name} (${item.collectionName})`);
    lines.push(`   ${options}`);
    lines.push(`   ${lineTotal}${item.madeToOrder ? " · Made to order" : ""}`);
    lines.push(`   ${siteUrl}/product/${item.slug}`);
  });

  const hasUnpriced = items.some((item) => item.priceInNaira === null);
  lines.push("");
  lines.push(`Subtotal: ${formatPrice(bagSubtotal(items))}${hasUnpriced ? " + items priced on request" : ""}`);
  lines.push("");

  if (details.name) lines.push(`Name: ${details.name}`);
  lines.push(
    details.fulfilment === "delivery"
      ? `Delivery to: ${details.area || "(area to confirm)"}`
      : "I'll collect from the studio",
  );
  if (details.note) lines.push(`Note: ${details.note}`);

  return lines.join("\n");
};

export const buildEnquiryMessage = (productName: string, slug: string, siteUrl: string) =>
  `Hello Carbon Culture, I'd like to ask about the ${productName}.\n${siteUrl}/product/${slug}`;
