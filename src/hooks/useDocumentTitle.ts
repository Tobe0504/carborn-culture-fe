import { useEffect } from "react";

const BASE = "Carbon Culture";

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — African. Relaxed. Sustainable.`;
  }, [title]);
};
