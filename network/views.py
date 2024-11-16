from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse


from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    

def create_post(request):
    if request.method == "POST":
        content = request.POST["content"]
        post = Post(
            user=request.user,
            content=content
        )
        post.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/index.html")
    

def posts(request, postType):
    if postType == "posts":
        posts = Post.objects.all()
    elif postType == "following":
        posts = Post.objects.filter(
            user__followers_relationships__follower=request.user
            )
    elif postType == "profile":
        posts = Post.objects.filter(
            user=request.user
            )
    else:
        return JsonResponse({"error": "Invalid request."}, status=400)
    
    posts = posts.order_by("-timestamp").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


def get_profile(request, username):
    user = User.objects.get(username=username)
    posts = user.posts.all().order_by("-timestamp")
    is_current_user = user == request.user  

    return JsonResponse({
        "username": user.username,
        "followers": user.followers_count,
        "following": user.following_count,
        "posts_num": user.posts.count(),
        "is_current_user": is_current_user,
        "is_following": request.user.is_following(user),
        "posts": [post.serialize() for post in posts]
    })  

def follow(request, username):
    user = User.objects.get(username=username)

    if request.user.is_following(user):
        request.user.unfollow(user)
    else:
        request.user.follow(user)
    
    return JsonResponse({
            'status': 'success',
            'is_following': request.user.is_following(user),
            'follower_count': user.followers_count
        })
    

