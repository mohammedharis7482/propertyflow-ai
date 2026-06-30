"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, CheckCircle2, Heart, MessageCircle } from "lucide-react";

import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import ActionMessage from "@/components/shared/ActionMessage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-token";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { useAuth } from "@/context/AuthContext";
import { createAppointment } from "@/services/appointment.service";
import { createInquiry } from "@/services/inquiry.service";
import { saveProperty, unsaveProperty } from "@/services/property-actions.service";

interface PropertyDetailsActionsProps {
  propertySlug: string;
  propertyTitle: string;
  propertyLocation: string;
  compact?: boolean;
}

export default function PropertyDetailsActions({
  propertySlug,
  propertyTitle,
  propertyLocation,
  compact = false,
}: PropertyDetailsActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  function requireAuth() {
    if (!getAccessToken()) {
      showToast("Please login to continue.", "error");
      router.push(`/login?next=${encodeURIComponent(`/properties/${propertySlug}`)}`);
      return false;
    }

    return true;
  }

  async function handleSaveToggle() {
    if (!requireAuth()) {
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      if (saved) {
        await unsaveProperty(propertySlug);
        setSaved(false);
        setMessage("Property removed from saved list.");
        showToast("Property removed from saved list.");
      } else {
        await saveProperty(propertySlug);
        setSaved(true);
        setMessage("Property saved successfully.");
        showToast("Property saved successfully.");
      }

      setMessageType("success");
    } catch (error) {
      setMessageType("error");
      const errorMessage = getActionErrorMessage(error);
      setMessage(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  }

  async function submitInquiry(values: Record<string, string>) {
    if (!requireAuth()) {
      throw new Error("Please sign in to continue.");
    }

    try {
      if (!values.name && !user?.full_name) {
        throw new Error("Please enter your name.");
      }
      if (!values.email && !user?.email) {
        throw new Error("Please enter your email.");
      }
      if (!values.message) {
        throw new Error("Please enter your inquiry message.");
      }

      await createInquiry({
        property_slug: propertySlug,
        full_name: values.name || user?.full_name || "",
        email: values.email || user?.email || "",
        phone: values.phone || user?.phone || "",
        message:
          values.message ||
          `I am interested in ${propertyTitle} in ${propertyLocation}.`,
        source: "PROPERTY_DETAIL",
      });
      setMessageType("success");
      setMessage("Inquiry submitted successfully.");
      showToast("Inquiry submitted successfully.");
    } catch (error) {
      throw new Error(getSubmitErrorMessage(error));
    }
  }

  async function submitAppointment(values: Record<string, string>) {
    if (!requireAuth()) {
      throw new Error("Please sign in to continue.");
    }

    try {
      if (!values.date) {
        throw new Error("Please choose a viewing date.");
      }
      if (!values.time) {
        throw new Error("Please choose a viewing time.");
      }

      await createAppointment({
        property_slug: propertySlug,
        appointment_date: values.date,
        appointment_time: values.time,
        visit_type: values.visit_type === "Virtual" ? "VIRTUAL" : "IN_PERSON",
        notes: values.notes,
      });
      setMessageType("success");
      setMessage("Appointment request created.");
      showToast("Appointment request created successfully.");
    } catch (error) {
      throw new Error(getSubmitErrorMessage(error));
    }
  }

  if (compact) {
    return (
      <div className="mt-6 grid gap-3">
        <ActionMessage message={message} type={messageType} />
        <DashboardActionDrawer
          actionType="reply_inquiry"
          title={`Request details for ${propertyTitle}`}
          description="Send an inquiry to the assigned agent."
          triggerLabel="Request Details"
          submitLabel="Submit Inquiry"
          successMessage="Inquiry submitted successfully"
          onSubmitAction={submitInquiry}
          icon={<MessageCircle size={18} className="mr-2" />}
          buttonClassName="w-full rounded-2xl"
          initialValues={{
            name: user?.full_name ?? "",
            email: user?.email ?? "",
            phone: user?.phone ?? "",
          }}
          fields={[
            {
              name: "name",
              label: "Your Name",
              placeholder: "Mohammed Ali",
              required: true,
            },
            {
              name: "email",
              label: "Email",
              placeholder: "you@example.com",
              required: true,
            },
            {
              name: "message",
              label: "Message",
              placeholder: `I would like more details about ${propertyTitle} in ${propertyLocation}.`,
              type: "textarea",
              required: true,
            },
          ]}
        />

        <DashboardActionDrawer
          actionType="schedule_viewing"
          title={`Schedule ${propertyTitle}`}
          description="Create an appointment request for this property."
          triggerLabel="Schedule Viewing"
          submitLabel="Book Viewing"
          successMessage="Appointment request created"
          onSubmitAction={submitAppointment}
          icon={<CalendarCheck size={18} className="mr-2" />}
          buttonVariant="outline"
          buttonClassName="w-full rounded-2xl bg-white"
          fields={[
            {
              name: "date",
              label: "Preferred Date",
              placeholder: "2026-07-10",
              type: "date",
              required: true,
            },
            {
              name: "time",
              label: "Preferred Time",
              placeholder: "10:30",
              type: "time",
              required: true,
            },
            {
              name: "visit_type",
              label: "Visit Type",
              placeholder: "In Person",
            },
            {
              name: "notes",
              label: "Viewing Notes",
              placeholder: "Virtual or physical viewing, budget, timeline...",
              type: "textarea",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:justify-end">
      <ActionMessage message={message} type={messageType} />
      <DashboardActionDrawer
        actionType="reply_inquiry"
        title={`Contact agent for ${propertyTitle}`}
        description="Create a backend inquiry and notify the assigned agent."
        triggerLabel="Contact Agent"
        submitLabel="Submit Inquiry"
        successMessage="Inquiry submitted successfully"
        onSubmitAction={submitInquiry}
        icon={<MessageCircle size={18} className="mr-2" />}
        buttonClassName="sm:w-auto"
        initialValues={{
          name: user?.full_name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
        }}
        fields={[
          {
            name: "name",
            label: "Your Name",
            placeholder: "Mohammed Ali",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            placeholder: "you@example.com",
            required: true,
          },
          {
            name: "phone",
            label: "Phone",
            placeholder: "+971 50 000 0000",
          },
          {
            name: "message",
            label: "Message",
            placeholder: `I am interested in ${propertyTitle}.`,
            type: "textarea",
            required: true,
          },
        ]}
      />

      <Button
        variant={saved ? "default" : "outline"}
        size="icon"
        className="hidden sm:inline-flex"
        aria-label={saved ? "Property saved" : "Save property"}
        type="button"
        disabled={saving}
        onClick={handleSaveToggle}
      >
        {saved ? <CheckCircle2 size={18} /> : <Heart size={18} />}
      </Button>
    </div>
  );
}

function getSubmitErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return getActionErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return getActionErrorMessage(error);
}
