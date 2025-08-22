from django.db import models
from django.contrib.auth.models import User


# Models is the structure for a database

# This model will save the Models probability Distribution for the different classes and the input image
class UserDetectionNote(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    # Top 3 Probabilites and their names object
    skin_data = models.JSONField(default=dict)

    # Detection Image
    skin_image = models.ImageField(upload_to='images/', blank=True, null=True)

    # Easier to Debug
    def __str__(self):
        return self.title
    
    # Order by Creation Date
    class Meta:
        ordering = ['-created_at']
    