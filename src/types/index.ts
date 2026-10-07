export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Colour {
  name: string;
  hex: string;
}

export type ProductStatus = "published" | "draft";

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
  priceInNaira: number | null;
  description: string;
  details: string[];
  images: ProductImage[];
  sizes: string[];
  colours: Colour[];
  madeToOrder: boolean;
  leadTime: string;
  featured: boolean;
  soldOut: boolean;
  status: ProductStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<
  Product,
  "id" | "slug" | "collectionName" | "collectionSlug" | "createdAt" | "updatedAt"
>;

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  productCount: number;
}

export interface StoreSettings {
  whatsappNumber: string;
  phoneDisplay: string;
  instagramHandle: string;
  email: string;
  address: string;
  deliveryNote: string;
  madeToOrderNote: string;
  announcement: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface BagItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  collectionName: string;
  image: string;
  priceInNaira: number | null;
  size: string;
  colour: string;
  quantity: number;
  madeToOrder: boolean;
}
