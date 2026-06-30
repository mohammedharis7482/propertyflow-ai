from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    message = "Admin access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsAgent(BasePermission):
    message = "Agent access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "AGENT"
        )


class IsUser(BasePermission):
    message = "User access is required."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "USER"
        )


class IsOwnerOrAdmin(BasePermission):
    message = "You must own this resource or be an admin."

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_authenticated and request.user.role == "ADMIN":
            return True

        owner = getattr(obj, "owner", None) or getattr(obj, "user", None)
        return request.user.is_authenticated and owner == request.user
