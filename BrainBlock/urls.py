from django.urls import path, include

urlpatterns = [
    path('', include('HeartBlock.urls')),
    path('develop/', include('StudyBlock.urls')),
    path('practice/', include('ExaminationBlock.urls')),
    path('use/', include('KitchenBlock.urls')),
    path('activity/', include('ActivityBlock.urls')),
    path('community/', include('CommunityBlock.urls')),
]