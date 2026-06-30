from django.contrib import admin

from apps.agencies.models import Agency


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "country", "is_verified", "created_at")
    search_fields = ("name", "city", "country")
    list_filter = ("is_verified", "country", "city")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")
