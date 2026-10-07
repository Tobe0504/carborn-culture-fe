import { useQuery } from "@tanstack/react-query";
import { api, type ProductQuery } from "@/lib/api";
import type { StoreSettings } from "@/types";

export const FALLBACK_SETTINGS: StoreSettings = {
  whatsappNumber: "2348033008048",
  phoneDisplay: "+234 803 300 8048",
  instagramHandle: "carboncultureng",
  email: "",
  address: "3rd Floor, Engineering Close, Victoria Island, Lagos",
  deliveryNote: "Within 3 working days",
  madeToOrderNote: "Customized Iro & Buba takes 2-3 weeks",
  announcement: "",
};

export const useSettings = () => {
  const query = useQuery({ queryKey: ["settings"], queryFn: api.settings, staleTime: 5 * 60_000 });
  return query.data ?? FALLBACK_SETTINGS;
};

export const useProducts = (params: ProductQuery = {}) =>
  useQuery({ queryKey: ["products", params], queryFn: () => api.products(params) });

export const useCollections = () =>
  useQuery({ queryKey: ["collections"], queryFn: api.collections, staleTime: 5 * 60_000 });

export const useProduct = (slug: string) =>
  useQuery({ queryKey: ["product", slug], queryFn: () => api.product(slug), enabled: Boolean(slug) });
