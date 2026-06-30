export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "NO_SHOW";

export type VisitType = "IN_PERSON" | "VIRTUAL";

export interface CreateAppointmentPayload {
  property_slug: string;
  appointment_date: string;
  appointment_time: string;
  visit_type: VisitType;
  notes?: string;
}
