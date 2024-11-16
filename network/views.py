from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

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
    paginator = Paginator(posts, 10)
    page_num = request.GET.get('page', 1)
    page = paginator.get_page(page_num)
     # Serialize the posts for current page
    serialized_posts = [post.serialize() for post in page]

    

    data = {
        'posts': serialized_posts,
        'total_pages': paginator.num_pages,
        'current_page': page.number
    }

    return JsonResponse(data)


def get_profile(request, userID):
    user = User.objects.get(id = userID)
    posts = user.posts.all().order_by("-timestamp")
    is_current_user = user == request.user  

    return JsonResponse({
        "user_id": user.id,
        "username": user.username,
        "followers": user.followers_count,
        "following": user.following_count,
        "posts_num": user.posts.count(),
        "is_current_user": is_current_user,
        "is_following": request.user.is_following(user),
        "posts": [post.serialize() for post in posts]
    })  

def follow(request, userID):

    user = User.objects.get(id=userID)

    if request.user.is_following(user):
        request.user.unfollow(user)
    else:
        request.user.follow(user)
    
    return JsonResponse({
            'status': 'success',
            'is_following': request.user.is_following(user),
            'follower_count': user.followers_count
        })
    

