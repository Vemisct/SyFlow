from django.apps import AppConfig


class HeartblockConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'HeartBlock'

    def ready(self):
        # Пробуджуємо вартового при запуску системи
        import HeartBlock.signals
