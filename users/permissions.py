from rest_framework.permissions import BasePermission

class IsAuthorOrModeratorOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_staff:
            return True
        
        if user.groups.filter(name="moderators").exists():
            return True

        return obj.author == user
    

class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        
        return obj == request.user