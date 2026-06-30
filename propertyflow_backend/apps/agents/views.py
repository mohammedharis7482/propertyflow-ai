from rest_framework import decorators, permissions, response, viewsets

from apps.agents.filters import AgentProfileFilter
from apps.agents.models import AgentProfile
from apps.agents.serializers import AgentDetailSerializer, AgentListSerializer


class AgentProfileViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filterset_class = AgentProfileFilter
    search_fields = (
        "user__full_name",
        "user__email",
        "bio",
        "specialization",
        "service_areas",
        "agency__name",
    )
    ordering_fields = ("rating", "total_reviews", "experience_years", "created_at")
    ordering = ("-is_featured", "-rating")

    def get_queryset(self):
        return (
            AgentProfile.objects.select_related("user", "agency")
            .filter(verification_status=AgentProfile.VerificationStatus.VERIFIED)
            .order_by("-is_featured", "-rating")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AgentDetailSerializer
        return AgentListSerializer

    @decorators.action(detail=False, methods=["get"], url_path="featured")
    def featured(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(is_featured=True))
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = AgentListSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = AgentListSerializer(queryset, many=True, context={"request": request})
        return response.Response(serializer.data)
