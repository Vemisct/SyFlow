from django.urls import path
from .views import *

urlpatterns = [
    path('', WelcomeVP, name='WelcomeUP'),
    path('entrance/', EntranceVP, name='EntranceUP'),
    path('dashboard/', HomeVP, name='HomeUP'),
    path('simulations/', GamesVP, name='GamesUP'),
]