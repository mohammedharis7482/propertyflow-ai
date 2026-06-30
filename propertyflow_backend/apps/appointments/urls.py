from django.urls import path

from apps.appointments.views import (
    AgentAppointmentsView,
    AppointmentCancelView,
    AppointmentCreateView,
    AppointmentStatusUpdateView,
    MyAppointmentsView,
)


urlpatterns = [
    path("appointments/", AppointmentCreateView.as_view(), name="appointment-create"),
    path("appointments/<int:pk>/status/", AppointmentStatusUpdateView.as_view(), name="appointment-status"),
    path("appointments/<int:pk>/cancel/", AppointmentCancelView.as_view(), name="appointment-cancel"),
    path("users/me/appointments/", MyAppointmentsView.as_view(), name="my-appointments"),
    path("agents/me/appointments/", AgentAppointmentsView.as_view(), name="agent-appointments"),
]
