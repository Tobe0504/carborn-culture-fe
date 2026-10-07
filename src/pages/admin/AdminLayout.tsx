import { useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { ExternalLink, FolderOpen, LayoutGrid, LogOut, Menu, Settings, Shirt, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/format";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/products", label: "Products", icon: Shirt },
  { to: "/admin/collections", label: "Collections", icon: FolderOpen },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { admin, isLoading, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Logo variant="mark" className="h-24 animate-pulse" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-paper">
      <div className="flex items-center justify-between px-6 py-7">
        <Link to="/admin" onClick={() => setOpen(false)}>
          <Logo variant="mark" tone="paper" className="h-20" />
        </Link>
        <button type="button" className="p-1 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" strokeWidth={1.4} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 text-[14px] transition-colors",
                isActive ? "bg-paper/10 text-paper" : "text-paper/60 hover:bg-paper/5 hover:text-paper",
              )
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.4} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-paper/10 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-paper/60 transition-colors hover:text-paper"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.4} /> View store
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-[14px] text-paper/60 transition-colors hover:text-paper"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.4} /> Sign out
        </button>
        <p className="truncate px-3 pt-2 text-[12px] text-paper/40">{admin.email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] lg:block">{sidebar}</aside>

      <div
        className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")}
        aria-hidden={!open}
      >
        <div
          className={cn("absolute inset-0 bg-ink/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[260px] transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </div>
      </div>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="p-1" aria-label="Open menu">
            <Menu className="h-5 w-5" strokeWidth={1.4} />
          </button>
          <Logo className="h-4" />
          <span className="w-7" />
        </header>
        <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
