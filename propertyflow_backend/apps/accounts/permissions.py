from rest_framework.permissions import BasePermission

from apps.accounts.models import User


class IsVerifiedAgent(BasePermission):
    message = "Only verified agents can perform this action."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == User.Role.AGENT
            and request.user.is_verified
        )
