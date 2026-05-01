from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, permissions, filters, generics
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from .serializers import UserProfileBriefSerializer

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

class CurrentUserAPI(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CurrentUserUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileBriefSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
def SettingsVP(request):
    return render(request, 'SettingsTP.html')

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_avatar(request):
    file = request.FILES.get('avatar')
    if not file:
        return Response({'error': 'No file'}, status=400)
    file_name = default_storage.save(f'avatars/{file.name}', file)
    file_url = default_storage.url(file_name)
    return Response({'url': request.build_absolute_uri(file_url)})