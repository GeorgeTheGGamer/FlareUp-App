from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, GetUserView, NHSDataView, NoteListCreate, NoteDelete, SkinDiseaseClassificationView
# Take the already built views to handle the jwt tokens for loggining in 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# API end points for the frontend to call
urlpatterns = [
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/user/details/', GetUserView.as_view(), name="user_details"),
    path('api/nhs-data/<str:condition>/', NHSDataView.as_view(), name='nhs_data'),
    path("api/notes/", NoteListCreate.as_view(), name="note-list"),
    path("api/notes/delete/<int:pk>/", NoteDelete.as_view(), name="delete_note"),
    path("api/classify-skin-condition/", SkinDiseaseClassificationView.as_view(), name="skin_classification"),
    path('admin/', admin.site.urls)
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)