from django.db import models

from apps.core.models import BaseModel


class Agency(BaseModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    logo = models.ImageField(upload_to="agencies/logos/", blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    website = models.URLField(blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Agencies"
        ordering = ["name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["city", "country"]),
        ]

    def __str__(self):
        return self.name
