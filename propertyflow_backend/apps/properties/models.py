from django.db import models
from django.utils.functional import cached_property

from apps.agents.models import AgentProfile
from apps.core.models import BaseModel


class PropertyFeature(BaseModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    icon = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Property(BaseModel):
    class PropertyType(models.TextChoices):
        APARTMENT = "APARTMENT", "Apartment"
        VILLA = "VILLA", "Villa"
        TOWNHOUSE = "TOWNHOUSE", "Townhouse"
        PENTHOUSE = "PENTHOUSE", "Penthouse"
        OFFICE = "OFFICE", "Office"
        RETAIL = "RETAIL", "Retail"
        LAND = "LAND", "Land"

    class Purpose(models.TextChoices):
        SALE = "SALE", "Sale"
        RENT = "RENT", "Rent"

    class FurnishingStatus(models.TextChoices):
        UNFURNISHED = "UNFURNISHED", "Unfurnished"
        SEMI_FURNISHED = "SEMI_FURNISHED", "Semi Furnished"
        FULLY_FURNISHED = "FULLY_FURNISHED", "Fully Furnished"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        SOLD = "SOLD", "Sold"
        RENTED = "RENTED", "Rented"
        ARCHIVED = "ARCHIVED", "Archived"

    class ApprovalStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    agent = models.ForeignKey(
        AgentProfile,
        on_delete=models.PROTECT,
        related_name="properties",
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    property_type = models.CharField(max_length=30, choices=PropertyType.choices)
    purpose = models.CharField(max_length=10, choices=Purpose.choices)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=8, default="AED")
    country = models.CharField(max_length=120)
    city = models.CharField(max_length=120)
    area = models.CharField(max_length=160)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.PositiveIntegerField(default=0)
    parking_spaces = models.PositiveIntegerField(default=0)
    size_sqft = models.PositiveIntegerField()
    furnishing_status = models.CharField(
        max_length=30,
        choices=FurnishingStatus.choices,
        default=FurnishingStatus.UNFURNISHED,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )
    approval_status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING,
    )
    features = models.ManyToManyField(
        PropertyFeature,
        related_name="properties",
        blank=True,
    )
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ["-is_featured", "-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["status", "approval_status"]),
            models.Index(fields=["city", "area"]),
            models.Index(fields=["purpose", "property_type"]),
            models.Index(fields=["price"]),
        ]

    def __str__(self):
        return self.title


class PropertyImage(BaseModel):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="properties/", blank=True, null=True)
    image_url = models.URLField(max_length=700, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "created_at"]
        indexes = [
            models.Index(fields=["is_primary", "order"]),
        ]

    def __str__(self):
        return self.alt_text or self.property.title

    @cached_property
    def best_url(self):
        if self.image:
            return self.image.url
        return self.image_url
