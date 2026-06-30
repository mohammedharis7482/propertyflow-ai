from django.core.exceptions import ValidationError
from django.db import models

from apps.accounts.models import User
from apps.agencies.models import Agency
from apps.core.models import BaseModel


class AgentProfile(BaseModel):
    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="agent_profile",
    )
    agency = models.ForeignKey(
        Agency,
        on_delete=models.SET_NULL,
        related_name="agents",
        blank=True,
        null=True,
    )
    slug = models.SlugField(max_length=255, unique=True)
    license_number = models.CharField(max_length=120, unique=True)
    bio = models.TextField(blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    languages = models.CharField(max_length=255, blank=True)
    service_areas = models.CharField(max_length=255, blank=True)
    specialization = models.CharField(max_length=255, blank=True)
    profile_image = models.ImageField(upload_to="agents/profiles/", blank=True, null=True)
    profile_image_url = models.URLField(max_length=700, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    total_sales = models.PositiveIntegerField(default=0)
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_featured", "-rating", "user__full_name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["verification_status", "is_featured"]),
        ]

    def clean(self):
        if self.user_id and self.user.role != User.Role.AGENT:
            raise ValidationError("Only users with AGENT role can have an agent profile.")

    def __str__(self):
        return self.user.full_name or self.user.email
