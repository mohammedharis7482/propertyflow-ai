from rest_framework import serializers

from apps.agencies.serializers import AgencySerializer
from apps.properties.models import Property, PropertyFeature, PropertyImage


class PropertyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyFeature
        fields = ("id", "name", "slug", "icon")


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ("id", "url", "image_url", "alt_text", "is_primary", "order")

    def get_url(self, obj):
        request = self.context.get("request")

        if obj.image:
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url

        return obj.image_url


class AgentBasicSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    slug = serializers.CharField()
    full_name = serializers.CharField(source="user.full_name")
    profile_image = serializers.SerializerMethodField()
    rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    agency = serializers.CharField(source="agency.name", allow_null=True)

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return obj.profile_image_url or None


class PropertyListSerializer(serializers.ModelSerializer):
    location_display = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    agent = AgentBasicSerializer(read_only=True)

    class Meta:
        model = Property
        fields = (
            "id",
            "slug",
            "title",
            "location_display",
            "price",
            "currency",
            "city",
            "area",
            "bedrooms",
            "bathrooms",
            "size_sqft",
            "property_type",
            "purpose",
            "is_featured",
            "primary_image",
            "agent",
        )

    def get_location_display(self, obj):
        return ", ".join(part for part in [obj.area, obj.city, obj.country] if part)

    def get_primary_image(self, obj):
        image = next(
            (item for item in obj.images.all() if item.is_primary),
            obj.images.all()[0] if obj.images.all() else None,
        )

        if not image:
            return None

        return PropertyImageSerializer(image, context=self.context).data["url"]


class PropertyDetailSerializer(serializers.ModelSerializer):
    location_display = serializers.SerializerMethodField()
    images = PropertyImageSerializer(many=True, read_only=True)
    features = PropertyFeatureSerializer(many=True, read_only=True)
    agent = serializers.SerializerMethodField()
    agency = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            "id",
            "slug",
            "title",
            "description",
            "location_display",
            "property_type",
            "purpose",
            "price",
            "currency",
            "country",
            "city",
            "area",
            "address",
            "latitude",
            "longitude",
            "bedrooms",
            "bathrooms",
            "parking_spaces",
            "size_sqft",
            "furnishing_status",
            "status",
            "approval_status",
            "features",
            "images",
            "agent",
            "agency",
            "is_featured",
            "views_count",
            "created_at",
            "updated_at",
        )

    def get_location_display(self, obj):
        return ", ".join(part for part in [obj.area, obj.city, obj.country] if part)

    def get_agent(self, obj):
        from apps.agents.serializers import AgentListSerializer

        return AgentListSerializer(obj.agent, context=self.context).data

    def get_agency(self, obj):
        if not obj.agent.agency:
            return None
        return AgencySerializer(obj.agent.agency, context=self.context).data
