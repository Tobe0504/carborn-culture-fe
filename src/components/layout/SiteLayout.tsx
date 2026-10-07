import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BagDrawer from "./BagDrawer";
import Footer from "./Footer";
import Header from "./Header";

const useScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }));
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
};

const SiteLayout = () => {
  useScrollManager();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BagDrawer />
    </div>
  );
};

export default SiteLayout;
