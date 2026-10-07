import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("Page not found");
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-[26px]">This page could not be found</h1>
      <p className="mt-2 text-xs text-stone">The link may be old, or the page may have moved.</p>
      <Link to="/" className="text-link mt-6 text-xs">
        Return to the homepage
      </Link>
    </section>
  );
};

export default NotFoundPage;
