from rest_framework import serializers
from .models import Project
from apps.registration.models import AbstractUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUser
        fields = ['id', 'username', 'email', 'phone', 'is_admin']
        read_only_fields = ['id', 'is_admin']


class ProjectSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'user', 'user_id',
            'created_at', 'updated_at', 'image', 'image_url'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def create(self, validated_data):
        # Set user from request if not provided
        if 'user_id' not in validated_data:
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                validated_data['user'] = request.user
        return super().create(validated_data)
