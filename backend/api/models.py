from django.db import models
from django.contrib.auth.models import User

class UserDetectionNote(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    skin_data = models.JSONField(default=dict)
    skin_image = models.ImageField(upload_to='images/', blank=True, null=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']
    