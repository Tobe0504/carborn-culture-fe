import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/format";

export const AdminPageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-[32px] font-light leading-tight">{title}</h1>
      {description && <p className="mt-1 text-[15px] text-stone">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Panel = ({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => (
  <section className={cn("border border-line bg-white", className)}>
    {title && (
      <header className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="label text-[12px]">{title}</h2>
        {description && <p className="mt-1 text-[13px] text-stone">{description}</p>}
      </header>
    )}
    <div className="p-5 sm:p-6">{children}</div>
  </section>
);

export const Toggle = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) => (
  <label className="flex cursor-pointer items-start justify-between gap-4">
    <span>
      <span className="block text-[15px]">{label}</span>
      {description && <span className="mt-0.5 block text-[13px] text-stone">{description}</span>}
    </span>
    <span className="relative mt-0.5 inline-flex shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
        role="switch"
      />
      <span className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
    </span>
  </label>
);

export const StatusBadge = ({ status }: { status: "published" | "draft" }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em]",
      status === "published" ? "bg-[#E7F3EC] text-[#14663A]" : "bg-sand text-stone",
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", status === "published" ? "bg-[#14663A]" : "bg-stone")} />
    {status === "published" ? "Live" : "Draft"}
  </span>
);

export const ConfirmDialog = ({
  open,
  title,
  body,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  busy,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-sm animate-fade-up bg-paper p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="text-xl font-light">
          {title}
        </h2>
        <p className="mt-2 text-[15px] text-stone">{body}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelRef} type="button" onClick={onCancel} className="btn-outline px-5 py-3">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center bg-[#B42318] px-5 py-3 text-[11px] uppercase tracking-label text-white transition-colors hover:bg-[#912018] disabled:opacity-50"
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
