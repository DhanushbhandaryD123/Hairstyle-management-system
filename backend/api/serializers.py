from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Hairstyle, HairstyleCategory, Salon, Appointment


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'location', 'latitude', 'longitude']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2', 'phone', 'location']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        location = validated_data.pop('location', '')
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, phone=phone, location=location)
        return user


class HairstyleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HairstyleCategory
        fields = '__all__'


class HairstyleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Hairstyle
        fields = '__all__'


class SalonSerializer(serializers.ModelSerializer):
    services = HairstyleSerializer(many=True, read_only=True)
    distance = serializers.SerializerMethodField()

    class Meta:
        model = Salon
        fields = '__all__'

    def get_distance(self, obj):
        request = self.context.get('request')
        if request:
            lat = request.query_params.get('lat')
            lng = request.query_params.get('lng')
            if lat and lng:
                import math
                lat1, lng1 = float(lat), float(lng)
                lat2, lng2 = obj.latitude, obj.longitude
                R = 6371
                dlat = math.radians(lat2 - lat1)
                dlng = math.radians(lng2 - lng1)
                a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
                return round(R * c, 2)
        return None


class AppointmentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    salon_name = serializers.CharField(source='salon.name', read_only=True)
    hairstyle_name = serializers.CharField(source='hairstyle.name', read_only=True)
    salon_address = serializers.CharField(source='salon.address', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['user', 'total_price']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['total_price'] = validated_data['hairstyle'].price
        return super().create(validated_data)
