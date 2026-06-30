from django.contrib import admin

from apps.audit_logs.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "actor", "target_type", "target_id", "ip_address", "created_at")
    search_fields = ("action", "description", "actor__email", "target_type", "target_id")
    list_filter = ("action", "target_type", "created_at")
    readonly_fields = ("created_at", "updated_at")
