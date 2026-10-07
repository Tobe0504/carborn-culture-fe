import type { Admin, Collection, Product, ProductImage, ProductInput, StoreSettings } from "@/types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
export const TOKEN_KEY = "carbon-culture.admin-token";

export class ApiError extends Error {
  status: number;
  details?: { path: string; message: string }[];

  constructor(message: string, status: number, details?: { path: string; message: string }[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const readToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, auth, headers, ...rest } = options;
  const isRaw = body instanceof Blob;
  const finalHeaders: Record<string, string> = { ...(headers as Record<string, string>) };

  if (body !== undefined && !isRaw) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = readToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : isRaw ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.success) {
    if (response.status === 401 && auth) {
      window.dispatchEvent(new Event("carbon-culture:unauthorized"));
    }
    throw new ApiError(
      payload?.message || "Something went wrong. Please try again.",
      response.status,
      payload?.error?.details || undefined,
    );
  }

  return payload.data as T;
};

const toQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export interface ProductQuery {
  collection?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}

export const api = {
  products: (params: ProductQuery = {}) =>
    request<{ products: Product[] }>(`/products${toQuery({ ...params })}`).then((d) => d.products),
  product: (slug: string) => request<{ product: Product; related: Product[] }>(`/products/${slug}`),
  collections: () => request<{ collections: Collection[] }>("/collections").then((d) => d.collections),
  settings: () => request<{ settings: StoreSettings }>("/settings").then((d) => d.settings),

  login: (email: string, password: string) =>
    request<{ admin: Admin; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  me: () => request<{ admin: Admin }>("/auth/me", { auth: true }).then((d) => d.admin),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<null>("/auth/password", {
      method: "POST",
      auth: true,
      body: { currentPassword, newPassword },
    }),

  admin: {
    dashboard: () =>
      request<{
        stats: Record<"total" | "published" | "drafts" | "featured" | "soldOut" | "collections", number>;
        recent: Product[];
      }>("/admin/dashboard", { auth: true }),
    products: (params: ProductQuery = {}) =>
      request<{ products: Product[] }>(`/admin/products${toQuery({ ...params })}`, { auth: true }).then(
        (d) => d.products,
      ),
    product: (id: string) =>
      request<{ product: Product }>(`/admin/products/${id}`, { auth: true }).then((d) => d.product),
    createProduct: (input: ProductInput) =>
      request<{ product: Product }>("/admin/products", { method: "POST", auth: true, body: input }).then(
        (d) => d.product,
      ),
    updateProduct: (id: string, input: Partial<ProductInput>) =>
      request<{ product: Product }>(`/admin/products/${id}`, {
        method: "PATCH",
        auth: true,
        body: input,
      }).then((d) => d.product),
    deleteProduct: (id: string) =>
      request<null>(`/admin/products/${id}`, { method: "DELETE", auth: true }),

    collections: () =>
      request<{ collections: Collection[] }>("/admin/collections", { auth: true }).then(
        (d) => d.collections,
      ),
    createCollection: (input: Partial<Collection>) =>
      request<{ collection: Collection }>("/admin/collections", {
        method: "POST",
        auth: true,
        body: input,
      }),
    updateCollection: (id: string, input: Partial<Collection>) =>
      request<{ collection: Collection }>(`/admin/collections/${id}`, {
        method: "PATCH",
        auth: true,
        body: input,
      }),
    deleteCollection: (id: string) =>
      request<null>(`/admin/collections/${id}`, { method: "DELETE", auth: true }),

    updateSettings: (input: Partial<StoreSettings>) =>
      request<{ settings: StoreSettings }>("/admin/settings", {
        method: "PATCH",
        auth: true,
        body: input,
      }).then((d) => d.settings),
    uploadImage: (file: File) =>
      request<{ image: ProductImage }>("/admin/uploads", {
        method: "POST",
        auth: true,
        headers: { "Content-Type": file.type },
        body: file,
      }).then((d) => d.image),
  },
};
