from django.utils import timezone
from rest_framework import serializers

from apps.appointments.models import Appointment
from apps.inquiries.models import Inquiry
from apps.properties.models import Property
from apps.properties.serializers import AgentBasicSerializer, PropertyListSerializer


class AppointmentCreateSerializer(serializers.ModelSerializer):
    property_slug = serializers.SlugField(write_only=True)
    inquiry_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Appointment
        fields = (
            "property_slug",
            "inquiry_id",
            "appointment_date",
            "appointment_time",
            "visit_type",
            "notes",
        )

    def validate_appointment_date(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError("Appointment date cannot be in the past.")
        return value

    def validate_property_slug(self, value):
        try:
            return Property.objects.select_related("agent").get(
                slug=value,
                status=Property.Status.PUBLISHED,
                approval_status=Property.ApprovalStatus.APPROVED,
            )
        except Property.DoesNotExist as exc:
            raise serializers.ValidationError("Property is not available for appointments.") from exc

    def create(self, validated_data):
        property_obj = validated_data.pop("property_slug")
        inquiry_id = validated_data.pop("inquiry_id", None)
        inquiry = None
        if inquiry_id:
            inquiry = Inquiry.objects.filter(id=inquiry_id, user=self.context["request"].user).first()
        return Appointment.objects.create(
            user=self.context["request"].user,
            property=property_obj,
            agent=property_obj.agent,
            inquiry=inquiry,
            **validated_data,
        )


class AppointmentListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)
    agent = AgentBasicSerializer(read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Appointment
        fields = (
            "id",
            "property",
            "agent",
            "user_email",
            "user_full_name",
            "appointment_date",
            "appointment_time",
            "status",
            "visit_type",
            "notes",
            "created_at",
            "updated_at",
        )


class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ("status",)
