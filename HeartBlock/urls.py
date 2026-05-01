from django.urls import path
from .views import *

urlpatterns = [
    path('', WelcomeVP, name='WelcomeUP'),
    path('entrance/', EntranceVP, name='EntranceUP'),
    path('dashboard/', HomeVP, name='HomeUP'),
    path('settings/', SettingsVP, name='SettingsUP'),
    path('api/user/', CurrentUserAPI.as_view(), name='current-user'),
    path('api/user/update/', CurrentUserUpdate.as_view(), name='user-update'),
]