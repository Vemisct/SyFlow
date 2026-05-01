from rest_framework import serializers
from .models import UserProfile

class UserProfileBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'nickname', 'avatar_url']
        read_only_fields = ['id', 'avatar_url']

