from rest_framework import serializers
from .models import Project, BinPackingReport
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


class BinPackingReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = BinPackingReport
        fields = [
            'id', 'project', 'name', 'container_width', 'container_height',
            'rectangles', 'packed_rectangles', 'visualization', 'density',
            'success', 'message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # Project is set from the URL/view, ensure user owns the project
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            project = validated_data.get('project')
            if project and project.user != request.user:
                raise serializers.ValidationError("You don't have permission to create reports for this project.")
        return super().create(validated_data)


class RectangleSerializer(serializers.Serializer):
    """Serializer for individual rectangle dimensions"""
    width = serializers.FloatField(min_value=0.1)
    height = serializers.FloatField(min_value=0.1)


class BinPackingInputSerializer(serializers.Serializer):
    """Serializer for bin packing input data"""
    container_width = serializers.FloatField(min_value=1.0)
    container_height = serializers.FloatField(min_value=1.0)
    rectangles = RectangleSerializer(many=True, min_length=1)
    
    def validate_rectangles(self, value):
        """Validate that rectangles fit within container"""
        container_width = float(self.initial_data.get('container_width', 0))
        container_height = float(self.initial_data.get('container_height', 0))
        
        for rect in value:
            if rect['width'] > container_width or rect['height'] > container_height:
                raise serializers.ValidationError(
                    f"قطعه {rect['width']}x{rect['height']} برای ظرف {container_width}x{container_height} بسیار بزرگ است"
                )
        return value


class PackedRectangleSerializer(serializers.Serializer):
    """Serializer for packed rectangle result"""
    x = serializers.FloatField()
    y = serializers.FloatField()
    width = serializers.FloatField()
    height = serializers.FloatField()
    rotated = serializers.BooleanField()


class BinPackingOutputSerializer(serializers.Serializer):
    """Serializer for bin packing output data"""
    success = serializers.BooleanField()
    density = serializers.FloatField()
    packed_rectangles = PackedRectangleSerializer(many=True)
    image_base64 = serializers.CharField(allow_blank=True)
    message = serializers.CharField(allow_blank=True)
