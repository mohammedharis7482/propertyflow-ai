from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.inquiries.models import Inquiry
from apps.properties.models import Property


class AIInsight(BaseModel):
    class InsightType(models.TextChoices):
        PROPERTY_RECOMMENDATION = "PROPERTY_RECOMMENDATION", "Property Recommendation"
        MATCH_SCORE = "MATCH_SCORE", "Match Score"
        LEAD_PRIORITY = "LEAD_PRIORITY", "Lead Priority"
        LISTING_QUALITY = "LISTING_QUALITY", "Listing Quality"
        MARKET_SIGNAL = "MARKET_SIGNAL", "Market Signal"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_insights",
        blank=True,
        null=True,
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="ai_insights",
        blank=True,
        null=True,
    )
    inquiry = models.ForeignKey(
        Inquiry,
        on_delete=models.CASCADE,
        related_name="ai_insights",
        blank=True,
        null=True,
    )
    insight_type = models.CharField(max_length=40, choices=InsightType.choices)
    score = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=255)
    summary = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["insight_type", "score"]),
            models.Index(fields=["user", "insight_type"]),
            models.Index(fields=["property", "insight_type"]),
        ]

    def __str__(self):
        return f"{self.get_insight_type_display()} - {self.score}"

