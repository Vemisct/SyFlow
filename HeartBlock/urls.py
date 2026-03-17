from django.urls import path
from .views import *

urlpatterns = [
    path('', WelcomeVP, name='WelcomeUP'),
]