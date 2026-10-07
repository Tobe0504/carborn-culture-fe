import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, Panel } from "@/components/admin/AdminUI";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api, ApiError } from "@/lib/api";
import type { StoreSettings } from "@/types";

const FIELDS: { key: keyof StoreSettings; label: string; hint?: string; placeholder?: string }[] = [
  {
    key: "whatsappNumber",
    label: "WhatsApp number",
    hint: "Orders are sent here. Country code, no + or spaces, e.g. 2348033008048.",
  },
  { key: "phoneDisplay", label: "Phone (as shown on site)", placeholder: "+234 803 300 8048" },
  { key: "instagramHandle", label: "Instagram handle", placeholder: "carbonculture" },
  { key: "email", label: "Email", placeholder: "hello@carbonculture.ng" },
  { key: "address", label: "Studio address" },
  { key: "deliveryNote", label: "Lagos delivery note", placeholder: "Within 3 working days" },
  { key: "madeToOrderNote", label: "Made-to-order note", placeholder: "Iro & Buba takes 2 weeks after full payment" },
  { key: "announcement", label: "Announcement bar", hint: "Optional. Shown above the header on every page." },
];

const AdminSettingsPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["settings"], queryFn: api.settings });
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  useDocumentTitle("Settings · Admin");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (input: StoreSettings) => api.admin.updateSettings(input),
    onSuccess: (settings) => {
      queryClient.setQueryData(["settings"], settings);
      toast.success("Settings saved");
    },
    onError: (error) => {
      const detail = error instanceof ApiError ? error.details?.[0] : undefined;
      toast.error(detail?.message || error.message);
    },
  });

  const changePassword = useMutation({
    mutationFn: () => api.changePassword(passwords.current, passwords.next),
    onSuccess: () => {
      toast.success("Password updated");
      setPasswords({ current: "", next: "" });
    },
    onError: (error) => toast.error(error.message),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    const { whatsappNumber, phoneDisplay, instagramHandle, email, address, deliveryNote, madeToOrderNote, announcement } =
      form;
    save.mutate({
      whatsappNumber: whatsappNumber.replace(/\D/g, ""),
      phoneDisplay,
      instagramHandle: instagramHandle.replace(/^@/, ""),
      email,
      address,
      deliveryNote,
      madeToOrderNote,
      announcement,
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Settings" description="Contact details and notes used across the store." />

      <Panel title="Store details">
        {!form ? (
          <div className="h-64 animate-pulse bg-sand/60" />
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.key} className={field.key === "address" || field.key === "announcement" ? "sm:col-span-2" : ""}>
                  <label htmlFor={field.key} className="field-label">{field.label}</label>
                  <input
                    id={field.key}
                    className="field"
                    value={form[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                    inputMode={field.key === "whatsappNumber" ? "numeric" : undefined}
                  />
                  {field.hint && <p className="mt-1.5 text-[13px] text-stone">{field.hint}</p>}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn" disabled={save.isPending}>
                {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save settings
              </button>
            </div>
          </form>
        )}
      </Panel>

      <Panel title="Change password">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            changePassword.mutate();
          }}
          className="grid gap-5 sm:grid-cols-2"
        >
          <div>
            <label htmlFor="current-password" className="field-label">Current password</label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              className="field"
              value={passwords.current}
              onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor="new-password" className="field-label">New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              className="field"
              value={passwords.next}
              onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
            />
            <p className="mt-1.5 text-[13px] text-stone">At least 8 characters.</p>
          </div>
          <div className="flex justify-end sm:col-span-2">
            <button
              type="submit"
              className="btn-outline"
              disabled={changePassword.isPending || !passwords.current || passwords.next.length < 8}
            >
              Update password
            </button>
          </div>
        </form>
      </Panel>
    </div>
  );
};

export default AdminSettingsPage;
