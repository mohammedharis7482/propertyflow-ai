from django.urls import path

from apps.ai_insights.views import (
    AIRecommendationsView,
    LeadPriorityView,
    ListingQualityView,
    MarketSignalsView,
    PropertyMatchScoreView,
)


urlpatterns = [
    path("recommendations/", AIRecommendationsView.as_view(), name="ai-recommendations"),
    path("properties/<slug:slug>/match-score/", PropertyMatchScoreView.as_view(), name="ai-property-match-score"),
    path("inquiries/<int:pk>/lead-priority/", LeadPriorityView.as_view(), name="ai-lead-priority"),
    path("properties/<slug:slug>/listing-quality/", ListingQualityView.as_view(), name="ai-listing-quality"),
    path("market-signals/", MarketSignalsView.as_view(), name="ai-market-signals"),
]
