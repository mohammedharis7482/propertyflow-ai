"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  DollarSign,
  Mail,
  MapPin,
  Save,
  Search,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api";

const initialProfile = {
  name: "Mohammed Haris",
  email: "mohammed@example.com",
  role: "Buyer / Investor Account",
  preferredMarket: "Dubai, UAE",
  budget: "AED 2M - AED 6M",
  propertyIntent: "Luxury villa, waterfront apartment, long-term investment",
};

export default function UserProfileForm() {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState("");

  function updateField(key: keyof typeof initialProfile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setApiError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await profileApi.updateUser(profile);
    setSaved(result.status === "success");
    setApiError(result.status === "error" ? result.message : "");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
            MH
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold">Buyer Profile</h2>
            <p className="text-sm text-muted-foreground">
              Keep your matching profile accurate for stronger AI recommendations.
            </p>
          </div>
        </div>

        <Button className="rounded-2xl">
          <Save size={18} className="mr-2" />
          Save Profile
        </Button>
      </div>

      {saved && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Profile preferences are ready to sync when the backend is connected.</p>
        </div>
      )}

      {apiError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <ProfileInput
          icon={User}
          label="Full Name"
          value={profile.name}
          onChange={(value) => updateField("name", value)}
        />
        <ProfileInput
          icon={Mail}
          label="Email"
          value={profile.email}
          onChange={(value) => updateField("email", value)}
        />
        <ProfileInput
          icon={User}
          label="Account Role"
          value={profile.role}
          onChange={(value) => updateField("role", value)}
        />
        <ProfileInput
          icon={MapPin}
          label="Preferred Market"
          value={profile.preferredMarket}
          onChange={(value) => updateField("preferredMarket", value)}
        />
        <ProfileInput
          icon={DollarSign}
          label="Budget Range"
          value={profile.budget}
          onChange={(value) => updateField("budget", value)}
        />
        <ProfileInput
          icon={Search}
          label="Property Intent"
          value={profile.propertyIntent}
          onChange={(value) => updateField("propertyIntent", value)}
        />
      </div>
    </form>
  );
}

function ProfileInput({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-border bg-[#F8FAF9] p-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-3 flex items-center gap-3">
        <Icon size={18} className="shrink-0 text-primary" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
        />
      </div>
    </label>
  );
}
