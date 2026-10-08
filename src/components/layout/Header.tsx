import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useBag } from "@/context/BagContext";
import { useSettings } from "@/hooks/useStore";
import { cn } from "@/lib/format";
import Logo from "./Logo";

const LINKS = [
  { to: "/collections", label: "Shop" },
  { to: "/our-story", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn("text-xs uppercase tracking-[0.12em] transition-opacity hover:opacity-60", isActive && "underline underline-offset-[6px]");

const Header = () => {
  const { count, open } = useBag();
  const settings = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/collections?q=${encodeURIComponent(query)}` : "/collections");
  };

  return (
    <>
      {settings.announcement && (
        <div className="bg-ink px-4 py-2 text-center text-2xs text-paper">{settings.announcement}</div>
      )}

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-6 px-4 sm:px-6">
          <Link to="/" aria-label="Carbon Culture home" className="shrink-0">
            <Logo className="h-[18px] sm:h-5" />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
              {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="-mr-2 flex items-center">
              <button
                type="button"
                onClick={() => setSearchOpen((value) => !value)}
                className="p-2 transition-opacity hover:opacity-60"
                aria-label="Search"
                aria-expanded={searchOpen}
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={open}
                className="flex items-center gap-1.5 p-2 transition-opacity hover:opacity-60"
                aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {count > 0 && <span className="tabular text-xs">{count}</span>}
              </button>
              <button
                type="button"
                className="p-2 transition-opacity hover:opacity-60 md:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-line">
            <div className="mx-auto flex max-w-site items-center gap-3 px-4 py-3 sm:px-6">
              <Search className="h-4 w-4 text-stone" strokeWidth={1.5} />
              <input
                ref={searchRef}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm placeholder:text-stone focus:outline-none"
                aria-label="Search products"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="p-1">
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </form>
        )}
      </header>

      <div className={cn("fixed inset-0 z-50 md:hidden", menuOpen ? "visible" : "invisible")} aria-hidden={!menuOpen}>
        <div
          className={cn("absolute inset-0 bg-ink/30 transition-opacity", menuOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMenuOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 w-full max-w-xs bg-paper transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-end px-4">
            <button type="button" onClick={() => setMenuOpen(false)} className="-mr-2 p-2" aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col px-6" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="border-b border-line py-4 text-sm uppercase tracking-[0.12em]">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
