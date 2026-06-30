from rest_framework import serializers

from apps.agencies.serializers import AgencySerializer
from apps.agents.models import AgentProfile


class AgentListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name")
    email = serializers.EmailField(source="user.email")
    agency = serializers.CharField(source="agency.name", allow_null=True)
    city = serializers.CharField(source="agency.city", allow_null=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = AgentProfile
        fields = (
            "id",
            "slug",
            "full_name",
            "email",
            "profile_image",
            "agency",
            "city",
            "service_areas",
            "specialization",
            "rating",
            "total_reviews",
            "experience_years",
            "is_featured",
            "verification_status",
        )

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return obj.profile_image_url or None


class AgentDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name")
    email = serializers.EmailField(source="user.email")
    phone = serializers.CharField(source="user.phone")
    agency = AgencySerializer(read_only=True)
    profile_image = serializers.SerializerMethodField()
    listed_properties_count = serializers.SerializerMethodField()
    featured_properties = serializers.SerializerMethodField()

    class Meta:
        model = AgentProfile
        fields = (
            "id",
            "slug",
            "full_name",
            "email",
            "phone",
            "profile_image",
            "agency",
            "license_number",
            "bio",
            "experience_years",
            "languages",
            "service_areas",
            "specialization",
            "rating",
            "total_reviews",
            "total_sales",
            "verification_status",
            "is_featured",
            "listed_properties_count",
            "featured_properties",
            "created_at",
            "updated_at",
        )

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return obj.profile_image_url or None

    def get_listed_properties_count(self, obj):
        return obj.properties.filter(
            status="PUBLISHED",
            approval_status="APPROVED",
        ).count()

    def get_featured_properties(self, obj):
        from apps.properties.serializers import PropertyListSerializer

        properties = obj.properties.filter(
            status="PUBLISHED",
            approval_status="APPROVED",
            is_featured=True,
        ).order_by("-created_at")[:4]

        return PropertyListSerializer(
            properties,
            many=True,
            context=self.context,
        ).data
