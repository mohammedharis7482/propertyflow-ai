from django.contrib import admin

from apps.inquiries.models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("property", "user", "agent", "status", "priority", "source", "created_at")
    search_fields = (
        "user__email",
        "full_name",
        "email",
        "property__title",
        "agent__user__full_name",
    )
    list_filter = ("status", "priority", "source", "created_at")
    readonly_fields = ("created_at", "updated_at")
