import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, Panel, Toggle } from "@/components/admin/AdminUI";
import ImageUploader from "@/components/admin/ImageUploader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api, ApiError } from "@/lib/api";
import type { Colour, Product, ProductInput } from "@/types";

const SIZE_PRESETS: Record<string, string[]> = {
  "One Size": ["One Size"],
  "XS – XXL": ["XS", "S", "M", "L", "XL", "XXL"],
  "UK 8 – 20": ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20"],
};

interface FormState {
  name: string;
  subtitle: string;
  collectionId: string;
  price: string;
  priceOnRequest: boolean;
  description: string;
  details: string;
  images: ProductInput["images"];
  sizes: string[];
  colours: Colour[];
  madeToOrder: boolean;
  leadTime: string;
  featured: boolean;
  soldOut: boolean;
  status: ProductInput["status"];
  sortOrder: string;
}

const EMPTY: FormState = {
  name: "",
  subtitle: "",
  collectionId: "",
  price: "",
  priceOnRequest: false,
  description: "",
  details: "",
  images: [],
  sizes: ["One Size"],
  colours: [],
  madeToOrder: false,
  leadTime: "",
  featured: false,
  soldOut: false,
  status: "published",
  sortOrder: "0",
};

const fromProduct = (product: Product): FormState => ({
  name: product.name,
  subtitle: product.subtitle,
  collectionId: product.collectionId,
  price: product.priceInNaira === null ? "" : String(product.priceInNaira),
  priceOnRequest: product.priceInNaira === null,
  description: product.description,
  details: product.details.join("\n"),
  images: product.images,
  sizes: product.sizes,
  colours: product.colours,
  madeToOrder: product.madeToOrder,
  leadTime: product.leadTime,
  featured: product.featured,
  soldOut: product.soldOut,
  status: product.status,
  sortOrder: String(product.sortOrder),
});

const toInput = (form: FormState): ProductInput => ({
  name: form.name.trim(),
  subtitle: form.subtitle.trim(),
  collectionId: form.collectionId,
  priceInNaira: form.priceOnRequest ? null : Number(form.price.replace(/[^\d.]/g, "")),
  description: form.description.trim(),
  details: form.details
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean),
  images: form.images,
  sizes: form.sizes,
  colours: form.colours,
  madeToOrder: form.madeToOrder,
  leadTime: form.madeToOrder ? form.leadTime.trim() : "",
  featured: form.featured,
  soldOut: form.soldOut,
  status: form.status,
  sortOrder: Number(form.sortOrder) || 0,
});

const validate = (form: FormState) => {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.name.trim().length < 2) errors.name = "Give the product a name.";
  if (!form.collectionId) errors.collectionId = "Choose a collection.";
  if (!form.priceOnRequest && !(Number(form.price.replace(/[^\d.]/g, "")) > 0))
    errors.price = "Enter a price, or tick “Price on request”.";
  if (form.images.length === 0) errors.images = "Add at least one image.";
  return errors;
};

const AdminProductFormPage = () => {
  const { productId } = useParams();
  const isNew = !productId || productId === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sizeDraft, setSizeDraft] = useState("");
  const [colourDraft, setColourDraft] = useState<Colour>({ name: "", hex: "#141210" });
  useDocumentTitle(isNew ? "New product · Admin" : "Edit product · Admin");

  const { data: collections = [] } = useQuery({ queryKey: ["admin", "collections"], queryFn: api.admin.collections });
  const existing = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => api.admin.product(productId!),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing.data) setForm(fromProduct(existing.data));
  }, [existing.data]);

  useEffect(() => {
    if (isNew && !form.collectionId && collections[0]) {
      setForm((current) => ({ ...current, collectionId: collections[0].id }));
    }
  }, [isNew, collections, form.collectionId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const save = useMutation({
    mutationFn: (input: ProductInput) =>
      isNew ? api.admin.createProduct(input) : api.admin.updateProduct(productId!, input),
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      void queryClient.invalidateQueries({ queryKey: ["product"] });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success(isNew ? "Product created" : "Changes saved");
      if (isNew) navigate(`/admin/products/${product.id}`, { replace: true });
    },
    onError: (error) => {
      const detail = error instanceof ApiError ? error.details?.[0] : undefined;
      toast.error(detail ? `${detail.path}: ${detail.message}` : error.message);
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`field-${firstError}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error(Object.values(nextErrors)[0]);
      return;
    }
    save.mutate(toInput(form));
  };

  const addSize = () => {
    const value = sizeDraft.trim();
    if (value && !form.sizes.includes(value)) set("sizes", [...form.sizes, value]);
    setSizeDraft("");
  };

  const onSizeKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSize();
    }
  };

  const addColour = () => {
    const name = colourDraft.name.trim();
    if (!name) return;
    set("colours", [...form.colours.filter((c) => c.name !== name), { name, hex: colourDraft.hex.toUpperCase() }]);
    setColourDraft({ name: "", hex: colourDraft.hex });
  };

  if (!isNew && existing.isLoading) {
    return (
      <div className="flex items-center gap-3 py-20 text-stone">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading product…
      </div>
    );
  }

  if (!isNew && existing.isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-light">Product not found</p>
        <Link to="/admin/products" className="btn mt-6">Back to products</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 pb-24" noValidate>
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-[13px] text-stone hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Products
      </Link>
      <AdminPageHeader
        title={isNew ? "New product" : form.name || "Edit product"}
        actions={
          !isNew &&
          existing.data?.status === "published" && (
            <a href={`/product/${existing.data.slug}`} target="_blank" rel="noreferrer" className="btn-outline px-5 py-3">
              View in store <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          )
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel title="Images">
            <div id="field-images">
              <ImageUploader images={form.images} onChange={(images) => set("images", images)} />
              {errors.images && <p className="mt-2 text-[13px] text-[#B42318]">{errors.images}</p>}
            </div>
          </Panel>

          <Panel title="Details">
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div id="field-name">
                  <label htmlFor="name" className="field-label">Name</label>
                  <input
                    id="name"
                    className="field"
                    value={form.name}
                    onChange={(event) => set("name", event.target.value)}
                    placeholder="e.g. The Face Kaftan — Sky"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1.5 text-[13px] text-[#B42318]">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="subtitle" className="field-label">Short line</label>
                  <input
                    id="subtitle"
                    className="field"
                    value={form.subtitle}
                    onChange={(event) => set("subtitle", event.target.value)}
                    placeholder="e.g. Kaftan, Made to Order"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div id="field-collectionId">
                  <label htmlFor="collection" className="field-label">Collection</label>
                  <select
                    id="collection"
                    className="field"
                    value={form.collectionId}
                    onChange={(event) => set("collectionId", event.target.value)}
                  >
                    <option value="" disabled>
                      Choose…
                    </option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  {errors.collectionId && <p className="mt-1.5 text-[13px] text-[#B42318]">{errors.collectionId}</p>}
                </div>
                <div id="field-price">
                  <label htmlFor="price" className="field-label">Price (₦)</label>
                  <input
                    id="price"
                    inputMode="numeric"
                    className="field tabular disabled:bg-cream disabled:text-stone"
                    value={form.priceOnRequest ? "" : form.price}
                    onChange={(event) => set("price", event.target.value)}
                    placeholder={form.priceOnRequest ? "Price on request" : "161000"}
                    disabled={form.priceOnRequest}
                    aria-invalid={Boolean(errors.price)}
                  />
                  <label className="mt-2 flex items-center gap-2 text-[13px] text-stone">
                    <input
                      type="checkbox"
                      checked={form.priceOnRequest}
                      onChange={(event) => set("priceOnRequest", event.target.checked)}
                      className="accent-ink"
                    />
                    Price on request
                  </label>
                  {errors.price && <p className="mt-1.5 text-[13px] text-[#B42318]">{errors.price}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="field-label">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  className="field"
                  value={form.description}
                  onChange={(event) => set("description", event.target.value)}
                  placeholder="What makes this piece special? Fit, feel, occasion…"
                />
              </div>

              <div>
                <label htmlFor="details" className="field-label">Fabric & care</label>
                <textarea
                  id="details"
                  rows={4}
                  className="field"
                  value={form.details}
                  onChange={(event) => set("details", event.target.value)}
                  placeholder={"100% cotton\nFloor length\nCold wash, inside out"}
                />
                <p className="mt-1.5 text-[13px] text-stone">One point per line.</p>
              </div>
            </div>
          </Panel>

          <Panel title="Options" description="Customers choose these before adding to their bag.">
            <div className="space-y-7">
              <div>
                <p className="field-label">Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {form.sizes.map((size) => (
                    <span key={size} className="inline-flex items-center gap-1.5 border border-ink bg-ink py-1.5 pl-3 pr-1.5 text-[13px] text-paper">
                      {size}
                      <button
                        type="button"
                        onClick={() => set("sizes", form.sizes.filter((s) => s !== size))}
                        className="p-0.5 opacity-70 hover:opacity-100"
                        aria-label={`Remove size ${size}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex">
                    <input
                      className="field w-28 py-1.5 text-[13px]"
                      value={sizeDraft}
                      onChange={(event) => setSizeDraft(event.target.value)}
                      onKeyDown={onSizeKey}
                      onBlur={addSize}
                      placeholder="Add size"
                      aria-label="Add a size"
                    />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="text-stone">Presets:</span>
                  {Object.entries(SIZE_PRESETS).map(([label, sizes]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => set("sizes", sizes)}
                      className="border border-line px-2.5 py-1 transition-colors hover:border-ink"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="field-label">Colours</p>
                {form.colours.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {form.colours.map((colour) => (
                      <span key={colour.name} className="inline-flex items-center gap-2 border border-line py-1.5 pl-2 pr-1.5 text-[13px]">
                        <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: colour.hex }} />
                        {colour.name}
                        <button
                          type="button"
                          onClick={() => set("colours", form.colours.filter((c) => c.name !== colour.name))}
                          className="p-0.5 text-stone hover:text-ink"
                          aria-label={`Remove colour ${colour.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colourDraft.hex}
                    onChange={(event) => setColourDraft({ ...colourDraft, hex: event.target.value })}
                    className="h-[46px] w-12 shrink-0 cursor-pointer border border-line bg-white p-1"
                    aria-label="Pick colour"
                  />
                  <input
                    className="field"
                    value={colourDraft.name}
                    onChange={(event) => setColourDraft({ ...colourDraft, name: event.target.value })}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addColour();
                      }
                    }}
                    placeholder="Colour name, e.g. Saffron"
                    aria-label="Colour name"
                  />
                  <button type="button" onClick={addColour} className="btn-outline shrink-0 px-4" aria-label="Add colour">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Visibility">
            <div className="space-y-5">
              <div>
                <label htmlFor="status" className="field-label">Status</label>
                <select
                  id="status"
                  className="field"
                  value={form.status}
                  onChange={(event) => set("status", event.target.value as FormState["status"])}
                >
                  <option value="published">Live — visible in store</option>
                  <option value="draft">Draft — hidden</option>
                </select>
              </div>
              <Toggle
                label="Feature on home page"
                description="Shows in “Pieces we love”."
                checked={form.featured}
                onChange={(value) => set("featured", value)}
              />
              <Toggle
                label="Sold out"
                description="Stays visible but can't be ordered."
                checked={form.soldOut}
                onChange={(value) => set("soldOut", value)}
              />
              <div>
                <label htmlFor="sortOrder" className="field-label">Display order</label>
                <input
                  id="sortOrder"
                  type="number"
                  className="field tabular"
                  value={form.sortOrder}
                  onChange={(event) => set("sortOrder", event.target.value)}
                />
                <p className="mt-1.5 text-[13px] text-stone">Lower numbers show first.</p>
              </div>
            </div>
          </Panel>

          <Panel title="Production">
            <div className="space-y-5">
              <Toggle
                label="Made to order"
                description="Tailored after payment is confirmed."
                checked={form.madeToOrder}
                onChange={(value) => set("madeToOrder", value)}
              />
              {form.madeToOrder && (
                <div>
                  <label htmlFor="leadTime" className="field-label">Lead time</label>
                  <input
                    id="leadTime"
                    className="field"
                    value={form.leadTime}
                    onChange={(event) => set("leadTime", event.target.value)}
                    placeholder="2 weeks after full payment"
                  />
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:left-[248px]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-end gap-3 px-4 py-3 sm:px-8">
          <Link to="/admin/products" className="btn-outline px-5 py-3">
            Cancel
          </Link>
          <button type="submit" className="btn px-6 py-3" disabled={save.isPending}>
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isNew ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminProductFormPage;
