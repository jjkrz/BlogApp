# tests.py
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        username='testuser',
        password='testpass123'
    )

@pytest.mark.django_db
def test_register(api_client):
    response = api_client.post('/api/register/', {
        'username': 'newuser',
        'password': 'newpass123'
    })
    assert response.status_code == 201
    assert User.objects.filter(username='newuser').exists()

@pytest.mark.django_db
def test_login(api_client, user):
    response = api_client.post('/api/login/', {
        'username': 'testuser',
        'password': 'testpass123'
    })
    assert response.status_code == 200
    assert 'tokens' in response.json()
    assert 'access' in response.json()['tokens']

@pytest.mark.django_db
def test_protected_endpoint(api_client, user):
    # Login
    login_response = api_client.post('/api/login/', {
        'username': 'testuser',
        'password': 'testpass123'
    })
    token = login_response.json()['tokens']['access']
    
    # Użyj tokena
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    response = api_client.get('/api/me/')
    
    assert response.status_code == 200
    assert response.json()['username'] == 'testuser'

@pytest.mark.django_db
def test_create_post_authenticated(api_client, user):
    # Login
    login_response = api_client.post('/api/login/', {
        'username': 'testuser',
        'password': 'testpass123'
    })
    token = login_response.json()['tokens']['access']
    
    # Utwórz post
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    response = api_client.post('/api/posts/', {
        'title': 'Test Post',
        'content': 'Test Content',
        'slug': 'test-post'
    })
    
    assert response.status_code == 201

# Uruchom: pytest tests.py -v