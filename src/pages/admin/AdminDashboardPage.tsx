import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Plus } from "lucide-react";
import { AdminPageHeader, Panel, StatusBadge } from "@/components/admin/AdminUI";
import { useAuth } from "@/context/AuthContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { sizedImage } from "@/lib/image";

const AdminDashboardPage = () => {
  const { admin } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: api.admin.dashboard });
  useDocumentTitle("Admin");

  const stats = [
    { label: "Live products", value: data?.stats.published },
    { label: "Drafts", value: data?.stats.drafts },
    { label: "Featured", value: data?.stats.featured },
    { label: "Collections", value: data?.stats.collections },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Welcome back${admin?.name ? `, ${admin.name}` : ""}`}
        description="Here's what's in the store right now."
        actions={
          <Link to="/admin/products/new" className="btn">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> New product
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line bg-white p-5">
            <p className="text-[12px] uppercase tracking-label text-stone">{stat.label}</p>
            <p className="tabular mt-3 text-[36px] font-light leading-none">
              {isLoading ? <span className="inline-block h-8 w-10 animate-pulse bg-sand" /> : stat.value ?? 0}
            </p>
          </div>
        ))}
      </div>

      <Panel title="Recently updated">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-14 animate-pulse bg-sand" />
            ))}
          </div>
        ) : data?.recent.length ? (
          <ul className="-my-3 divide-y divide-line">
            {data.recent.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/admin/products/${product.id}`}
                  className="flex items-center gap-4 py-3 transition-opacity hover:opacity-70"
                >
                  <img
                    src={sizedImage(product.images[0]?.url, 120)}
                    alt=""
                    className="h-14 w-11 shrink-0 bg-sand object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px]">{product.name}</p>
                    <p className="text-[13px] text-stone">{product.collectionName}</p>
                  </div>
                  <span className="tabular hidden text-[14px] sm:block">{formatPrice(product.priceInNaira)}</span>
                  <StatusBadge status={product.status} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-stone">No products yet.</p>
        )}
        <Link to="/admin/products" className="label mt-6 inline-flex items-center gap-2 text-[11px] hover:opacity-70">
          All products <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </Panel>
    </div>
  );
};

export default AdminDashboardPage;
