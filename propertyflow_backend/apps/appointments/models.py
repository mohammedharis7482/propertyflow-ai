from django.conf import settings
from django.db import models

from apps.agents.models import AgentProfile
from apps.core.models import BaseModel
from apps.inquiries.models import Inquiry
from apps.properties.models import Property


class Appointment(BaseModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"
        RESCHEDULED = "RESCHEDULED", "Rescheduled"
        NO_SHOW = "NO_SHOW", "No Show"

    class VisitType(models.TextChoices):
        IN_PERSON = "IN_PERSON", "In Person"
        VIRTUAL = "VIRTUAL", "Virtual"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="appointments")
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="appointments")
    agent = models.ForeignKey(AgentProfile, on_delete=models.CASCADE, related_name="appointments")
    inquiry = models.ForeignKey(Inquiry, on_delete=models.SET_NULL, related_name="appointments", blank=True, null=True)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    visit_type = models.CharField(max_length=20, choices=VisitType.choices, default=VisitType.IN_PERSON)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["appointment_date", "appointment_time"]
        indexes = [
            models.Index(fields=["status", "appointment_date"]),
            models.Index(fields=["visit_type"]),
        ]

    def __str__(self):
        return f"{self.property.title} - {self.appointment_date} {self.appointment_time}"
