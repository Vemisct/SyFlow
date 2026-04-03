from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from .models import UserProgress, UserAppearance, UserPermissions

@receiver(user_signed_up)
def populate_profile(request, user, **kwargs):
    """
    Цей сигнал спрацьовує РІВНО ОДИН РАЗ, коли користувач вперше 
    реєструється через Google.
    """
    # 1. Витягуємо дані з Google
    if hasattr(user, 'socialaccount_set'):
        social_acc = user.socialaccount_set.filter(provider='google').first()
        if social_acc:
            # Зберігаємо аватарку та унікальний Google ID
            user.avatar_url = social_acc.extra_data.get('picture')
            user.google_id = social_acc.uid
            
            # Якщо нікнейм порожній, беремо ім'я з Google
            if not user.nickname:
                user.nickname = social_acc.extra_data.get('given_name', user.username)
                
            user.save()

    # 2. Створюємо системні модулі для нового користувача
    UserProgress.objects.get_or_create(profile=user)
    UserAppearance.objects.get_or_create(profile=user)
    UserPermissions.objects.get_or_create(profile=user)