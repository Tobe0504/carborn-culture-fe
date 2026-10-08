import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import SiteLayout from "@/components/layout/SiteLayout";
import { AuthProvider } from "@/context/AuthContext";
import { BagProvider } from "@/context/BagContext";
import CollectionsPage from "@/pages/CollectionsPage";
import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import ProductPage from "@/pages/ProductPage";
import StoryPage from "@/pages/StoryPage";

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/AdminProductsPage"));
const AdminProductFormPage = lazy(() => import("@/pages/admin/AdminProductFormPage"));
const AdminCollectionsPage = lazy(() => import("@/pages/admin/AdminCollectionsPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BagProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-cream" />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route index element={<HomePage />} />
                <Route path="our-story" element={<StoryPage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="product/:slug" element={<ProductPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="admin/login" element={<AdminLoginPage />} />
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/:productId" element={<AdminProductFormPage />} />
                <Route path="collections" element={<AdminCollectionsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { borderRadius: 0, fontFamily: "Jost, sans-serif", border: "1px solid #E2DACD" },
          }}
        />
      </AuthProvider>
    </BagProvider>
  </QueryClientProvider>
);

export default App;
