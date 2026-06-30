from rest_framework import permissions, viewsets

from apps.agencies.models import Agency
from apps.agencies.serializers import AgencySerializer


class AgencyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Agency.objects.filter(is_verified=True).order_by("name")
    serializer_class = AgencySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    search_fields = ("name", "city", "country")
    filterset_fields = ("city", "country", "is_verified")
    ordering_fields = ("name", "created_at")
    ordering = ("name",)
