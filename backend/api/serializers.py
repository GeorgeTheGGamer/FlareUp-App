from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserDetectionNote

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserDetectionNoteSerializer(serializers.ModelSerializer):
    skin_image_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = UserDetectionNote
        fields = ["id", "title", "description", "skin_data", "skin_image", "skin_image_url", "created_at", "author"]
        extra_kwargs = {
            "author": {"read_only": True},
            "description": {"required": False, "allow_blank": True},
            "skin_image": {"required": False}  # Make image optional
        }
    
    def get_skin_image_url(self, obj):
        """Return the full URL for the skin image (for reading)"""
        if obj.skin_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.skin_image.url)
        return None
    
    def to_representation(self, instance):
        """Override to return skin_image_url as skin_image in responses"""
        ret = super().to_representation(instance)
        # Replace skin_image with the full URL for API responses
        ret['skin_image'] = ret.pop('skin_image_url', None)
        return ret
