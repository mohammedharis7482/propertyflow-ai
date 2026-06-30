from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class Notification(BaseModel):
    class NotificationType(models.TextChoices):
        SYSTEM = "SYSTEM", "System"
        PROPERTY = "PROPERTY", "Property"
        INQUIRY = "INQUIRY", "Inquiry"
        APPOINTMENT = "APPOINTMENT", "Appointment"
        ACCOUNT = "ACCOUNT", "Account"
        AI = "AI", "AI"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["notification_type", "is_read"]),
        ]

    def __str__(self):
        return self.title
