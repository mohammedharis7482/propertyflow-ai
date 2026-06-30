"use client";

import { Bell } from "lucide-react";

import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import { sendAdminNotification } from "@/services/admin-actions.service";

export default function AdminNotificationSender() {
  return (
    <DashboardActionDrawer
      actionType="review_approval"
      title="Send Admin Notification"
      description="Send a platform notification to users, agents, or a specific account."
      triggerLabel="Send Notification"
      submitLabel="Send Notification"
      successMessage="Admin notification sent successfully"
      buttonVariant="outline"
      buttonClassName="rounded-2xl bg-white"
      icon={<Bell size={18} className="mr-2" />}
      onSubmitAction={async (values) => {
        if (!values.title?.trim()) {
          throw new Error("Notification title is required.");
        }
        if (!values.message?.trim()) {
          throw new Error("Notification message is required.");
        }

        const targetType = normalizeTargetType(values.target_type);
        const payload = await sendAdminNotification({
          target_type: targetType,
          user_id: targetType === "SPECIFIC_USER" ? values.user_id : undefined,
          title: values.title,
          message: values.message,
          notification_type: normalizeNotificationType(values.notification_type),
        });

        if (payload.notified_count !== undefined) {
          return `${payload.notified_count} account${payload.notified_count === 1 ? "" : "s"} notified.`;
        }
      }}
      fields={[
        {
          name: "target_type",
          label: "Target",
          placeholder: "ALL_USERS, ALL_AGENTS, or SPECIFIC_USER",
          required: true,
        },
        {
          name: "user_id",
          label: "Specific User ID",
          placeholder: "Only required for SPECIFIC_USER",
        },
        {
          name: "notification_type",
          label: "Notification Type",
          placeholder: "SYSTEM, ACCOUNT, PROPERTY, INQUIRY, APPOINTMENT, or AI",
          required: true,
        },
        {
          name: "title",
          label: "Title",
          placeholder: "PropertyFlow AI Update",
          required: true,
        },
        {
          name: "message",
          label: "Message",
          placeholder: "New property insights are available.",
          type: "textarea",
          required: true,
        },
      ]}
    />
  );
}

function normalizeTargetType(value?: string) {
  const normalized = value?.trim().toUpperCase() ?? "";

  if (normalized === "ALL_AGENTS" || normalized === "SPECIFIC_USER") {
    return normalized;
  }

  return "ALL_USERS";
}

function normalizeNotificationType(value?: string) {
  const normalized = value?.trim().toUpperCase() ?? "";

  if (
    normalized === "PROPERTY" ||
    normalized === "INQUIRY" ||
    normalized === "APPOINTMENT" ||
    normalized === "ACCOUNT" ||
    normalized === "AI"
  ) {
    return normalized;
  }

  return "SYSTEM";
}
