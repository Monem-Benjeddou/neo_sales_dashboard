from rest_framework import permissions

class IsAuthenticatedUser(permissions.BasePermission):
    """
    Custom permission to only allow authenticated users to access objects.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

class IsSuperUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow superusers to edit data.
    Regular authenticated users can only read data.
    """
    def has_permission(self, request, view):
        # Allow read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        # Write permissions are only allowed to superusers
        return request.user and request.user.is_authenticated and request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        # Allow read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        # Write permissions are only allowed to superusers
        return request.user and request.user.is_authenticated and request.user.is_superuser