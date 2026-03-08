from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def WelcomeVP(request):
    """
    Точка входу для сторінки вітання.
    Frontend (React) зробить сюди запит, щоб отримати головне повідомлення.
    """
    return Response({
        "status": "success",
        "message": "Get into the flow, with SyFlow. Вітаємо у новому руслі!"
    })

@api_view(['POST'])
def LoginVP(request):
    """
    Заглушка для входу. 
    Пізніше ми додамо сюди логіку Simple JWT та перевірку Google-токенів.
    """
    return Response({
        "status": "info",
        "message": "Тут буде генеруватися токен доступу для учня."
    })