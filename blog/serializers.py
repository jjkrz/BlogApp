from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)  # tylko do odczytu
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at', 'approved']
        read_only_fields = ['id', 'created_at', 'author', 'approved']

