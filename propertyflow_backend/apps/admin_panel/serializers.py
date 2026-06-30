from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.agencies.models import Agency
from apps.agents.models import AgentProfile
from apps.appointments.models import Appointment
from apps.audit_logs.models import AuditLog
from apps.inquiries.models import Inquiry
from apps.notifications.models import Notification
from apps.properties.models import Property


User = get_user_model()


class AdminActorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    full_name = serializers.CharField()
    role = serializers.CharField()


class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "is_active",
            "is_verified",
            "date_joined",
            "created_at",
        )


class AdminUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "profile_image",
            "is_active",
            "is_staff",
            "is_verified",
            "date_joined",
            "created_at",
            "updated_at",
        )


class AdminUserStatusUpdateSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


class AdminUserRoleUpdateSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.Role.choices)


class AdminAgencyListSerializer(serializers.ModelSerializer):
    agents_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Agency
        fields = (
            "id",
            "name",
            "slug",
            "email",
            "phone",
            "city",
            "country",
            "is_verified",
            "agents_count",
            "created_at",
        )


class AdminAgencyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = "__all__"


class AdminAgencyVerificationSerializer(serializers.Serializer):
    is_verified = serializers.BooleanField()


class AdminAgentListSerializer(serializers.ModelSerializer):
    user = AdminUserListSerializer(read_only=True)
    agency_name = serializers.CharField(source="agency.name", read_only=True)

    class Meta:
        model = AgentProfile
        fields = (
            "id",
            "user",
            "agency",
            "agency_name",
            "slug",
            "license_number",
            "service_areas",
            "specialization",
            "rating",
            "total_reviews",
            "verification_status",
            "is_featured",
            "created_at",
        )


class AdminAgentDetailSerializer(serializers.ModelSerializer):
    user = AdminUserDetailSerializer(read_only=True)
    agency = AdminAgencyListSerializer(read_only=True)

    class Meta:
        model = AgentProfile
        fields = "__all__"


class AdminAgentVerificationSerializer(serializers.Serializer):
    verification_status = serializers.ChoiceField(choices=AgentProfile.VerificationStatus.choices)


class AdminAgentFeatureSerializer(serializers.Serializer):
    is_featured = serializers.BooleanField()


class AdminPropertyListSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source="agent.user.full_name", read_only=True)
    agent_email = serializers.EmailField(source="agent.user.email", read_only=True)

    class Meta:
        model = Property
        fields = (
            "id",
            "title",
            "slug",
            "agent",
            "agent_name",
            "agent_email",
            "city",
            "country",
            "area",
            "price",
            "currency",
            "property_type",
            "purpose",
            "status",
            "approval_status",
            "is_featured",
            "views_count",
            "created_at",
        )


class AdminPropertyDetailSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source="agent.user.full_name", read_only=True)
    agent_email = serializers.EmailField(source="agent.user.email", read_only=True)

    class Meta:
        model = Property
        fields = "__all__"


class AdminPropertyApprovalSerializer(serializers.Serializer):
    approval_status = serializers.ChoiceField(choices=Property.ApprovalStatus.choices)


class AdminPropertyFeatureSerializer(serializers.Serializer):
    is_featured = serializers.BooleanField()


class AdminPropertyStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Property.Status.choices)


class AdminInquiryListSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)
    agent_name = serializers.CharField(source="agent.user.full_name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Inquiry
        fields = (
            "id",
            "property",
            "property_title",
            "user",
            "user_email",
            "agent",
            "agent_name",
            "full_name",
            "email",
            "phone",
            "status",
            "priority",
            "source",
            "message",
            "created_at",
        )


class AdminInquiryDetailSerializer(AdminInquiryListSerializer):
    class Meta(AdminInquiryListSerializer.Meta):
        fields = AdminInquiryListSerializer.Meta.fields + ("updated_at",)


class AdminInquiryStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Inquiry.Status.choices)


class AdminInquiryPrioritySerializer(serializers.Serializer):
    priority = serializers.ChoiceField(choices=Inquiry.Priority.choices)


class AdminAppointmentListSerializer(serializers.ModelSerializer):
    property_title = serializers.CharField(source="property.title", read_only=True)
    agent_name = serializers.CharField(source="agent.user.full_name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = Appointment
        fields = (
            "id",
            "property",
            "property_title",
            "user",
            "user_email",
            "user_full_name",
            "agent",
            "agent_name",
            "appointment_date",
            "appointment_time",
            "status",
            "visit_type",
            "notes",
            "created_at",
        )


class AdminAppointmentDetailSerializer(AdminAppointmentListSerializer):
    class Meta(AdminAppointmentListSerializer.Meta):
        fields = AdminAppointmentListSerializer.Meta.fields + ("updated_at",)


class AdminAppointmentStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Appointment.Status.choices)


class AdminNotificationSendSerializer(serializers.Serializer):
    class TargetType:
        ALL_USERS = "ALL_USERS"
        ALL_AGENTS = "ALL_AGENTS"
        SPECIFIC_USER = "SPECIFIC_USER"

    target_type = serializers.ChoiceField(
        choices=(
            (TargetType.ALL_USERS, "All Users"),
            (TargetType.ALL_AGENTS, "All Agents"),
            (TargetType.SPECIFIC_USER, "Specific User"),
        )
    )
    user_id = serializers.IntegerField(required=False)
    title = serializers.CharField(max_length=255)
    message = serializers.CharField()
    notification_type = serializers.ChoiceField(choices=Notification.NotificationType.choices)

    def validate(self, attrs):
        if attrs["target_type"] == self.TargetType.SPECIFIC_USER and not attrs.get("user_id"):
            raise serializers.ValidationError("user_id is required for SPECIFIC_USER notifications.")
        return attrs


class AdminNotificationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Notification
        fields = ("id", "user", "user_email", "title", "message", "notification_type", "is_read", "created_at")


class AuditLogSerializer(serializers.ModelSerializer):
    actor = AdminActorSerializer(read_only=True)

    class Meta:
        model = AuditLog
        fields = (
            "id",
            "actor",
            "action",
            "target_type",
            "target_id",
            "description",
            "metadata",
            "ip_address",
            "created_at",
        )
