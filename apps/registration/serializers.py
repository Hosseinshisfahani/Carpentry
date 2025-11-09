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
        
        if not username or not password:
            raise serializers.ValidationError({'non_field_errors': ['نام کاربری و رمز عبور الزامی است.']})
        
        # Check if username looks like an email (contains @)
        if '@' in username:
            # Try to find user by email
            try:
                user_obj = AbstractUser.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except AbstractUser.DoesNotExist:
                user = None
        else:
            # Try to authenticate with username
            user = authenticate(username=username, password=password)
        
        if not user:
            raise serializers.ValidationError({'non_field_errors': ['نام کاربری یا رمز عبور اشتباه است.']})
        
        if not user.is_active:
            raise serializers.ValidationError({'non_field_errors': ['حساب کاربری غیرفعال است.']})
        
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AbstractUser
        fields = ['id', 'username', 'email', 'phone', 'is_admin', 'date_joined', 'avatar_url']
        read_only_fields = ['id', 'is_admin', 'date_joined']
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUser
        fields = ['username', 'email', 'phone', 'avatar']
    
    def validate_username(self, value):
        user = self.instance
        if AbstractUser.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError('این نام کاربری قبلاً استفاده شده است.')
        return value
    
    def validate_email(self, value):
        user = self.instance
        if AbstractUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError('این ایمیل قبلاً استفاده شده است.')
        return value


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("رمز عبور جدید و تایید رمز عبور مطابقت ندارند.")
        return attrs
    
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('رمز عبور فعلی اشتباه است.')
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        try:
            user = AbstractUser.objects.get(email=value)
            if not user.is_active:
                raise serializers.ValidationError('حساب کاربری غیرفعال است.')
        except AbstractUser.DoesNotExist:
            # Don't reveal if email exists or not for security reasons
            pass
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    uid = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=6)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("رمز عبور جدید و تایید رمز عبور مطابقت ندارند.")
        return attrs
