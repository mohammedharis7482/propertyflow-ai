"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { profileApi } from "@/lib/api";

const initialProfile = {
  name: "Ahmed Al Mansoori",
  role: "Luxury Property Advisor",
  email: "ahmed@propertyflow.ai",
  phone: "+971 50 000 0000",
  location: "Palm Jumeirah, Dubai",
  languages: "English, Arabic",
  specialties: "Luxury Sales, Investment, Residential",
  bio: "Experienced luxury real estate advisor focused on premium Dubai properties, high-net-worth buyers, and data-informed investment decisions.",
};

export default function AgentProfileForm() {
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
    const result = await profileApi.updateAgent(profile);
    setSaved(result.status === "success");
    setApiError(result.status === "error" ? result.message : "");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white">
            AM
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold">
              Advisor Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Keep your public agent profile accurate and conversion-ready.
            </p>
          </div>
        </div>

        <Button className="rounded-2xl">
          <Save size={18} className="mr-2" />
          Save Changes
        </Button>
      </div>

      {saved && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Profile changes are ready to sync when the backend is connected.</p>
        </div>
      )}

      {apiError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <ProfileField
          icon={User}
          label="Full Name"
          value={profile.name}
          onChange={(value) => updateField("name", value)}
        />
        <ProfileField
          icon={User}
          label="Role"
          value={profile.role}
          onChange={(value) => updateField("role", value)}
        />
        <ProfileField
          icon={Mail}
          label="Email"
          value={profile.email}
          onChange={(value) => updateField("email", value)}
        />
        <ProfileField
          icon={Phone}
          label="Phone"
          value={profile.phone}
          onChange={(value) => updateField("phone", value)}
        />
        <ProfileField
          icon={MapPin}
          label="Location"
          value={profile.location}
          onChange={(value) => updateField("location", value)}
        />
        <ProfileField
          icon={User}
          label="Languages"
          value={profile.languages}
          onChange={(value) => updateField("languages", value)}
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block rounded-2xl border border-border bg-[#F8FAF9] p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Specialties
          </span>
          <textarea
            rows={4}
            value={profile.specialties}
            onChange={(event) => updateField("specialties", event.target.value)}
            className="mt-3 w-full resize-none bg-transparent text-sm font-medium text-foreground outline-none"
          />
        </label>

        <label className="block rounded-2xl border border-border bg-[#F8FAF9] p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Public Bio
          </span>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            className="mt-3 w-full resize-none bg-transparent text-sm font-medium leading-6 text-foreground outline-none"
          />
        </label>
      </div>
    </form>
  );
}

function ProfileField({
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
        <Icon size={18} className="text-primary" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
        />
      </div>
    </label>
  );
}
