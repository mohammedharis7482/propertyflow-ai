"use client";

import { CalendarCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { getAccessToken } from "@/lib/auth-token";
import { createInquiry } from "@/services/inquiry.service";

interface AgentDetailsActionsProps {
  agentName: string;
  agentRole: string;
  propertySlug?: string;
}

export default function AgentDetailsActions({
  agentName,
  agentRole,
  propertySlug,
}: AgentDetailsActionsProps) {
  const router = useRouter();
  const { user } = useAuth();

  async function submitAgentInquiry(values: Record<string, string>) {
    if (!getAccessToken()) {
      router.push("/login");
      throw new Error("Please sign in to continue.");
    }

    if (!propertySlug) {
      throw new Error("No representative property is available for this agent yet.");
    }

    try {
      await createInquiry({
        property_slug: propertySlug,
        full_name: values.name || user?.full_name || "",
        email: values.email || user?.email || "",
        phone: values.phone || user?.phone || "",
        message: values.message || `I would like help from ${agentName}.`,
        source: "AGENT_PROFILE",
      });
    } catch (error) {
      throw new Error(getActionErrorMessage(error));
    }
  }

  return (
    <div className="mt-6 grid gap-3">
      <DashboardActionDrawer
        actionType="reply_inquiry"
        title={`Message ${agentName}`}
        description={`Send an inquiry to this ${agentRole.toLowerCase()}.`}
        triggerLabel="Send Message"
        submitLabel="Send Message"
        successMessage="Inquiry submitted successfully"
        onSubmitAction={submitAgentInquiry}
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
            placeholder: "I would like help with premium GCC properties...",
            type: "textarea",
            required: true,
          },
        ]}
      />

      <DashboardActionDrawer
        actionType="schedule_viewing"
        title={`Request callback from ${agentName}`}
        description="Log a callback request locally before backend CRM routing is connected."
        triggerLabel="Request Callback"
        submitLabel="Save Callback"
        icon={<Phone size={18} className="mr-2" />}
        buttonVariant="outline"
        buttonClassName="w-full rounded-2xl bg-white"
        fields={[
          {
            name: "phone",
            label: "Phone",
            placeholder: "+971 50 000 0000",
          },
          {
            name: "time",
            label: "Preferred Time",
            placeholder: "Today after 4 PM",
          },
        ]}
      />

      <Button variant="outline" className="w-full rounded-2xl bg-white" asChild>
        <a href="mailto:hello@propertyflow.ai">
          <Mail size={18} className="mr-2" />
          Email Agent
        </a>
      </Button>

      <DashboardActionDrawer
        actionType="schedule_viewing"
        title={`Schedule advisory with ${agentName}`}
        description="Create a mock advisory/viewing request for this agent."
        triggerLabel="Schedule Advisory"
        submitLabel="Save Request"
        icon={<CalendarCheck size={18} className="mr-2" />}
        buttonVariant="outline"
        buttonClassName="w-full rounded-2xl bg-white"
        fields={[
          {
            name: "propertyType",
            label: "Property Type",
            placeholder: "Luxury villa, apartment, investment property...",
          },
          {
            name: "notes",
            label: "Notes",
            placeholder: "Budget, location preference, timeline...",
            type: "textarea",
          },
        ]}
      />
    </div>
  );
}
