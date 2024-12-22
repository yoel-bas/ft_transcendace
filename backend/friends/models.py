from django.db import models
from authentication.models import CustomUser

# Create your models here.

class FriendRequest(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey('authentication.CustomUser', related_name='friend_requests_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey('authentication.CustomUser', related_name='friend_requests_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('P', 'Pending'),
        ('A', 'Accepted'),
        ('R', 'Rejected'),
    ]

    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

    class Meta:
        verbose_name = 'Friend Request'
        unique_together = ('sender', 'receiver')
    
    def accept_request(self):
        if self.status != 'P':
            return False
        self.status = 'A'
        self.save()
        self.delete()
        return True
    def reject_request(self):
        if self.status != 'P':
            return False
        self.status = 'R'
        self.save()
        self.delete()
        return True