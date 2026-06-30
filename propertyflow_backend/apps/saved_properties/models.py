from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.properties.models import Property


class SavedProperty(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_properties",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="saved_by",
    )

    class Meta:
        verbose_name_plural = "Saved properties"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "property"],
                name="unique_saved_property_per_user",
            )
        ]

    def __str__(self):
        return f"{self.user.email} saved {self.property.title}"
