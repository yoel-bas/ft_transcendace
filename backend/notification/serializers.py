from rest_framework import serializers
from .models import Notification
from authentication.serializers import SimplifiedUserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    sender_info = SimplifiedUserSerializer(source='sender', read_only=True)
    receiver_info = SimplifiedUserSerializer(source='receiver', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'sender_info', 'receiver_info', 'notif_type', 'get_human_readable_time', 'is_read', 'title', 'description', 'friend_request']