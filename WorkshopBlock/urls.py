from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkshopVP, ProjectViewSet, ProjectFileViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)

urlpatterns = [
    path('main/', WorkshopVP, name='WorkshopUP'),
    path('api/', include(router.urls)),
    # Вкладені файли
    path('api/projects/<int:project_pk>/files/', ProjectFileViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='project-files-list'),
    path('api/projects/<int:project_pk>/files/<int:pk>/', ProjectFileViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='project-files-detail'),
]