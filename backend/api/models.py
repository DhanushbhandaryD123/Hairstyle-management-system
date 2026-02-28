from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class HairstyleCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Hairstyle(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(HairstyleCategory, on_delete=models.CASCADE, related_name='hairstyles')
    description = models.TextField()
    duration_minutes = models.IntegerField(default=60)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Salon(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    rating = models.FloatField(default=4.0)
    opening_time = models.TimeField(default='09:00')
    closing_time = models.TimeField(default='20:00')
    image_url = models.URLField(blank=True, default='')
    services = models.ManyToManyField(Hairstyle, blank=True, related_name='salons')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='appointments')
    hairstyle = models.ForeignKey(Hairstyle, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-appointment_date', '-appointment_time']

    def __str__(self):
        return f"{self.user.username} - {self.hairstyle.name} at {self.salon.name}"
