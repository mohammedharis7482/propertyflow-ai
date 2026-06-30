from rest_framework import permissions, response, status, views
from rest_framework.exceptions import NotFound, PermissionDenied

from apps.appointments.models import Appointment
from apps.appointments.serializers import (
    AppointmentCreateSerializer,
    AppointmentListSerializer,
    AppointmentStatusUpdateSerializer,
)
from apps.notifications.services import create_notification


class AppointmentCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AppointmentCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()

        create_notification(
            user=appointment.agent.user,
            title="New viewing request",
            message=f"{request.user.full_name} requested a viewing for {appointment.property.title}.",
            notification_type="APPOINTMENT",
        )

        return response.Response(
            {
                "message": "Appointment request created successfully",
                "appointment": {
                    "id": appointment.id,
                    "status": appointment.status,
                    "appointment_date": appointment.appointment_date,
                    "appointment_time": appointment.appointment_time,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class MyAppointmentsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = (
            Appointment.objects.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency")
            .prefetch_related("property__images")
            .filter(user=request.user)
        )
        serializer = AppointmentListSerializer(queryset, many=True, context={"request": request})
        return response.Response(serializer.data)


class AgentAppointmentsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not hasattr(request.user, "agent_profile"):
            raise NotFound("Agent profile not found.")
        queryset = (
            Appointment.objects.select_related("user", "property__agent__user", "property__agent__agency", "agent__user", "agent__agency")
            .prefetch_related("property__images")
            .filter(agent=request.user.agent_profile)
        )
        serializer = AppointmentListSerializer(queryset, many=True, context={"request": request})
        return response.Response(serializer.data)


class AppointmentStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    allowed_statuses = {
        Appointment.Status.CONFIRMED,
        Appointment.Status.RESCHEDULED,
        Appointment.Status.COMPLETED,
        Appointment.Status.NO_SHOW,
    }

    def patch(self, request, pk):
        appointment = Appointment.objects.select_related("agent__user", "user", "property").filter(pk=pk).first()
        if not appointment:
            raise NotFound("Appointment not found.")
        if not hasattr(request.user, "agent_profile") or appointment.agent_id != request.user.agent_profile.id:
            raise PermissionDenied("Only the assigned agent can update this appointment.")

        serializer = AppointmentStatusUpdateSerializer(appointment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data["status"] not in self.allowed_statuses:
            raise PermissionDenied("This status is not allowed for agent updates.")
        serializer.save()

        create_notification(
            user=appointment.user,
            title="Appointment status updated",
            message=f"Your appointment for {appointment.property.title} is now {appointment.status}.",
            notification_type="APPOINTMENT",
        )
        return response.Response(AppointmentListSerializer(appointment, context={"request": request}).data)


class AppointmentCancelView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        appointment = Appointment.objects.select_related("agent__user", "user", "property").filter(pk=pk).first()
        if not appointment:
            raise NotFound("Appointment not found.")
        if appointment.user_id != request.user.id:
            raise PermissionDenied("Only the appointment owner can cancel it.")

        appointment.status = Appointment.Status.CANCELLED
        appointment.save(update_fields=["status", "updated_at"])
        create_notification(
            user=appointment.agent.user,
            title="Appointment cancelled",
            message=f"{request.user.full_name} cancelled the viewing for {appointment.property.title}.",
            notification_type="APPOINTMENT",
        )
        return response.Response(AppointmentListSerializer(appointment, context={"request": request}).data)
