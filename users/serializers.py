from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.models import Group

# Dla zwykłych użytkowników (bez możliwości edycji groups)
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    groups = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        read_only=True
    )

    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "groups", "is_staff", "date_joined"]
        read_only_fields = ["id", "is_staff", "groups", "date_joined"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        validated_data.pop('groups', None)
        validated_data.pop('is_staff', None)
        
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        
        instance.save()
        return instance


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    groups = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Group.objects.all()
    )

    class Meta:
        model = User
        fields = ["id", "username", "password", "email", "groups", "is_staff", "date_joined"]
        read_only_fields = ["id", "date_joined"]

    def create(self, validated_data):
        groups = validated_data.pop("groups", [])
        user = User.objects.create_user(**validated_data)
        user.groups.set(groups)
        return user
    
    def update(self, instance, validated_data):
        groups = validated_data.pop('groups', None)
        
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        
        if groups is not None:
            instance.groups.set(groups)
        
        instance.save()
        return instance
    