from rest_framework import serializers

from apps.inquiries.models import Inquiry
from apps.properties.models import Property
from apps.properties.serializers import AgentBasicSerializer, PropertyListSerializer


class InquiryCreateSerializer(serializers.ModelSerializer):
    property_slug = serializers.SlugField(write_only=True)

    class Meta:
        model = Inquiry
        fields = ("property_slug", "full_name", "email", "phone", "message", "source")

    def validate_property_slug(self, value):
        try:
            return Property.objects.select_related("agent").get(
                slug=value,
                status=Property.Status.PUBLISHED,
                approval_status=Property.ApprovalStatus.APPROVED,
            )
        except Property.DoesNotExist as exc:
            raise serializers.ValidationError("Property is not available for inquiries.") from exc

    def create(self, validated_data):
        property_obj = validated_data.pop("property_slug")
        return Inquiry.objects.create(
            user=self.context["request"].user,
            property=property_obj,
            agent=property_obj.agent,
            **validated_data,
        )


class InquiryListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    agent = AgentBasicSerializer(read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "property",
            "user_email",
            "user_full_name",
            "full_name",
            "email",
            "phone",
            "agent",
            "status",
            "priority",
            "source",
            "message",
            "created_at",
            "updated_at",
        )


class InquiryStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ("status",)
