from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAuthorOrAdminOrModerator(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        user = request.user

        if user.is_staff:
            return True
        
        if user.groups.filter(name="moderators").exists():
            return True

        return obj.author == user