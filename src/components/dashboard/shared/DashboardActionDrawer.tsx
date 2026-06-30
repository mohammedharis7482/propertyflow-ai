"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  dashboardActionApi,
  DashboardActionType,
} from "@/lib/api";

interface ActionField {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "textarea" | "date" | "time";
  required?: boolean;
}

interface DashboardActionDrawerProps {
  actionType: DashboardActionType;
  title: string;
  description: string;
  triggerLabel: string;
  submitLabel?: string;
  fields: ActionField[];
  icon?: React.ReactNode;
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: ButtonProps["size"];
  buttonClassName?: string;
  initialValues?: Record<string, string>;
  successMessage?: string;
  onSubmitAction?: (values: Record<string, string>) => Promise<string | void>;
}

export default function DashboardActionDrawer({
  actionType,
  title,
  description,
  triggerLabel,
  submitLabel = "Submit",
  fields,
  icon,
  buttonVariant,
  buttonSize,
  buttonClassName,
  initialValues,
  successMessage,
  onSubmitAction,
}: DashboardActionDrawerProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      fields.map((field) => [field.name, initialValues?.[field.name] ?? ""])
    )
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (onSubmitAction) {
        const result = await onSubmitAction(values);
        setSuccessText(result || null);
        setSuccess(true);
      } else {
        const result = await dashboardActionApi.submit({
          type: actionType,
          title,
          fields: values,
        });

        setSuccess(result.status === "success");
        setSuccessText(null);
      }
    } catch (err) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : "Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setSuccess(false);
    setSuccessText(null);
    setError(null);
  }

  return (
    <>
      <Button
        size={buttonSize}
        variant={buttonVariant}
        className={buttonClassName}
        onClick={() => setOpen(true)}
        type="button"
      >
        {icon}
        {triggerLabel}
      </Button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <button
            aria-label="Close action panel"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] transition"
            onClick={() => setOpen(false)}
            type="button"
          />

          <aside className="absolute bottom-0 right-0 top-auto flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-border bg-white shadow-2xl shadow-slate-950/10 sm:bottom-auto sm:right-5 sm:top-20 sm:max-h-[calc(100vh-6rem)] sm:w-[min(calc(100vw-2rem),500px)] sm:rounded-[2rem]">
            <div className="shrink-0 border-b border-border px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                <h2 className="font-heading text-2xl font-bold">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-white transition hover:border-emerald-200 hover:text-primary"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {success && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    <p>
                      {successText ??
                        successMessage ??
                        "Action saved successfully."}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-4">
                  {fields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="text-sm font-semibold text-foreground">
                        {field.label}
                      </span>
                      {field.type === "textarea" ? (
                        <textarea
                          value={values[field.name] ?? ""}
                          onChange={(event) =>
                            updateValue(field.name, event.target.value)
                          }
                          placeholder={field.placeholder}
                          required={field.required}
                          rows={3}
                          className="mt-2 max-h-40 min-h-28 w-full resize-y rounded-2xl border border-border bg-[#F8FAF9] px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-emerald-100"
                        />
                      ) : (
                        <input
                          type={field.type ?? "text"}
                          value={values[field.name] ?? ""}
                          onChange={(event) =>
                            updateValue(field.name, event.target.value)
                          }
                          placeholder={field.placeholder}
                          required={field.required}
                          className="mt-2 h-12 w-full rounded-2xl border border-border bg-[#F8FAF9] px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-emerald-100"
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="shrink-0 border-t border-border bg-white px-5 py-4 sm:px-6">
                <div className="grid gap-3 sm:grid-cols-2">
                <Button className="rounded-2xl" disabled={submitting}>
                  {submitting ? "Saving..." : submitLabel}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl bg-white"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
                </div>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
