from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('HeartBlock.urls')),
    path('develop/', include('StudyBlock.urls')),
    path('practice/', include('ExaminationBlock.urls')),
    path('use/', include('KitchenBlock.urls')),
    path('activity/', include('ActivityBlock.urls')),
    path('community/', include('CommunityBlock.urls')),
    path('accounts/', include('allauth.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])