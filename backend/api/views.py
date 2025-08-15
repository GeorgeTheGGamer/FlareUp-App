from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UserSerializer
from .services.nhs_service import get_cached_nhs_data


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
    
# Now for all Authenticated Users the API Data is cached for frequent Use and limitations of the External API
class NHSDataView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, condition):
        nhs_data = get_cached_nhs_data(condition=condition)
        return Response({"nhs_data": nhs_data})




