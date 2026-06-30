from rest_framework import serializers

from apps.ai_insights.models import AIInsight
from apps.properties.serializers import PropertyListSerializer


class AIInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInsight
        fields = (
            "id",
            "insight_type",
            "score",
            "title",
            "summary",
            "metadata",
            "created_at",
            "updated_at",
        )


class AIRecommendationSerializer(serializers.Serializer):
    property = PropertyListSerializer()
    match_score = serializers.IntegerField()
    reason = serializers.CharField()


class PropertyMatchScoreSerializer(serializers.Serializer):
    property_slug = serializers.CharField()
    score = serializers.IntegerField()
    summary = serializers.CharField()
    reasons = serializers.ListField(child=serializers.CharField(), required=False)


class LeadPrioritySerializer(serializers.Serializer):
    inquiry_id = serializers.IntegerField()
    score = serializers.IntegerField()
    priority = serializers.CharField()
    summary = serializers.CharField()


class ListingQualitySerializer(serializers.Serializer):
    property_slug = serializers.CharField()
    score = serializers.IntegerField()
    summary = serializers.CharField()
    suggestions = serializers.ListField(child=serializers.CharField())


class MarketSignalsSerializer(serializers.Serializer):
    top_cities = serializers.ListField()
    popular_property_types = serializers.ListField()
    demand_signals = serializers.ListField()
    listing_counts = serializers.IntegerField()
    inquiry_counts = serializers.IntegerField()
    appointment_counts = serializers.IntegerField()
    demand_summary = serializers.CharField()

