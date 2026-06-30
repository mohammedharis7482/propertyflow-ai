from rest_framework import permissions, response, views
from rest_framework.exceptions import NotFound

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer


class NotificationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = Notification.objects.filter(user=request.user).order_by("-created_at")
        serializer = NotificationSerializer(queryset, many=True)
        return response.Response(
            {
                "count": queryset.count(),
                "unread_count": queryset.filter(is_read=False).count(),
                "results": serializer.data,
            }
        )


class NotificationReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = Notification.objects.filter(pk=pk, user=request.user).first()
        if not notification:
            raise NotFound("Notification not found.")
        notification.is_read = True
        notification.save(update_fields=["is_read", "updated_at"])
        return response.Response(NotificationSerializer(notification).data)


class NotificationMarkAllReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return response.Response({"message": "All notifications marked as read"})
