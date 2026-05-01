from django.urls import path
from .views import UserSettingsDetail

urlpatterns = [
    path('', UserSettingsDetail.as_view(), name='user-settings'),
]