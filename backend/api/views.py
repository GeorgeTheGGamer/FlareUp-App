from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializers import UserSerializer, UserDetectionNoteSerializer
from .services.nhs_service import get_cached_nhs_data
from .models import UserDetectionNote

import tensorflow as tf
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import numpy as np 
from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input
import io
import os
from django.conf import settings


# ************************************************************************************************************************************************

# User Details

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GetUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
# ************************************************************************************************************************************************

# External NHS API

class NHSDataView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, condition):
        nhs_data = get_cached_nhs_data(condition=condition)
        return Response({"nhs_data": nhs_data})

# ************************************************************************************************************************************************

# Notes Tracking of Previous AI Results 

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = UserDetectionNoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return UserDetectionNote.objects.filter(author=user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = UserDetectionNoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return UserDetectionNote.objects.filter(author=user)

# ************************************************************************************************************************************************

# Skin Image Classification
class SkinDiseaseClassificationView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def __init__(self):
        super().__init__()

        # Use Django's BASE_DIR for correct path
        model_path = os.path.join(
            settings.BASE_DIR,  # This points to your backend folder
            'api',
            'models',      
            'skin_disease_mobile.tflite'
        )
        
        print(f"Looking for model at: {model_path}")  # Debug line

        # Load TensorFlow Lite Model
        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()

        # Get the Input and the Output Details
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        # Ensure is the Correct Input Shape 
        self.input_shape = self.input_details[0]['shape']
        print(f"Model input shape: {self.input_shape}")

        # Define the exact class labels from your training (in the same order as label_encoder)
        self.class_labels = [
            'Acne', 'Actinic_Keratosis', 'Benign_tumors', 'Bullous',
            'Candidiasis', 'DrugEruption', 'Eczema', 'Infestations_Bites',
            'Lichen', 'Lupus', 'Moles', 'Psoriasis', 'Rosacea',
            'Seborrh_Keratoses', 'SkinCancer', 'Sun_Sunlight_Damage',
            'Tinea', 'Unknown_Normal', 'Vascular_Tumors', 'Vasculitis',
            'Vitiligo', 'Warts'
        ]
    
    def preprocess_image(self, image_file):  
        '''Preprocess Image to be Compatible with Tensorflow Lite Model'''
        try:
            # Open and convert image to RGB
            image = Image.open(image_file)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to 300x300 (same as training)
            image = image.resize((300, 300), Image.Resampling.LANCZOS)
            
            # Convert to numpy array
            image_array = np.array(image, dtype=np.float32)
            
            # Add batch dimension: (300, 300, 3) -> (1, 300, 300, 3)
            image_array = np.expand_dims(image_array, axis=0)
            
            # Apply EfficientNet preprocessing (same as your training)
            # This handles scaling and normalization specific to EfficientNet
            processed_image = preprocess_input(image_array)
            
            return processed_image
            
        except Exception as e:
            raise ValueError(f"Error preprocessing image: {str(e)}")
        
    def post(self, request):
        try:
            # Check if image file was uploaded
            if 'image' not in request.FILES:
                return Response({
                    'error': 'No image file provided. Please upload an image.'
                }, status=400)
            
            image_file = request.FILES['image']
            
            # Validate file type
            if not image_file.content_type.startswith('image/'):
                return Response({
                    'error': 'Invalid file type. Please upload an image file.'
                }, status=400)
            
            # Preprocess the image
            processed_image = self.preprocess_image(image_file)  # Now correctly calls the fixed method name
            
            # Set input tensor
            self.interpreter.set_tensor(self.input_details[0]['index'], processed_image)
            
            # Run inference
            self.interpreter.invoke()
            
            # Get output predictions
            output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
            predictions = output_data[0]  # Remove batch dimension: (1, 22) -> (22,)
            
            # Return just the probability list
            return Response({
                'probabilities': predictions.tolist()  # Convert numpy array to Python list
            })
            
        except Exception as e:
            return Response({
                'error': f'Classification failed: {str(e)}'
            }, status=500)