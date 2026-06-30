from rest_framework.permissions import BasePermission


class IsAppointmentOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.user_id == request.user.id


class IsAppointmentAgent(BasePermission):
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "agent_profile")
            and obj.agent_id == request.user.agent_profile.id
        )
