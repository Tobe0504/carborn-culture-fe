import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, ConfirmDialog, StatusBadge } from "@/components/admin/AdminUI";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/format";
import { sizedImage } from "@/lib/image";
import type { Product } from "@/types";

const OrderInput = ({ product, onSave }: { product: Product; onSave: (sortOrder: number) => void }) => {
  const [value, setValue] = useState(String(product.sortOrder));

  useEffect(() => setValue(String(product.sortOrder)), [product.sortOrder]);

  const commit = () => {
    const next = Math.max(0, Math.round(Number(value)));
    if (!Number.isFinite(next) || value.trim() === "") return setValue(String(product.sortOrder));
    if (next !== product.sortOrder) onSave(next);
  };

  return (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          setValue(String(product.sortOrder));
          event.currentTarget.blur();
        }
      }}
      aria-label={`Order for ${product.name}`}
      title="Order in listings. 1 shows first."
      className="tabular w-14 border border-line bg-white px-2 py-1.5 text-center text-[13px] focus:border-ink focus:outline-none"
    />
  );
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  useDocumentTitle("Products · Admin");

  const { data: collections = [] } = useQuery({ queryKey: ["admin", "collections"], queryFn: api.admin.collections });
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin", "products", { search, collection }],
    queryFn: () => api.admin.products({ search: search || undefined, collection: collection || undefined }),
    placeholderData: (previous) => previous,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin"] });
    void queryClient.invalidateQueries({ queryKey: ["products"] });
    void queryClient.invalidateQueries({ queryKey: ["collections"] });
  };

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Product> }) => api.admin.updateProduct(id, input),
    onSuccess: invalidate,
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.admin.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted");
      setPendingDelete(null);
      invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        description={
          products
            ? `${products.length} product${products.length === 1 ? "" : "s"} · Set the number on the left to change the order they appear in the shop`
            : undefined
        }
        actions={
          <Link to="/admin/products/new" className="btn">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> New product
          </Link>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" strokeWidth={1.4} />
          <input
            className="field pl-10"
            placeholder="Search by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
        </div>
        <select
          className="field sm:w-56"
          value={collection}
          onChange={(event) => setCollection(event.target.value)}
          aria-label="Filter by collection"
        >
          <option value="">All collections</option>
          {collections.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border border-line bg-white">
        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="h-[84px] animate-pulse bg-sand/60" />
            ))}
          </div>
        ) : products?.length ? (
          <ul className="divide-y divide-line">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                <OrderInput
                  product={product}
                  onSave={(sortOrder) => update.mutate({ id: product.id, input: { sortOrder } })}
                />
                <Link to={`/admin/products/${product.id}`} className="shrink-0">
                  <img
                    src={sizedImage(product.images[0]?.url, 140)}
                    alt=""
                    className="h-[60px] w-[45px] bg-sand object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/products/${product.id}`} className="block truncate text-[15px] hover:underline">
                    {product.name}
                  </Link>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-stone">
                    <span>{product.collectionName}</span>
                    <span className="tabular sm:hidden">{formatPrice(product.priceInNaira)}</span>
                    {product.soldOut && <span className="text-[#B42318]">Sold out</span>}
                  </p>
                </div>
                <span className="tabular hidden w-28 text-right text-[14px] sm:block">
                  {formatPrice(product.priceInNaira)}
                </span>
                <button
                  type="button"
                  onClick={() => update.mutate({ id: product.id, input: { status: product.status === "published" ? "draft" : "published" } })}
                  className="hidden sm:block"
                  title={product.status === "published" ? "Click to hide from store" : "Click to publish"}
                >
                  <StatusBadge status={product.status} />
                </button>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => update.mutate({ id: product.id, input: { featured: !product.featured } })}
                    className="p-2"
                    aria-label={product.featured ? "Remove from featured" : "Feature on home page"}
                    title={product.featured ? "Featured on home page" : "Feature on home page"}
                  >
                    <Star
                      className={cn("h-4 w-4", product.featured ? "fill-saffron text-saffron" : "text-stone")}
                      strokeWidth={1.4}
                    />
                  </button>
                  <Link to={`/admin/products/${product.id}`} className="p-2 text-stone hover:text-ink" aria-label="Edit">
                    <Pencil className="h-4 w-4" strokeWidth={1.4} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(product)}
                    className="p-2 text-stone hover:text-[#B42318]"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-xl font-light">{search || collection ? "No products match" : "No products yet"}</p>
            <p className="mt-1 text-stone">
              {search || collection ? "Try a different search or filter." : "Add your first piece to start selling."}
            </p>
            {!search && !collection && (
              <Link to="/admin/products/new" className="btn mt-6">
                <Plus className="h-4 w-4" strokeWidth={1.5} /> New product
              </Link>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.name ?? "product"}?`}
        body="This removes the product and its uploaded images from the store. This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
        busy={remove.isPending}
      />
    </div>
  );
};

export default AdminProductsPage;
