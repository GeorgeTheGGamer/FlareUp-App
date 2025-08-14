from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics 
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
from django.http import Http404


# Views are used to handle HTTP Requests and responses 

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# To retrieve the UserName of the User 
class GetUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

