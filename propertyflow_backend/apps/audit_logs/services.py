from apps.audit_logs.models import AuditLog


def get_client_ip(request):
    if not request:
        return None
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def create_audit_log(
    actor,
    action,
    target_type,
    target_id,
    description,
    metadata=None,
    request=None,
):
    return AuditLog.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        target_type=target_type,
        target_id=str(target_id or ""),
        description=description,
        metadata=metadata or {},
        ip_address=get_client_ip(request),
    )
