const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number | null | undefined) =>
  value === null || value === undefined ? "Price on request" : naira.format(value);

export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");
