from django.shortcuts import render

def WelcomeVP(request):
    """
    Чиста в'юшка для сторінки привітання.
    Відображає автономний шаблон WelcomeTP.
    """
    return render(request, 'WelcomeTP.html')