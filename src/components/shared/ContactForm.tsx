"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { contactApi } from "@/lib/api";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "General Inquiry",
  message: "",
};

type ContactValues = typeof initialValues;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export default function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function updateField(key: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setApiError("");
    setSent(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateContact(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    const result = await contactApi.submit(values);

    if (result.status === "success") {
      setLoading(false);
      setSent(true);
      setValues(initialValues);
      return;
    }

    setLoading(false);
    setApiError(result.message);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      {sent && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>
            Message received. Our team will review your request and respond with
            the right next step.
          </p>
        </div>
      )}

      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldError label="Full Name" error={errors.name}>
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Enter your name"
            className={fieldClass(Boolean(errors.name))}
          />
        </FieldError>

        <FieldError label="Email Address" error={errors.email}>
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="Enter your email"
            className={fieldClass(Boolean(errors.email))}
          />
        </FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldError label="Phone Number" error={errors.phone}>
          <input
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+971 00 000 0000"
            className={fieldClass(Boolean(errors.phone))}
          />
        </FieldError>

        <FieldError label="Inquiry Type" error={errors.inquiryType}>
          <select
            value={values.inquiryType}
            onChange={(event) => updateField("inquiryType", event.target.value)}
            className={fieldClass(Boolean(errors.inquiryType))}
          >
            <option>General Inquiry</option>
            <option>Agent Onboarding</option>
            <option>Property Listing</option>
            <option>Investment Support</option>
            <option>Partnership</option>
          </select>
        </FieldError>
      </div>

      <FieldError label="Message" error={errors.message}>
        <textarea
          rows={6}
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Tell us how we can help..."
          className={`${fieldClass(Boolean(errors.message))} h-auto resize-none py-3`}
        />
      </FieldError>

      <Button className="h-12 w-full rounded-2xl sm:w-auto" disabled={loading}>
        <Send size={18} className="mr-2" />
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function FieldError({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}

function fieldClass(hasError: boolean) {
  return `h-12 w-full rounded-2xl border bg-secondary px-4 text-sm outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-border focus:border-primary focus:ring-emerald-100"
  }`;
}

function validateContact(values: ContactValues) {
  const errors: ContactErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!isEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.phone.trim().length < 7) {
    errors.phone = "Enter a phone number we can use for follow-up.";
  }

  if (values.message.trim().length < 12) {
    errors.message = "Tell us a little more about your request.";
  }

  return errors;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
