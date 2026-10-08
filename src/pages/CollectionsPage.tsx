import { Link, useSearchParams } from "react-router-dom";
import CategoryShop from "@/components/product/CategoryShop";
import { useCollections } from "@/hooks/useStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const CollectionsPage = () => {
  const [params, setParams] = useSearchParams();
  const active = params.get("c") || "";
  const search = params.get("q") || "";
  const { data: collections = [] } = useCollections();
  const current = collections.find((c) => c.slug === active) ?? collections[0];

  useDocumentTitle(search ? "Search" : current?.name ?? "Shop");

  return (
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <div className="py-8 sm:py-10">
        <h1 className="text-[24px] sm:text-[28px]">{search ? `Search: “${search}”` : "Shop"}</h1>
        {search && (
          <Link to="/collections" className="mt-2 inline-block text-xs text-stone underline underline-offset-4">
            Clear search
          </Link>
        )}
      </div>
      <CategoryShop
        active={active}
        search={search || undefined}
        onSelect={(slug) => setParams({ c: slug }, { replace: true })}
      />
    </div>
  );
};

export default CollectionsPage;
