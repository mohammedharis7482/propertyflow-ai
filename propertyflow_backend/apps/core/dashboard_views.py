from django.utils import timezone
from rest_framework import permissions, response, views
from rest_framework.exceptions import NotFound, PermissionDenied

from apps.appointments.models import Appointment
from apps.appointments.serializers import AppointmentListSerializer
from apps.inquiries.models import Inquiry
from apps.inquiries.serializers import InquiryListSerializer
from apps.properties.models import Property
from apps.properties.serializers import PropertyListSerializer
from apps.saved_properties.models import SavedProperty
from apps.saved_properties.serializers import SavedPropertySerializer


class UserDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        saved_queryset = (
            SavedProperty.objects.select_related("property__agent__user", "property__agent__agency")
            .prefetch_related("property__images")
            .filter(user=request.user)
            .order_by("-created_at")
        )
        inquiries = Inquiry.objects.filter(user=request.user)
        appointments = Appointment.objects.filter(user=request.user)

        saved_cities = list(saved_queryset.values_list("property__city", flat=True).distinct())
        recommendation_queryset = (
            Property.objects.select_related("agent__user", "agent__agency")
            .prefetch_related("images")
            .filter(status=Property.Status.PUBLISHED, approval_status=Property.ApprovalStatus.APPROVED)
        )
        if saved_cities:
            recommendation_queryset = recommendation_queryset.filter(city__in=saved_cities)
        recommendation_queryset = recommendation_queryset.order_by("-is_featured", "-views_count")[:6]

        return response.Response(
            {
                "stats": {
                    "saved_properties": saved_queryset.count(),
                    "inquiries": inquiries.count(),
                    "appointments": appointments.count(),
                    "notifications_unread": request.user.notifications.filter(is_read=False).count(),
                },
                "recent_saved_properties": SavedPropertySerializer(
                    saved_queryset[:4],
                    many=True,
                    context={"request": request},
                ).data,
                "recent_inquiries": InquiryListSerializer(
                    inquiries.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency").prefetch_related("property__images")[:5],
                    many=True,
                    context={"request": request},
                ).data,
                "upcoming_appointments": AppointmentListSerializer(
                    appointments.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency").prefetch_related("property__images").filter(appointment_date__gte=timezone.localdate())[:5],
                    many=True,
                    context={"request": request},
                ).data,
                "recommendation_preview": PropertyListSerializer(
                    recommendation_queryset,
                    many=True,
                    context={"request": request},
                ).data,
            }
        )


class AgentDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != "AGENT":
            raise PermissionDenied("Agent access is required.")
        if not hasattr(request.user, "agent_profile"):
            raise NotFound("Agent profile not found for this account.")

        agent = request.user.agent_profile
        properties = Property.objects.filter(agent=agent)
        inquiries = Inquiry.objects.filter(agent=agent)
        appointments = Appointment.objects.filter(agent=agent)

        return response.Response(
            {
                "stats": {
                    "total_listings": properties.count(),
                    "published_listings": properties.filter(status=Property.Status.PUBLISHED).count(),
                    "total_inquiries": inquiries.count(),
                    "new_inquiries": inquiries.filter(status=Inquiry.Status.NEW).count(),
                    "appointments": appointments.count(),
                    "pending_appointments": appointments.filter(status=Appointment.Status.PENDING).count(),
                },
                "recent_inquiries": InquiryListSerializer(
                    inquiries.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency").prefetch_related("property__images")[:6],
                    many=True,
                    context={"request": request},
                ).data,
                "upcoming_appointments": AppointmentListSerializer(
                    appointments.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency").prefetch_related("property__images").filter(appointment_date__gte=timezone.localdate())[:6],
                    many=True,
                    context={"request": request},
                ).data,
                "top_properties": PropertyListSerializer(
                    properties.select_related("agent__user", "agent__agency").prefetch_related("images").order_by("-views_count")[:6],
                    many=True,
                    context={"request": request},
                ).data,
            }
        )
