from rest_framework import decorators, permissions, response, status, viewsets

from apps.properties.filters import PropertyFilter
from apps.properties.models import Property, PropertyFeature
from apps.properties.serializers import (
    PropertyDetailSerializer,
    PropertyFeatureSerializer,
    PropertyListSerializer,
)
from apps.saved_properties.models import SavedProperty


class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    filterset_class = PropertyFilter
    search_fields = ("title", "description", "city", "area", "address")
    ordering_fields = ("price", "created_at", "views_count")
    ordering = ("-is_featured", "-created_at")

    def get_queryset(self):
        return (
            Property.objects.select_related("agent__user", "agent__agency")
            .prefetch_related("features", "images")
            .filter(
                status=Property.Status.PUBLISHED,
                approval_status=Property.ApprovalStatus.APPROVED,
            )
            .order_by("-is_featured", "-created_at")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyListSerializer

    @decorators.action(detail=False, methods=["get"], url_path="featured")
    def featured(self, request):
        queryset = self.filter_queryset(self.get_queryset().filter(is_featured=True))
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = PropertyListSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = PropertyListSerializer(queryset, many=True, context={"request": request})
        return response.Response(serializer.data)

    @decorators.action(detail=False, methods=["get"], url_path="features")
    def features(self, request):
        queryset = PropertyFeature.objects.all().order_by("name")
        serializer = PropertyFeatureSerializer(queryset, many=True)
        return response.Response(serializer.data)

    @decorators.action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="save",
    )
    def save_property(self, request, slug=None):
        property_obj = self.get_object()
        _, created = SavedProperty.objects.get_or_create(
            user=request.user,
            property=property_obj,
        )
        message = "Property saved successfully" if created else "Property already saved"
        return response.Response({"message": message}, status=status.HTTP_201_CREATED)

    @decorators.action(
        detail=True,
        methods=["delete"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="unsave",
    )
    def unsave_property(self, request, slug=None):
        property_obj = self.get_object()
        SavedProperty.objects.filter(user=request.user, property=property_obj).delete()
        return response.Response({"message": "Property removed from saved list"})
