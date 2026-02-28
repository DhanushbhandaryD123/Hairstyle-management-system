from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Hairstyle, HairstyleCategory, Salon, Appointment
from .serializers import (
    RegisterSerializer, UserSerializer, HairstyleSerializer,
    HairstyleCategorySerializer, SalonSerializer, AppointmentSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class HairstyleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HairstyleCategory.objects.all()
    serializer_class = HairstyleCategorySerializer
    permission_classes = [AllowAny]


class HairstyleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hairstyle.objects.filter(is_active=True)
    serializer_class = HairstyleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__id=category)
        return qs


class SalonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Salon.objects.filter(is_active=True)
    serializer_class = SalonSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = super().get_queryset()
        hairstyle_id = self.request.query_params.get('hairstyle')
        if hairstyle_id:
            qs = qs.filter(services__id=hairstyle_id)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
