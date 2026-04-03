from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-rkl*q+_69@%x)3gar^k&_%f@9&#b@ht+s5*z)w-d9+jh_m5q!!'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'HeartBlock',
    'ExaminationBlock',
    'StudyBlock',
    'CommunityBlock',
    'KitchenBlock',
    'ActivityBlock',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'BrainBlock.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'TemplateBlock',],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'StaticBlock'),
]

SITE_ID = 1

# Налаштування Google
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
    }
}

# Куди перенаправляти користувача після успішного входу через Google
LOGIN_REDIRECT_URL = '/entrance/'
LOGOUT_REDIRECT_URL = '/'

# Налаштування провайдера Google
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        # Запитуємо у Google базовий профіль (аватарка, ім'я) та пошту
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        # Цей параметр гарантує, що Google завжди буде питати, 
        # який акаунт вибрати (зручно для розробки)
        'OAUTH_PKCE_ENABLED': True,
    }
}

# Вказуємо Django використовувати нашу абстрактну модель користувача
AUTH_USER_MODEL = 'HeartBlock.UserProfile'

# Вимагаємо пошту від Google обов'язково
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'

# Дозволяє прямий перехід до Google без потворної сторінки підтвердження
SOCIALACCOUNT_LOGIN_ON_GET = True