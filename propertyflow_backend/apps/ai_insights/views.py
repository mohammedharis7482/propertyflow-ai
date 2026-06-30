from rest_framework import permissions, response, views
from rest_framework.exceptions import NotFound, PermissionDenied

from apps.ai_insights.serializers import (
    AIRecommendationSerializer,
    LeadPrioritySerializer,
    ListingQualitySerializer,
    MarketSignalsSerializer,
    PropertyMatchScoreSerializer,
)
from apps.ai_insights.services import (
    generate_lead_priority,
    generate_listing_quality,
    generate_market_signal_summary,
    generate_property_match_score,
    generate_user_recommendations,
)
from apps.inquiries.models import Inquiry
from apps.properties.models import Property


class AIRecommendationsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        recommendations = generate_user_recommendations(request.user)
        serializer = AIRecommendationSerializer(
            recommendations,
            many=True,
            context={"request": request},
        )
        return response.Response({"results": serializer.data})


class PropertyMatchScoreView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, slug):
        property_obj = get_published_property(slug)
        match = generate_property_match_score(request.user, property_obj)
        serializer = PropertyMatchScoreSerializer(
            {
                "property_slug": property_obj.slug,
                "score": match["score"],
                "summary": match["summary"],
                "reasons": match.get("reasons", []),
            }
        )
        return response.Response(serializer.data)


class LeadPriorityView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        inquiry = (
            Inquiry.objects.select_related("agent__user", "property", "user")
            .filter(pk=pk)
            .first()
        )
        if not inquiry:
            raise NotFound("Inquiry not found.")
        if not can_access_inquiry_ai(request.user, inquiry):
            raise PermissionDenied("You do not have access to this inquiry AI signal.")

        result = generate_lead_priority(inquiry)
        serializer = LeadPrioritySerializer(
            {
                "inquiry_id": inquiry.id,
                "score": result["score"],
                "priority": result["priority"],
                "summary": result["summary"],
            }
        )
        return response.Response(serializer.data)


class ListingQualityView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, slug):
        property_obj = (
            Property.objects.select_related("agent__user")
            .prefetch_related("images", "features")
            .filter(slug=slug)
            .first()
        )
        if not property_obj:
            raise NotFound("Property not found.")
        if not can_access_property_ai(request.user, property_obj):
            raise PermissionDenied("You do not have access to this listing quality signal.")

        result = generate_listing_quality(property_obj)
        serializer = ListingQualitySerializer(
            {
                "property_slug": property_obj.slug,
                "score": result["score"],
                "summary": result["summary"],
                "suggestions": result["suggestions"],
            }
        )
        return response.Response(serializer.data)


class MarketSignalsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = MarketSignalsSerializer(generate_market_signal_summary())
        return response.Response(serializer.data)


def get_published_property(slug):
    property_obj = (
        Property.objects.select_related("agent__user", "agent__agency")
        .prefetch_related("images", "features")
        .filter(
            slug=slug,
            status=Property.Status.PUBLISHED,
            approval_status=Property.ApprovalStatus.APPROVED,
        )
        .first()
    )
    if not property_obj:
        raise NotFound("Property not found.")
    return property_obj


def can_access_inquiry_ai(user, inquiry):
    if user.role == "ADMIN":
        return True
    return hasattr(user, "agent_profile") and inquiry.agent_id == user.agent_profile.id


def can_access_property_ai(user, property_obj):
    if user.role == "ADMIN":
        return True
    return hasattr(user, "agent_profile") and property_obj.agent_id == user.agent_profile.id

