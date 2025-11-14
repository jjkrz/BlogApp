from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from .serializers import UserSerializer, AdminUserSerializer
from .permissions import IsSelfOrAdmin

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSelfOrAdmin]

    def get_queryset(self):
        user = self.request.user
        
        if user.is_staff:
            return User.objects.all()
        
        return User.objects.filter(id=user.id)
    
    def get_serializer_class(self):
        # Admin widzi i może edytować wszystko
        if self.request.user.is_staff:
            return AdminUserSerializer
        
        # Zwykły użytkownik - ograniczony dostęp
        return UserSerializer