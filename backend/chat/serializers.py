from rest_framework import serializers
from .models import conversation, message
from authentication.serializers import SimplifiedUserSerializer

class ConversationSerializer(serializers.ModelSerializer):
    user1_info = SimplifiedUserSerializer(source='user1_id', read_only=True)
    user2_info = SimplifiedUserSerializer(source='user2_id', read_only=True)
    class Meta:
        model = conversation
        fields = ['id', 'user1_info', 'creation_time', 'last_message', 'user2_info']

class MessageSerializer(serializers.ModelSerializer):
    sender = SimplifiedUserSerializer(source='sender_id', read_only=True)
    receiver = SimplifiedUserSerializer(source='receiver_id', read_only=True)
    class Meta:
        model = message
        fields = ['id', 'conversation_id', 'sender', 'receiver', 'content', 'get_human_readable_time']