from django.contrib import admin
from .models import UserProfile, Hairstyle, HairstyleCategory, Salon, Appointment

@admin.register(HairstyleCategory)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Hairstyle)
class HairstyleAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'duration_minutes', 'is_active']
    list_filter = ['category', 'is_active']

@admin.register(Salon)
class SalonAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'rating', 'is_active']
    filter_horizontal = ['services']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'hairstyle', 'salon', 'appointment_date', 'status']
    list_filter = ['status']

admin.site.register(UserProfile)
