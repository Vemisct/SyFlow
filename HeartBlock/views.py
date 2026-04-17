from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def WelcomeVP(request):
    """
    Чиста в'юшка для сторінки привітання.
    Відображає автономний шаблон WelcomeTP.
    """
    return render(request, 'WelcomeTP.html')

@login_required # Сюди можуть потрапити ТІЛЬКИ авторизовані через Google
def EntranceVP(request):
    """
    В'юшка ритуалу переходу. Відкриває масивну браму після авторизації.
    """
    return render(request, 'EntranceTP.html')

@login_required
def HomeVP(request):
    """Головний дашборд (Серце Системи)"""
    return render(request, 'HomeTP.html')

@login_required
def GamesVP(request):
    """Сектор Симуляцій (Ігри/Тренажери)"""
    return render(request, 'GamesTP.html')

@login_required
def AcademyVP(request):
    return render(request, 'AcademyTP.html')

@login_required
def MarketVP(request):
    return render(request, 'MarketTP.html')