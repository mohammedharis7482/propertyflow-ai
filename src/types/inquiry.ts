export type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "NEGOTIATION"
  | "CLOSED"
  | "LOST";

export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH";

export type InquirySource =
  | "PROPERTY_DETAIL"
  | "CONTACT_FORM"
  | "AGENT_PROFILE"
  | "AI_RECOMMENDATION";

export interface CreateInquiryPayload {
  property_slug: string;
  full_name: string;
  email: string;
  phone?: string;
  message: string;
  source?: InquirySource;
}
