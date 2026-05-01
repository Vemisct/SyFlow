from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from HeartBlock.views import *
from WorkshopBlock.views import *


urlpatterns = [
    path('', include('HeartBlock.urls')),
    path('develop/', include('StudyBlock.urls')),
    path('practice/', include('ExaminationBlock.urls')),
    path('workshop/', include('WorkshopBlock.urls')),
    path('activity/', include('ActivityBlock.urls')),
    path('community/', include('CommunityBlock.urls')),
    path('api/settings/', include('SettingsBlock.urls')),
    path('guid/', include('GuidBlock.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/upload-avatar/', upload_avatar, name='upload-avatar'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])