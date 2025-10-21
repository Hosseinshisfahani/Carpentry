from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import AbstractUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = AbstractUser
        fields = ['username', 'email', 'phone', 'password', 'confirm_password']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("رمز عبور و تایید رمز عبور مطابقت ندارند.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = AbstractUser.objects.create_user(**validated_data, password=password)
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('نام کاربری یا رمز عبور اشتباه است.')
            if not user.is_active:
                raise serializers.ValidationError('حساب کاربری غیرفعال است.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('نام کاربری و رمز عبور الزامی است.')
        
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUser
        fields = ['id', 'username', 'email', 'phone', 'is_admin']
        read_only_fields = ['id', 'is_admin']
