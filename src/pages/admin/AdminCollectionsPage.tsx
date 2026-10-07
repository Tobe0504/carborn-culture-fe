import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, ConfirmDialog, Panel } from "@/components/admin/AdminUI";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api } from "@/lib/api";
import type { Collection } from "@/types";

interface Draft {
  id?: string;
  name: string;
  description: string;
  sortOrder: number;
}

const EMPTY: Draft = { name: "", description: "", sortOrder: 0 };

const CollectionEditor = ({
  initial,
  onDone,
}: {
  initial: Draft;
  onDone: () => void;
}) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(initial);

  const save = useMutation({
    mutationFn: () => {
      const input = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        sortOrder: Number(draft.sortOrder) || 0,
      };
      return draft.id ? api.admin.updateCollection(draft.id, input) : api.admin.createCollection(input);
    },
    onSuccess: () => {
      toast.success(draft.id ? "Collection updated" : "Collection created");
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      onDone();
    },
    onError: (error) => toast.error(error.message),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (draft.name.trim().length < 2) {
      toast.error("Give the collection a name.");
      return;
    }
    save.mutate();
  };

  return (
    <form onSubmit={submit}>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <div>
            <label className="field-label" htmlFor={`name-${draft.id ?? "new"}`}>Name</label>
            <input
              id={`name-${draft.id ?? "new"}`}
              className="field"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder="e.g. Kaftans"
              autoFocus
            />
          </div>
          <div>
            <label className="field-label" htmlFor={`order-${draft.id ?? "new"}`}>Order</label>
            <input
              id={`order-${draft.id ?? "new"}`}
              type="number"
              className="field tabular"
              value={draft.sortOrder}
              onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor={`desc-${draft.id ?? "new"}`}>Description</label>
          <textarea
            id={`desc-${draft.id ?? "new"}`}
            rows={2}
            className="field"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            placeholder="Shown at the top of the collection page."
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onDone} className="btn-outline px-5 py-3">
            Cancel
          </button>
          <button type="submit" className="btn px-5 py-3" disabled={save.isPending}>
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {draft.id ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
};

const AdminCollectionsPage = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Collection | null>(null);
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["admin", "collections"],
    queryFn: api.admin.collections,
  });
  useDocumentTitle("Collections · Admin");

  const remove = useMutation({
    mutationFn: (id: string) => api.admin.deleteCollection(id),
    onSuccess: () => {
      toast.success("Collection deleted");
      setPendingDelete(null);
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: (error) => {
      toast.error(error.message);
      setPendingDelete(null);
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Collections"
        description="Collections become the filter tabs on the Collections page."
        actions={
          editing !== "new" && (
            <button type="button" onClick={() => setEditing("new")} className="btn">
              <Plus className="h-4 w-4" strokeWidth={1.5} /> New collection
            </button>
          )
        }
      />

      {editing === "new" && (
        <Panel title="New collection">
          <CollectionEditor initial={{ ...EMPTY, sortOrder: collections.length + 1 }} onDone={() => setEditing(null)} />
        </Panel>
      )}

      <div className="border border-line bg-white">
        {isLoading ? (
          <div className="h-40 animate-pulse bg-sand/60" />
        ) : collections.length === 0 ? (
          <p className="px-6 py-14 text-center text-stone">No collections yet. Create one to start adding products.</p>
        ) : (
          <ul className="divide-y divide-line">
            {collections.map((collection) => (
              <li key={collection.id} className="px-4 py-4 sm:px-5">
                {editing === collection.id ? (
                  <CollectionEditor initial={collection} onDone={() => setEditing(null)} />
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px]">{collection.name}</p>
                      <p className="truncate text-[13px] text-stone">
                        {collection.productCount} product{collection.productCount === 1 ? "" : "s"}
                        {collection.description && ` · ${collection.description}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing(collection.id)}
                      className="p-2 text-stone hover:text-ink"
                      aria-label={`Edit ${collection.name}`}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(collection)}
                      className="p-2 text-stone hover:text-[#B42318]"
                      aria-label={`Delete ${collection.name}`}
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete ${pendingDelete?.name ?? "collection"}?`}
        body={
          pendingDelete?.productCount
            ? `It still has ${pendingDelete.productCount} product(s). Move or delete them first.`
            : "The collection will be removed from the store."
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
        busy={remove.isPending}
      />
    </div>
  );
};

export default AdminCollectionsPage;
