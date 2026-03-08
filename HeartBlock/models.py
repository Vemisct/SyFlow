from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    # Google параметри
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Основні дані
    nickname = models.CharField(max_length=50, unique=True, verbose_name="Нікнейм")
    bio = models.TextField(max_length=500, blank=True, verbose_name="Біографія")
    
    # Системні параметри
    rank = models.CharField(max_length=50, default='Початківець', verbose_name="Ранг")
    user_status = models.CharField(max_length=100, blank=True, verbose_name="Статус")
    last_flow_entry = models.DateTimeField(auto_now=True, verbose_name="Останній вхід")

    def __str__(self):
        return self.nickname or self.username

# 2. Модель прогресу (Шлях)
class UserProgress(models.Model):
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='progress')
    synit_balance = models.IntegerField(default=0, verbose_name="Баланс SyNit")
    experience_points = models.IntegerField(default=0, verbose_name="Досвід (XP)")
    completed_tasks_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Прогрес: {self.profile.nickname}"

# 3. Модель вигляду та прикрас (Естетика)
class UserAppearance(models.Model):
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='appearance')
    active_theme = models.CharField(max_length=50, default='FlowLight', verbose_name="Активна тема")
    profile_border = models.CharField(max_length=100, blank=True, verbose_name="Рамка профілю")
    # Тут можна додавати розблоковані значки чи ефекти
    
    def __str__(self):
        return f"Вигляд: {self.profile.nickname}"

# 4. Модель подій та дозволів (Правила русла)
class UserPermissions(models.Model):
    profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='permissions')
    can_publish_projects = models.BooleanField(default=False, verbose_name="Дозвіл на публікацію")
    can_mentor_others = models.BooleanField(default=False, verbose_name="Дозвіл наставництва")
    is_silenced = models.BooleanField(default=False, verbose_name="Тіньовий бан (Режим тиші)")
    
    def __str__(self):
        return f"Дозволи: {self.profile.nickname}"