from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UserSerializer, UserDetectionNoteSerializer
from .services.nhs_service import get_cached_nhs_data
from .models import UserDetectionNote

'''
Process incoming request data (GET, POST, etc.)
Interact with models (database operations)
Apply business logic
Return a response (HTML, JSON, redirect, etc.)=
'''

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
    
# ********************************************************************************************************************

# Now for all Authenticated Users the API Data is cached for frequent Use and limitations of the External API
class NHSDataView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, condition):
        nhs_data = get_cached_nhs_data(condition=condition)
        return Response({"nhs_data": nhs_data})

# ********************************************************************************************************************


# Handle the Creation of Skin Notes and deletion
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = UserDetectionNoteSerializer
    permission_classes = [IsAuthenticated]              # Has an access token

    # Only can read notes by user and not others 
    def get_queryset(self):
        user = self.request.user
        return UserDetectionNote.objects/filter(author=user)
    
    # Create a new note 
    def perform_create(self, serializer):

        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

# Deleting Note
class NoteDelete(generics.DestroyAPIView):
    serializer_class = UserDetectionNoteSerializer
    permission_classes = [IsAuthenticated]

    # Query set of what is affected and in this case it is a specific Users Notes

    def get_queryset(self):
        user = self.request.user
        return UserDetectionNote.objects.filter(author=user)


