import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BagItem } from "@/types";

const STORAGE_KEY = "carbon-culture.bag";

interface BagContextValue {
  items: BagItem[];
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<BagItem, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);

const readBag = (): BagItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const BagProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BagItem[]>(readBag);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  }, [items]);

  const add = useCallback((item: Omit<BagItem, "key">) => {
    const key = `${item.productId}|${item.size}|${item.colour}`;
    setItems((current) => {
      const existing = current.find((entry) => entry.key === key);
      if (existing) {
        return current.map((entry) =>
          entry.key === key ? { ...entry, quantity: Math.min(entry.quantity + item.quantity, 20) } : entry,
        );
      }
      return [...current, { ...item, key }];
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current.map((entry) =>
        entry.key === key ? { ...entry, quantity: Math.max(1, Math.min(quantity, 20)) } : entry,
      ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((current) => current.filter((entry) => entry.key !== key));
  }, []);

  const value = useMemo<BagContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      clear: () => setItems([]),
    }),
    [items, isOpen, add, setQuantity, remove],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
};

export const useBag = () => {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used inside BagProvider");
  return context;
};
