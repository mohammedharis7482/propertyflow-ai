"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getFriendlyAuthError } from "@/services/auth.service";

const accountTypes = ["Buyer", "Agent", "Investor"];

export default function RegisterForm() {
  const router = useRouter();
  const auth = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "Buyer",
    accepted: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateValue(key: keyof typeof values, value: string | boolean) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setApiError("");
    setSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await auth.register({
        full_name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.accountType === "Agent" ? "AGENT" : "USER",
      });
      setLoading(false);
      setSuccess(true);
      globalThis.setTimeout(() => {
        router.push("/login");
      }, 450);
      setValues({
        name: "",
        email: "",
        password: "",
        accountType: "Buyer",
        accepted: false,
      });
      return;
    } catch (error) {
      setLoading(false);
      setApiError(getFriendlyAuthError(error));
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Account created. Redirecting to sign in...</p>
        </div>
      )}

      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold">Full Name</label>
        <div className="relative mt-2">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            placeholder="John Doe"
            className={inputClass(Boolean(errors.name))}
          />
        </div>
        {errors.name && (
          <p className="mt-2 text-xs font-medium text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold">Email Address</label>
        <div className="relative mt-2">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            placeholder="you@example.com"
            className={inputClass(Boolean(errors.email))}
          />
        </div>
        {errors.email && (
          <p className="mt-2 text-xs font-medium text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold">Password</label>
        <div className="relative mt-2">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="password"
            value={values.password}
            onChange={(event) => updateValue("password", event.target.value)}
            placeholder="••••••••"
            className={inputClass(Boolean(errors.password))}
          />
        </div>
        {errors.password && (
          <p className="mt-2 text-xs font-medium text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <p className="text-sm font-semibold">Account Type</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {accountTypes.map((type) => {
            const active = values.accountType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => updateValue("accountType", type)}
                className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "border-primary bg-emerald-50 text-primary"
                    : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-border bg-secondary p-4">
        <input
          type="checkbox"
          checked={values.accepted}
          onChange={(event) => updateValue("accepted", event.target.checked)}
          className="mt-1 h-4 w-4 accent-emerald-600"
        />
        <span className="text-sm leading-6 text-muted-foreground">
          I agree to be contacted about PropertyFlow AI services and understand
          this frontend demo will connect to backend terms later.
        </span>
      </label>
      {errors.accepted && (
        <p className="-mt-3 text-xs font-medium text-red-600">
          {errors.accepted}
        </p>
      )}

      <Button className="h-12 w-full rounded-2xl" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
        <ArrowRight size={18} className="ml-2" />
      </Button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `h-12 w-full rounded-2xl border bg-secondary pl-12 pr-4 text-sm outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-border focus:border-primary focus:ring-emerald-100"
  }`;
}

function validate(values: {
  name: string;
  email: string;
  password: string;
  accepted: boolean;
}) {
  const errors: Partial<Record<keyof typeof values, string>> = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!values.accepted) {
    errors.accepted = "Accept the contact terms to continue.";
  }

  return errors;
}
