from django.contrib import admin

from apps.properties.models import Property, PropertyFeature, PropertyImage


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1
    readonly_fields = ("created_at", "updated_at")


@admin.register(PropertyFeature)
class PropertyFeatureAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon")
    search_fields = ("name", "slug", "icon")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at")


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "agent",
        "city",
        "price",
        "purpose",
        "status",
        "approval_status",
        "is_featured",
        "created_at",
    )
    search_fields = ("title", "city", "area", "agent__user__full_name")
    list_filter = (
        "property_type",
        "purpose",
        "status",
        "approval_status",
        "is_featured",
        "city",
        "country",
    )
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("features",)
    inlines = [PropertyImageInline]


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ("property", "is_primary", "order", "created_at")
    search_fields = ("property__title", "alt_text", "image_url")
    list_filter = ("is_primary",)
    readonly_fields = ("created_at", "updated_at")
