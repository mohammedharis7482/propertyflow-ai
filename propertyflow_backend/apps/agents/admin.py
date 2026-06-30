from django.contrib import admin

from apps.agents.models import AgentProfile


@admin.register(AgentProfile)
class AgentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "agency",
        "license_number",
        "verification_status",
        "is_featured",
        "rating",
        "created_at",
    )
    search_fields = (
        "user__email",
        "user__full_name",
        "license_number",
        "agency__name",
    )
    list_filter = ("verification_status", "is_featured", "agency")
    prepopulated_fields = {"slug": ("user",)}
    readonly_fields = ("created_at", "updated_at")
