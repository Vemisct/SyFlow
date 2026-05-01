from django.db import models
from django.conf import settings

class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='settings')
    language = models.CharField(max_length=10, default='uk', choices=[('uk', 'Українська'), ('en', 'English')])
    font_family = models.CharField(max_length=100, default='system-ui, sans-serif',
                                   choices=[
                                       ('system-ui, sans-serif', 'System'),
                                       ('"Courier New", monospace', 'Monospace'),
                                       ('"Segoe UI", Roboto, sans-serif', 'Sans Serif')
                                   ])
    theme = models.CharField(max_length=20, default='dark', choices=[('dark', 'Темна'), ('light', 'Світла')])
    animations_enabled = models.BooleanField(default=True)
    sound_enabled = models.BooleanField(default=False)

    def __str__(self):
        return f"Налаштування {self.user.username}"