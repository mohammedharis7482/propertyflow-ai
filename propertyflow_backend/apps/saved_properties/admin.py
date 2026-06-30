from django.contrib import admin

from apps.saved_properties.models import SavedProperty


@admin.register(SavedProperty)
class SavedPropertyAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "created_at")
    search_fields = ("user__email", "property__title")
    readonly_fields = ("created_at", "updated_at")
