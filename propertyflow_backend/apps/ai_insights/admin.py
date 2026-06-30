from django.contrib import admin

from apps.ai_insights.models import AIInsight


@admin.register(AIInsight)
class AIInsightAdmin(admin.ModelAdmin):
    list_display = ("title", "insight_type", "score", "user", "property", "created_at")
    list_filter = ("insight_type", "score", "created_at")
    search_fields = (
        "title",
        "summary",
        "user__email",
        "user__full_name",
        "property__title",
        "inquiry__email",
    )
    readonly_fields = ("created_at", "updated_at")

