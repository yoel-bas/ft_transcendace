from django.shortcuts import render
from rest_framework import viewsets
from .models import conversation, message
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .paginations import ChatPagination
from django.db.models import Q
from authentication.models import CustomUser

class ConversationViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    def get_queryset(self):
        friend_username = self.request.GET.get('friend_username')
        if friend_username:
            friend = CustomUser.objects.get(username=friend_username)
            conv = conversation.objects.filter(Q(user1_id=self.request.user.id, user2_id=friend.id) | Q(user1_id=friend.id, user2_id=self.request.user.id))
            if not conv:
                return conversation.objects.none()
            return conv
        return conversation.objects.filter(user1_id=self.request.user.id) | conversation.objects.filter(user2_id=self.request.user.id)

class SearchConversationViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    def get_queryset(self):
        user_id = self.request.user.id
        search = self.request.GET.get('search')
        return conversation.objects.filter(user1_id=user_id, user2_id__full_name__icontains=search) | conversation.objects.filter(user2_id=user_id, user1_id__full_name__icontains=search)

class MessageViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = MessageSerializer
    pagination_class = ChatPagination
    def get_queryset(self):
        conversation_id = self.request.GET.get('conversation_id')
        return message.objects.order_by('-timestamp').filter(conversation_id=conversation_id).all()
