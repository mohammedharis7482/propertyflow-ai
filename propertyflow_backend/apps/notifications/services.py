from apps.notifications.models import Notification


def create_notification(user, title, message, notification_type="SYSTEM"):
    if not user:
        return None
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
    )
