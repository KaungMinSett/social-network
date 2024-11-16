from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    pass

    def follow(self, user):
        if user != self:
            Follow.objects.get_or_create(
                follower=self,
                following=user
            )
    
    def unfollow(self, user):
        Follow.objects.filter(
            follower=self,
            following=user
        ).delete()
    

    def is_following(self, user):
        return self.following_relationships.filter(following=user).exists()
    
    @property
    def followers_count(self):
        return self.followers_relationships.count()
    
    @property
    def following_count(self):
        return self.following_relationships.count()

class Follow(models.Model):
    follower = models.ForeignKey( User,related_name='following_relationships',on_delete=models.CASCADE)
    following = models.ForeignKey( User, related_name='followers_relationships', on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_posts")

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "user_id": self.user.id,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes.count()
        }