from django.db import models
from datetime import datetime

# Create your models here.

class conversation(models.Model):
    id = models.AutoField(primary_key=True)
    user1_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name="user1")
    user2_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name="user2")
    creation_time = models.DateTimeField(auto_now_add=True)
    last_message = models.TextField(null=True)

class message(models.Model):
    id = models.AutoField(primary_key=True)
    conversation_id = models.ForeignKey("conversation", on_delete=models.CASCADE)
    sender_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name="sender")
    receiver_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name="receiver")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
    def get_human_readable_time(self):
        return self.timestamp.strftime("%A, %I:%M %p")