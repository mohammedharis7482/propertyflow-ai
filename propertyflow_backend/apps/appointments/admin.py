from django.contrib import admin

from apps.appointments.models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("property", "user", "agent", "appointment_date", "appointment_time", "status", "visit_type")
    search_fields = ("user__email", "property__title", "agent__user__full_name")
    list_filter = ("status", "visit_type", "appointment_date")
    readonly_fields = ("created_at", "updated_at")
