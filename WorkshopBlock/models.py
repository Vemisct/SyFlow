from django.db import models
from HeartBlock.models import *


class Project(models.Model):
    author = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    tags = models.CharField(max_length=300, blank=True, help_text="Коми розділені теги")
    is_template = models.BooleanField(default=False)
    looking_for_team = models.BooleanField(default=False)
    # Для майбутнього використання (кількість переглядів, зірок тощо)
    stars_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class ProjectFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    name = models.CharField(max_length=200)           # шлях всередині проєкту, напр. "main.py"
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('project', 'name')         # унікальна назва файлу в межах проєкту

    def __str__(self):
        return f"{self.project.title} / {self.name}"