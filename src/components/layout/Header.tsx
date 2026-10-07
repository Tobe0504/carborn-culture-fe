import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X } from "lucide-react";
import { useBag } from "@/context/BagContext";
import { useCollections, useSettings } from "@/hooks/useStore";
import { cn } from "@/lib/format";
import Logo from "./Logo";

interface HeaderProps {
  overlay: boolean;
}

const ANNOUNCEMENT_KEY = "carbon-culture.announcement-dismissed";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
    <path d="M4 9h16M4 15h16" />
  </svg>
);

const Header = ({ overlay }: HeaderProps) => {
  const { count, open } = useBag();
  const settings = useSettings();
  const { data: collections = [] } = useCollections();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [term, setTerm] = useState("");
  const [announcementHidden, setAnnouncementHidden] = useState(() => {
    try {
      return sessionStorage.getItem(ANNOUNCEMENT_KEY) === "1";
    } catch {
      return false;
    }
  });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

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
    setSearchOpen(false);
  };

  const dismissAnnouncement = () => {
    setAnnouncementHidden(true);
    try {
      sessionStorage.setItem(ANNOUNCEMENT_KEY, "1");
    } catch {
    }
  };

  const transparent = overlay && !scrolled && !searchOpen;
  const activeCollection = new URLSearchParams(location.search).get("c");

  const navLinks = [
    { to: "/collections", label: "All Collections", active: location.pathname === "/collections" && !activeCollection },
    ...collections.map((collection) => ({
      to: `/collections?c=${collection.slug}`,
      label: collection.name,
      active: activeCollection === collection.slug,
    })),
  ];

  return (
    <>
      {settings.announcement && !announcementHidden && (
        <div className="relative z-50 flex items-center justify-between bg-paper px-4 py-2 text-xs sm:px-6 lg:px-10">
          <span>{settings.announcement}</span>
          <button type="button" onClick={dismissAnnouncement} aria-label="Dismiss announcement" className="-mr-1 p-1">
            <X className="h-3.5 w-3.5" strokeWidth={1.2} />
          </button>
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-40 transition-colors duration-300",
          overlay && "-mb-[var(--header-h)]",
          transparent ? "bg-transparent text-paper" : "bg-paper text-ink",
        )}
        style={{ ["--header-h" as string]: "72px" }}
      >
        <div className="flex h-[72px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-10">
          <Link to="/" aria-label="Carbon Culture home" className="shrink-0">
            <Logo tone={transparent ? "paper" : "ink"} className="h-[18px] sm:h-[22px]" />
          </Link>

          <nav className="hidden flex-1 items-center justify-end gap-6 text-xs xl:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn("decoration-1 underline-offset-[5px] hover:underline", link.active && "underline")}
              >
                {link.label}
              </Link>
            ))}
            <NavLink
              to="/our-story"
              className={({ isActive }) =>
                cn("decoration-1 underline-offset-[5px] hover:underline", isActive && "underline")
              }
            >
              Our Story
            </NavLink>
            <a href="#contact" className="decoration-1 underline-offset-[5px] hover:underline">
              Contact
            </a>
          </nav>

          <div className="-mr-2 flex items-center">
            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              className="p-2 transition-opacity hover:opacity-60"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search className="h-[17px] w-[17px]" strokeWidth={1.2} />
            </button>
            <button
              type="button"
              onClick={open}
              className="relative p-2 transition-opacity hover:opacity-60"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.2} />
              {count > 0 && (
                <span className="tabular absolute -right-0.5 top-0.5 text-[10px] leading-none">{count}</span>
              )}
            </button>
            <button
              type="button"
              className="p-2 transition-opacity hover:opacity-60 xl:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-line bg-paper px-4 py-5 text-ink sm:px-6 lg:px-10">
            <div className="flex items-center gap-4 border-b border-ink pb-2">
              <input
                ref={searchRef}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-[20px] placeholder:text-stone focus:outline-none"
                aria-label="Search the collection"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-xs text-stone hover:text-ink">
                Close
              </button>
            </div>
          </form>
        )}
      </header>

      <div className={cn("fixed inset-0 z-50", menuOpen ? "visible" : "invisible delay-300")} aria-hidden={!menuOpen}>
        <div
          className={cn("absolute inset-0 bg-ink/30 transition-opacity duration-300", menuOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMenuOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-paper text-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-[72px] items-center justify-between px-6">
            <span className="text-xs text-stone">Menu</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="-mr-2 p-2" aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.1} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6" aria-label="Mobile">
            <ul className="divide-y divide-line border-y border-line">
              {[...navLinks, { to: "/our-story", label: "Our Story", active: false }].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center justify-between py-4 text-[20px]">
                    {link.label}
                    <span aria-hidden="true" className="text-stone">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-1 px-6 py-6 text-xs text-stone">
            <p>{settings.address}</p>
            <a href={`tel:${settings.phoneDisplay.replace(/\s/g, "")}`} className="block text-ink">
              {settings.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
