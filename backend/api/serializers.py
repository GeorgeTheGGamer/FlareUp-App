from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserDetectionNote


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password" : {"write_only" : True}}
    
    # Create a New User 
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# Serializer to convert python to JSON Object
class UserDetectionNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetectionNote
        fields = ["id", "title", "description", "skin_data", "skin_image", "created_at", "author"]
        extra_kwargs = {"author": {"read_only":True}}


