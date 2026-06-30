from django.conf import settings
from django.db import models

from apps.agents.models import AgentProfile
from apps.core.models import BaseModel
from apps.properties.models import Property


class Inquiry(BaseModel):
    class Status(models.TextChoices):
        NEW = "NEW", "New"
        CONTACTED = "CONTACTED", "Contacted"
        QUALIFIED = "QUALIFIED", "Qualified"
        NEGOTIATION = "NEGOTIATION", "Negotiation"
        CLOSED = "CLOSED", "Closed"
        LOST = "LOST", "Lost"

    class Source(models.TextChoices):
        PROPERTY_DETAIL = "PROPERTY_DETAIL", "Property Detail"
        CONTACT_FORM = "CONTACT_FORM", "Contact Form"
        AGENT_PROFILE = "AGENT_PROFILE", "Agent Profile"
        AI_RECOMMENDATION = "AI_RECOMMENDATION", "AI Recommendation"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )
    agent = models.ForeignKey(
        AgentProfile,
        on_delete=models.CASCADE,
        related_name="inquiries",
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    source = models.CharField(max_length=30, choices=Source.choices, default=Source.PROPERTY_DETAIL)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)

    class Meta:
        verbose_name_plural = "Inquiries"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "priority"]),
            models.Index(fields=["source"]),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.property.title}"
