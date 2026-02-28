from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.HairstyleCategoryViewSet)
router.register(r'hairstyles', views.HairstyleViewSet)
router.register(r'salons', views.SalonViewSet)
router.register(r'appointments', views.AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.profile_view, name='profile'),
    path('', include(router.urls)),
]
