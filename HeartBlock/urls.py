from django.urls import path
from . import views

urlpatterns = [
    path('welcome/', views.WelcomeVP, name='WelcomeUP'),
    path('login/', views.LoginVP, name='LoginUP'),
]