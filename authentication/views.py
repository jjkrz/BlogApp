from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Nazwa użytkownika i hasło są wymagane'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Użytkownik już istnieje'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(
            username=username,
            password=password
        )
        
        return Response(
            {'message': 'Użytkownik utworzony pomyślnie'},
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username i password są wymagane'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'message': 'Zalogowano pomyślnie',
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    'user': {
                        'id': user.id,
                        'username': user.username,
                    }
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Nieprawidłowa nazwa użytkownika lub hasło'},
                status=status.HTTP_401_UNAUTHORIZED
            )
