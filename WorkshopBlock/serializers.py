from rest_framework import serializers
from .models import *
from HeartBlock.serializers import *

class ProjectSerializer(serializers.ModelSerializer):
    author = UserProfileBriefSerializer(read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'tags', 'tags_list',
            'is_template', 'looking_for_team', 'stars_count',
            'author', 'created_at', 'updated_at'
        ]
        read_only_fields = ['author', 'stars_count', 'created_at', 'updated_at']

    def get_tags_list(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',') if tag.strip()]
        return []

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
    
class ProjectFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFile
        fields = ['id', 'name', 'content', 'created_at', 'updated_at']
        read_only_fields = ['project', 'created_at', 'updated_at']

    def create(self, validated_data):
        project_id = self.context['view'].kwargs.get('project_pk')
        validated_data['project_id'] = project_id
        return super().create(validated_data)