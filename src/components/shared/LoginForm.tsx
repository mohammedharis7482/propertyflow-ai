"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPath, getFriendlyAuthError } from "@/services/auth.service";

const demoRoles = [
  {
    label: "User",
    email: "user@propertyflow.ai",
    password: "User@12345",
  },
  {
    label: "Agent",
    email: "agent@propertyflow.ai",
    password: "Agent@12345",
  },
  {
    label: "Admin",
    email: "admin@propertyflow.ai",
    password: "Admin@12345",
  },
];

export default function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = {
      email: isEmail(email) ? undefined : "Enter a valid email address.",
      password:
        password.length >= 6 ? undefined : "Password must be at least 6 characters.",
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setLoading(true);

    try {
      const user = await auth.login(email.trim(), password);
      setLoading(false);
      setSuccess(true);
      globalThis.setTimeout(() => {
        router.push(getDashboardPath(user.role));
      }, 450);
      return;
    } catch (error) {
      setLoading(false);
      setApiError(getFriendlyAuthError(error, "login"));
    }
  }

  function applyDemoCredentials(emailAddress: string, passwordValue: string) {
    setEmail(emailAddress);
    setPassword(passwordValue);
    setErrors({});
    setApiError("");
    setSuccess(false);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Credentials accepted. Redirecting to your dashboard...</p>
        </div>
      )}

      {apiError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold">Email Address</label>

        <div className="relative mt-2">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
              setApiError("");
              setSuccess(false);
            }}
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
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setApiError("");
              setSuccess(false);
            }}
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

      <div className="grid grid-cols-3 gap-2">
        {demoRoles.map((role) => (
          <button
            key={role.label}
            type="button"
            onClick={() => applyDemoCredentials(role.email, role.password)}
            className="rounded-2xl border border-border bg-white px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary hover:bg-emerald-50 hover:text-primary"
          >
            {role.label}
          </button>
        ))}
      </div>

      <Button className="h-12 w-full rounded-2xl" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
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

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
