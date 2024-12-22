from django.db import models
from datetime import datetime

# Create your models here.

class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name="sent_notifications")
    receiver = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name="received_notifications")
    notif_type = models.TextField(max_length=32, default='info')
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    title = models.TextField(max_length=64)
    description = models.TextField(max_length=128)
    friend_request = models.ForeignKey("friends.FriendRequest", on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def mark_as_read(self):
        self.is_read = True
        self.save()
    def get_human_readable_time(self):
        return self.created_at.strftime("%A, %I:%M %p")