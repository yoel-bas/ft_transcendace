from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import FriendRequest
from .serializers import FriendRequestSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action, api_view
from authentication.models import CustomUser
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from chat.models import conversation
from notification.models import Notification

# Create your views here.

def check_friendrequest_exists(sender, receiver):
    return FriendRequest.objects.filter(sender=sender, receiver=receiver).exists()

def create_notification(sender, receiver, notif_type, title, description, friend_request):
    return Notification.objects.create(sender=sender, receiver=receiver, notif_type=notif_type, title=title, description=description, friend_request=friend_request)

class CreateRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        data = request.data
        response = Response()
        if request.user.friends.filter(id=data['receiver']).exists():
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "User is already your friend"
            return response
        if check_friendrequest_exists(data['sender'], data['receiver']) or check_friendrequest_exists(data['receiver'], data['sender']):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request already sent"
            return response
        if (data['sender'] == data['receiver']):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Cannot send friend request to yourself"
            return response
        if (request.user != CustomUser.objects.get(id=data['sender'])):
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        serializer = FriendRequestSerializer(data=data)
        if serializer.is_valid() == False:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = serializer.errors
            return response
        friend_req = FriendRequest.objects.create(sender=CustomUser.objects.get(id=data['sender']), receiver=CustomUser.objects.get(id=data['receiver']))
        user = CustomUser.objects.get(id=data['receiver'])
        notif = create_notification(request.user, user, 'friend_request', 'Friend Request', f'{request.user.full_name} has sent you a friend request.', friend_req)
        channel_layer = get_channel_layer()
        room_group_name = f'notif_{user.username}'
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'send_notification',
                'id': notif.id,
                'notif_type': 'friend_request',
                'sender': request.user.username,
                'receiver': user.username,
                'title': 'Friend Request',
                'description': f'{request.user.full_name} has sent you a friend request.',
                'friend_request': friend_req.id,
                'get_human_readable_time': notif.get_human_readable_time()
            }
        )
        response = Response(status=status.HTTP_201_CREATED)
        response.data = "Friend request sent"
        return response

class GetRequests(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        send_requests = FriendRequest.objects.filter(Q(status='P') & Q(sender=user))
        receive_requests = FriendRequest.objects.filter(Q(status='P') & Q(receiver=user))
        serializer = FriendRequestSerializer(send_requests, many=True)
        serializer2 = FriendRequestSerializer(receive_requests, many=True)
        response = Response()
        response.data = {
            "send_requests": serializer.data,
            "receive_requests": serializer2.data
        }
        return response

class AcceptRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def check_conversation_exists(self, user1, user2):
        return conversation.objects.filter(user1_id=user1, user2_id=user2).exists() or conversation.objects.filter(user1_id=user2, user2_id=user1).exists()

    def post(self, request):
        id = request.data['id']
        response = Response()
        if (not FriendRequest.objects.filter(id=id).exists()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request does not exist"
            return response
        friend_req = FriendRequest.objects.get(id=id)
        if (request.user.id != friend_req.receiver.id):
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        if (not friend_req.accept_request()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request already accepted"
            return response
        request.user.friends.add(friend_req.sender)
        if (not self.check_conversation_exists(request.user, friend_req.sender)):
            conversation.objects.create(user1_id=request.user, user2_id=friend_req.sender, last_message='Tap to chat')
        notif = create_notification(friend_req.receiver, friend_req.sender, 'accept_friend_request', 'Friend Request Accepted', f'{friend_req.receiver.full_name} has accepted your friend request.', None)
        room_group_name = f'notif_{friend_req.sender.username}'
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'send_notification',
                'id': notif.id,
                'notif_type': 'accept_friend_request',
                'sender': friend_req.receiver.username,
                'receiver': friend_req.sender.username,
                'title': 'Friend Request Accepted',
                'description': f'{friend_req.receiver.full_name} has accepted your friend request.',
                'friend_request': None,
                'get_human_readable_time': notif.get_human_readable_time()
            }
        )
        response = Response(status=status.HTTP_200_OK)
        response.data = "Friend request accepted"
        return response

class RejectRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        id = request.data['id']
        response = Response()
        if (not FriendRequest.objects.filter(id=id).exists()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request does not exist"
            return response
        friend_req = FriendRequest.objects.get(id=id)
        if (request.user.id != friend_req.receiver.id):
            if (request.user.id == friend_req.sender.id):
                friend_req.delete()
                response = Response(status=status.HTTP_200_OK)
                response.data = "Friend request cancelled"
                return response
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        if (not friend_req.reject_request()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request already rejected"
            return response
        response = Response(status=status.HTTP_200_OK)
        response.data = "Friend request rejected"
        return response

class RemoveFriend(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        friend_id = request.data['id']
        user = request.user
        response = Response()
        friend = CustomUser.objects.get(id=friend_id)
        if (friend not in user.friends.all()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend not found"
            return response
        user.friends.remove(friend)
        response = Response(status=status.HTTP_200_OK)
        response.data = "Friend removed"
        return response
