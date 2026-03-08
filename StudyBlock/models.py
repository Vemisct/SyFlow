from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=150, verbose_name="Назва курсу")
    description = models.TextField(verbose_name="Опис курсу")
    is_active = models.BooleanField(default=True, verbose_name="Активний")
    
    def __str__(self):
        return self.title

class Section(models.Model):
    course = models.ForeignKey(Course, related_name='sections', on_delete=models.CASCADE)
    title = models.CharField(max_length=150, verbose_name="Назва розділу")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")
    
    def __str__(self):
        return f"{self.course.title} | {self.title}"

class Module(models.Model):
    section = models.ForeignKey(Section, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=150, verbose_name="Назва модуля")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")
    
    def __str__(self):
        return f"{self.section.title} | {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200, verbose_name="Назва уроку")
    content = models.TextField(verbose_name="Текст / Контент уроку")
    reward_synit = models.PositiveIntegerField(default=10, verbose_name="Нагорода SyNit")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")
    
    def __str__(self):
        return f"{self.module.title} | {self.title}"