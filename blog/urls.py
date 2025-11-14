from django.urls import path
from . import views

app_name = "blog"

urlpatterns = [
    path("posts/", views.PostListAPI.as_view(), name="post-list"),
    path("posts/<int:pk>/", views.PostDetailAPI.as_view(), name="post-detail"),
    path("users/<int:pk>/posts/", views.UserPostsAPI.as_view(), name="user-post-list"),
]