from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, response, status, views
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError

from apps.admin_panel.permissions import IsPlatformAdmin
from apps.admin_panel.serializers import (
    AdminAgencyDetailSerializer,
    AdminAgencyListSerializer,
    AdminAgencyVerificationSerializer,
    AdminAgentDetailSerializer,
    AdminAgentFeatureSerializer,
    AdminAgentListSerializer,
    AdminAgentVerificationSerializer,
    AdminAppointmentDetailSerializer,
    AdminAppointmentListSerializer,
    AdminAppointmentStatusSerializer,
    AdminInquiryDetailSerializer,
    AdminInquiryListSerializer,
    AdminInquiryPrioritySerializer,
    AdminInquiryStatusSerializer,
    AdminNotificationSendSerializer,
    AdminNotificationSerializer,
    AdminPropertyApprovalSerializer,
    AdminPropertyDetailSerializer,
    AdminPropertyFeatureSerializer,
    AdminPropertyListSerializer,
    AdminPropertyStatusSerializer,
    AdminUserDetailSerializer,
    AdminUserListSerializer,
    AdminUserRoleUpdateSerializer,
    AdminUserStatusUpdateSerializer,
    AuditLogSerializer,
)
from apps.agencies.models import Agency
from apps.agents.models import AgentProfile
from apps.appointments.models import Appointment
from apps.audit_logs.models import AuditLog
from apps.audit_logs.services import create_audit_log
from apps.inquiries.models import Inquiry
from apps.notifications.models import Notification
from apps.notifications.services import create_notification
from apps.properties.models import Property


User = get_user_model()


class AdminListMixin:
    permission_classes = [IsPlatformAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]


class AdminDashboardView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        pending_properties = Property.objects.filter(approval_status=Property.ApprovalStatus.PENDING)
        pending_agents = AgentProfile.objects.filter(verification_status=AgentProfile.VerificationStatus.PENDING)
        recent_inquiries = Inquiry.objects.select_related("user", "property", "agent__user").order_by("-created_at")[:5]
        upcoming_appointments = Appointment.objects.select_related("user", "property", "agent__user").filter(
            appointment_date__gte=timezone.localdate()
        )[:5]

        return response.Response(
            {
                "stats": {
                    "total_users": User.objects.count(),
                    "total_agents": AgentProfile.objects.count(),
                    "total_agencies": Agency.objects.count(),
                    "total_properties": Property.objects.count(),
                    "published_properties": Property.objects.filter(status=Property.Status.PUBLISHED).count(),
                    "pending_properties": pending_properties.count(),
                    "approved_properties": Property.objects.filter(approval_status=Property.ApprovalStatus.APPROVED).count(),
                    "rejected_properties": Property.objects.filter(approval_status=Property.ApprovalStatus.REJECTED).count(),
                    "total_inquiries": Inquiry.objects.count(),
                    "new_inquiries": Inquiry.objects.filter(status=Inquiry.Status.NEW).count(),
                    "total_appointments": Appointment.objects.count(),
                    "pending_appointments": Appointment.objects.filter(status=Appointment.Status.PENDING).count(),
                    "unread_notifications": Notification.objects.filter(is_read=False).count(),
                },
                "recent_users": AdminUserListSerializer(User.objects.order_by("-created_at")[:5], many=True).data,
                "pending_agents": AdminAgentListSerializer(pending_agents.select_related("user", "agency")[:5], many=True).data,
                "pending_properties": AdminPropertyListSerializer(pending_properties.select_related("agent__user")[:5], many=True).data,
                "recent_inquiries": AdminInquiryListSerializer(recent_inquiries, many=True).data,
                "upcoming_appointments": AdminAppointmentListSerializer(upcoming_appointments, many=True).data,
                "top_properties": AdminPropertyListSerializer(
                    Property.objects.select_related("agent__user").order_by("-views_count")[:5],
                    many=True,
                ).data,
            }
        )


class AdminUserListView(AdminListMixin, generics.ListAPIView):
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = AdminUserListSerializer
    filterset_fields = ("role", "is_active", "is_verified")
    search_fields = ("email", "full_name", "phone")
    ordering_fields = ("created_at", "email", "full_name")
    ordering = ("-created_at",)


class AdminUserDetailView(AdminListMixin, generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserDetailSerializer


class AdminUserStatusView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        user = generics.get_object_or_404(User, pk=pk)
        serializer = AdminUserStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if user.id == request.user.id and serializer.validated_data["is_active"] is False:
            raise ValidationError("You cannot deactivate your own admin account.")
        user.is_active = serializer.validated_data["is_active"]
        user.save(update_fields=["is_active", "updated_at"])
        create_audit_log(request.user, "USER_STATUS_UPDATED", "User", user.id, f"Updated status for {user.email}", serializer.validated_data, request)
        return response.Response({"message": "User status updated successfully"})


class AdminUserRoleView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        user = generics.get_object_or_404(User, pk=pk)
        serializer = AdminUserRoleUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if user.id == request.user.id and serializer.validated_data["role"] != User.Role.ADMIN:
            raise ValidationError("You cannot remove your own admin role.")
        user.role = serializer.validated_data["role"]
        user.save(update_fields=["role", "updated_at"])
        create_audit_log(request.user, "USER_ROLE_UPDATED", "User", user.id, f"Updated role for {user.email}", serializer.validated_data, request)
        return response.Response({"message": "User role updated successfully"})


class AdminAgentListView(AdminListMixin, generics.ListAPIView):
    queryset = AgentProfile.objects.select_related("user", "agency").all()
    serializer_class = AdminAgentListSerializer
    filterset_fields = ("verification_status", "is_featured", "agency")
    search_fields = ("user__full_name", "user__email", "license_number", "agency__name", "service_areas", "specialization")
    ordering_fields = ("created_at", "rating", "total_reviews", "experience_years")
    ordering = ("-created_at",)


class AdminAgentDetailView(AdminListMixin, generics.RetrieveAPIView):
    queryset = AgentProfile.objects.select_related("user", "agency").all()
    serializer_class = AdminAgentDetailSerializer


class AdminAgentVerificationView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        agent = generics.get_object_or_404(AgentProfile.objects.select_related("user"), pk=pk)
        serializer = AdminAgentVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        agent.verification_status = serializer.validated_data["verification_status"]
        agent.save(update_fields=["verification_status", "updated_at"])
        if agent.verification_status == AgentProfile.VerificationStatus.VERIFIED:
            agent.user.is_verified = True
            agent.user.save(update_fields=["is_verified", "updated_at"])
        create_notification(agent.user, "Agent verification updated", f"Your verification status is {agent.verification_status}.", "ACCOUNT")
        action = "AGENT_VERIFIED" if agent.verification_status == AgentProfile.VerificationStatus.VERIFIED else "AGENT_REJECTED"
        create_audit_log(request.user, action, "AgentProfile", agent.id, f"Updated agent verification for {agent.user.email}", serializer.validated_data, request)
        return response.Response({"message": "Agent verification updated successfully"})


class AdminAgentFeatureView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        agent = generics.get_object_or_404(AgentProfile.objects.select_related("user"), pk=pk)
        serializer = AdminAgentFeatureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        agent.is_featured = serializer.validated_data["is_featured"]
        agent.save(update_fields=["is_featured", "updated_at"])
        create_audit_log(request.user, "AGENT_FEATURED", "AgentProfile", agent.id, f"Updated featured state for {agent.user.email}", serializer.validated_data, request)
        return response.Response({"message": "Agent feature status updated successfully"})


class AdminAgencyListView(AdminListMixin, generics.ListAPIView):
    queryset = Agency.objects.annotate(agents_count=Count("agents")).all()
    serializer_class = AdminAgencyListSerializer
    filterset_fields = ("country", "city", "is_verified")
    search_fields = ("name", "email", "phone", "city", "country")
    ordering_fields = ("created_at", "name", "city", "country")
    ordering = ("name",)


class AdminAgencyDetailView(AdminListMixin, generics.RetrieveAPIView):
    queryset = Agency.objects.all()
    serializer_class = AdminAgencyDetailSerializer


class AdminAgencyVerificationView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        agency = generics.get_object_or_404(Agency, pk=pk)
        serializer = AdminAgencyVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        agency.is_verified = serializer.validated_data["is_verified"]
        agency.save(update_fields=["is_verified", "updated_at"])
        create_audit_log(request.user, "AGENCY_VERIFIED", "Agency", agency.id, f"Updated agency verification for {agency.name}", serializer.validated_data, request)
        return response.Response({"message": "Agency verification updated successfully"})


class AdminPropertyListView(AdminListMixin, generics.ListAPIView):
    queryset = Property.objects.select_related("agent__user", "agent__agency").all()
    serializer_class = AdminPropertyListSerializer
    filterset_fields = ("city", "country", "property_type", "purpose", "status", "approval_status", "is_featured", "agent")
    search_fields = ("title", "description", "city", "area", "address", "agent__user__full_name", "agent__user__email")
    ordering_fields = ("created_at", "price", "views_count")
    ordering = ("-created_at",)


class AdminPropertyDetailView(AdminListMixin, generics.RetrieveAPIView):
    queryset = Property.objects.select_related("agent__user", "agent__agency").prefetch_related("features", "images").all()
    serializer_class = AdminPropertyDetailSerializer


class AdminPropertyApprovalView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        prop = generics.get_object_or_404(Property.objects.select_related("agent__user"), pk=pk)
        serializer = AdminPropertyApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop.approval_status = serializer.validated_data["approval_status"]
        prop.save(update_fields=["approval_status", "updated_at"])
        create_notification(prop.agent.user, "Property approval updated", f"{prop.title} is now {prop.approval_status}.", "PROPERTY")
        action = "PROPERTY_APPROVED" if prop.approval_status == Property.ApprovalStatus.APPROVED else "PROPERTY_REJECTED"
        create_audit_log(request.user, action, "Property", prop.id, f"Updated approval for {prop.title}", serializer.validated_data, request)
        return response.Response({"message": "Property approval updated successfully"})


class AdminPropertyFeatureView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        prop = generics.get_object_or_404(Property, pk=pk)
        serializer = AdminPropertyFeatureSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop.is_featured = serializer.validated_data["is_featured"]
        prop.save(update_fields=["is_featured", "updated_at"])
        create_audit_log(request.user, "PROPERTY_FEATURED", "Property", prop.id, f"Updated feature state for {prop.title}", serializer.validated_data, request)
        return response.Response({"message": "Property feature status updated successfully"})


class AdminPropertyStatusView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        prop = generics.get_object_or_404(Property, pk=pk)
        serializer = AdminPropertyStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop.status = serializer.validated_data["status"]
        prop.save(update_fields=["status", "updated_at"])
        create_audit_log(request.user, "PROPERTY_STATUS_UPDATED", "Property", prop.id, f"Updated status for {prop.title}", serializer.validated_data, request)
        return response.Response({"message": "Property status updated successfully"})


class AdminInquiryListView(AdminListMixin, generics.ListAPIView):
    queryset = Inquiry.objects.select_related("user", "property", "agent__user").all()
    serializer_class = AdminInquiryListSerializer
    filterset_fields = ("status", "priority", "source", "agent", "property")
    search_fields = ("full_name", "email", "phone", "message", "property__title", "agent__user__full_name")
    ordering_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)


class AdminInquiryDetailView(AdminListMixin, generics.RetrieveAPIView):
    queryset = Inquiry.objects.select_related("user", "property", "agent__user").all()
    serializer_class = AdminInquiryDetailSerializer


class AdminInquiryStatusView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        inquiry = generics.get_object_or_404(Inquiry.objects.select_related("user", "agent__user", "property"), pk=pk)
        serializer = AdminInquiryStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry.status = serializer.validated_data["status"]
        inquiry.save(update_fields=["status", "updated_at"])
        create_notification(inquiry.user, "Inquiry status updated", f"Your inquiry for {inquiry.property.title} is now {inquiry.status}.", "INQUIRY")
        create_audit_log(request.user, "INQUIRY_STATUS_UPDATED", "Inquiry", inquiry.id, "Updated inquiry status", serializer.validated_data, request)
        return response.Response({"message": "Inquiry status updated successfully"})


class AdminInquiryPriorityView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        inquiry = generics.get_object_or_404(Inquiry, pk=pk)
        serializer = AdminInquiryPrioritySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry.priority = serializer.validated_data["priority"]
        inquiry.save(update_fields=["priority", "updated_at"])
        create_audit_log(request.user, "INQUIRY_PRIORITY_UPDATED", "Inquiry", inquiry.id, "Updated inquiry priority", serializer.validated_data, request)
        return response.Response({"message": "Inquiry priority updated successfully"})


class AdminAppointmentListView(AdminListMixin, generics.ListAPIView):
    queryset = Appointment.objects.select_related("user", "property", "agent__user").all()
    serializer_class = AdminAppointmentListSerializer
    filterset_fields = ("status", "visit_type", "agent", "property", "appointment_date")
    search_fields = ("user__full_name", "user__email", "property__title", "agent__user__full_name")
    ordering_fields = ("appointment_date", "created_at", "updated_at")
    ordering = ("appointment_date", "appointment_time")


class AdminAppointmentDetailView(AdminListMixin, generics.RetrieveAPIView):
    queryset = Appointment.objects.select_related("user", "property", "agent__user").all()
    serializer_class = AdminAppointmentDetailSerializer


class AdminAppointmentStatusView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def patch(self, request, pk):
        appointment = generics.get_object_or_404(Appointment.objects.select_related("user", "agent__user", "property"), pk=pk)
        serializer = AdminAppointmentStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment.status = serializer.validated_data["status"]
        appointment.save(update_fields=["status", "updated_at"])
        create_notification(appointment.user, "Appointment status updated", f"Your appointment for {appointment.property.title} is now {appointment.status}.", "APPOINTMENT")
        create_notification(appointment.agent.user, "Appointment status updated", f"Appointment for {appointment.property.title} is now {appointment.status}.", "APPOINTMENT")
        create_audit_log(request.user, "APPOINTMENT_STATUS_UPDATED", "Appointment", appointment.id, "Updated appointment status", serializer.validated_data, request)
        return response.Response({"message": "Appointment status updated successfully"})


class AdminNotificationListView(AdminListMixin, generics.ListAPIView):
    queryset = Notification.objects.select_related("user").all()
    serializer_class = AdminNotificationSerializer
    filterset_fields = ("notification_type", "is_read")
    search_fields = ("title", "message", "user__email")
    ordering_fields = ("created_at",)
    ordering = ("-created_at",)


class AdminNotificationSendView(views.APIView):
    permission_classes = [IsPlatformAdmin]

    def post(self, request):
        serializer = AdminNotificationSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if data["target_type"] == AdminNotificationSendSerializer.TargetType.ALL_USERS:
            users = User.objects.filter(role=User.Role.USER, is_active=True)
        elif data["target_type"] == AdminNotificationSendSerializer.TargetType.ALL_AGENTS:
            users = User.objects.filter(role=User.Role.AGENT, is_active=True)
        else:
            users = User.objects.filter(id=data["user_id"], is_active=True)
            if not users.exists():
                raise NotFound("Target user not found.")

        notifications = [
            Notification(
                user=user,
                title=data["title"],
                message=data["message"],
                notification_type=data["notification_type"],
            )
            for user in users
        ]
        Notification.objects.bulk_create(notifications)
        create_audit_log(
            request.user,
            "ADMIN_NOTIFICATION_SENT",
            "Notification",
            "",
            f"Sent admin notification to {len(notifications)} users.",
            data,
            request,
        )
        return response.Response(
            {"message": "Notification sent successfully", "notified_count": len(notifications)},
            status=status.HTTP_201_CREATED,
        )


class AuditLogListView(AdminListMixin, generics.ListAPIView):
    queryset = AuditLog.objects.select_related("actor").all()
    serializer_class = AuditLogSerializer
    filterset_fields = ("action", "actor", "target_type")
    search_fields = ("action", "description", "actor__email", "target_type")
    ordering_fields = ("created_at", "action")
    ordering = ("-created_at",)
