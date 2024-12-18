
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("posts/<str:postType>", views.posts, name="posts"),
    path("users/<str:userID>", views.get_profile, name="view_profile"),
    path("follow/<str:userID>", views.follow, name="follow"),
    path("edit_post/<int:postID>", views.edit_post, name="edit_post"),
    path("like/<int:postID>", views.like_post, name="like_post"),

]
