from django.db import models
from StudyBlock.models import Lesson, Course

class Exam(models.Model):
    # Екзамен може бути фінальним випробуванням для всього курсу
    course = models.OneToOneField(Course, on_delete=models.CASCADE, related_name='exam', verbose_name="Курс")
    title = models.CharField(max_length=200, verbose_name="Назва екзамену")
    passing_score = models.PositiveIntegerField(default=80, verbose_name="Прохідний бал (%)")
    reward_synit = models.PositiveIntegerField(default=100, verbose_name="Нагорода SyNit за екзамен")

    def __str__(self):
        return f"Екзамен: {self.title}"

class Test(models.Model):
    # Тест прив'язується до конкретного уроку
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='test', verbose_name="Урок")
    title = models.CharField(max_length=200, verbose_name="Назва тесту")
    reward_synit = models.PositiveIntegerField(default=20, verbose_name="Нагорода SyNit за тест")

    def __str__(self):
        return f"Тест до уроку: {self.lesson.title}"

class Question(models.Model):
    # Питання може належати або Тесту, або Екзамену
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    
    text = models.TextField(verbose_name="Текст питання")
    
    # JSONField дозволяє зберігати варіанти у вигляді словника: {"a": "Відповідь 1", "b": "Відповідь 2"}
    # Це робить код чистим і дуже зручним для роботи з React
    options = models.JSONField(verbose_name="Варіанти відповідей (JSON)", default=dict)
    correct_option_key = models.CharField(max_length=50, verbose_name="Ключ правильної відповіді (напр. 'a')")

    def __str__(self):
        return self.text[:50]