from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
import subprocess, tempfile, os, shutil
from .models import *
from .serializers import *
from .flowperl_engine import FlowPerlEngine


@login_required
def WorkshopVP(request):
    return render(request, 'WorkshopTP.html')

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'stars_count', 'title']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ProjectFileViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectFileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        return ProjectFile.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_pk')
        project = Project.objects.get(pk=project_id)
        if project.author != self.request.user:
            raise PermissionDenied("Тільки автор може додавати файли")
        serializer.save(project_id=project_id)

class RunConfigView(generics.RetrieveUpdateAPIView):
    serializer_class = ProjectRunConfigSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        project_id = self.kwargs.get('project_pk')
        project = Project.objects.get(pk=project_id, author=self.request.user)
        config, created = ProjectRunConfig.objects.get_or_create(project=project)
        return config

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def run_project(request, project_pk):
    try:
        project = Project.objects.get(pk=project_pk, author=request.user)
    except Project.DoesNotExist:
        return Response({'error': 'Проєкт не знайдено або немає доступу'}, status=404)

    config, _ = ProjectRunConfig.objects.get_or_create(project=project)
    language = getattr(config, 'language', 'python')
    main_file_name = config.main_file

    if not main_file_name:
        ext = '.fp' if language == 'flowperl' else '.py'
        files = ProjectFile.objects.filter(project=project, name__endswith=ext)
        if files.exists():
            main_file_name = files.first().name
        else:
            return Response({'error': f'Не вказано головний файл і немає {ext}-файлів у проєкті'}, status=400)

    try:
        file_obj = ProjectFile.objects.get(project=project, name=main_file_name)
    except ProjectFile.DoesNotExist:
        return Response({'error': f'Файл {main_file_name} не знайдено'}, status=404)

    if language == 'flowperl':
        # Запускаємо FlowPerl через окремий процес
        code = file_obj.content
        # Викликаємо run_flowperl.py з передачею коду через stdin
        proc = subprocess.run(
            [sys.executable, 'run_flowperl.py'],
            input=code,
            text=True,
            capture_output=True,
            timeout=10,  # Тайм-аут 10 секунд
            cwd=os.path.dirname(os.path.abspath(__file__)) + '/..'  # корінь Django
        )
        return Response({
            'stdout': proc.stdout,
            'stderr': proc.stderr,
            'returncode': proc.returncode
        })
    else:
        # Python – старий код
        with tempfile.TemporaryDirectory() as tmpdir:
            for f in project.files.all():
                file_path = os.path.join(tmpdir, f.name)
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, 'w', encoding='utf-8') as fh:
                    fh.write(f.content)

            try:
                result = subprocess.run(
                    ['python3', os.path.join(tmpdir, main_file_name)] + (config.arguments.split() if config.arguments else []),
                    capture_output=True, text=True, timeout=15
                )
                return Response({
                    'stdout': result.stdout,
                    'stderr': result.stderr,
                    'returncode': result.returncode
                })
            except subprocess.TimeoutExpired:
                return Response({'error': 'Перевищено час виконання (15 секунд)'}, status=408)
            except Exception as e:
                return Response({'error': str(e)}, status=500)