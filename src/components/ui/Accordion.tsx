import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-4 text-left text-xs"
      >
        {title}
        <span aria-hidden="true" className="text-[16px] leading-none text-stone">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5 text-xs leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};
