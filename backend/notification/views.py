from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView

# Create your views here.

class GetNotifications(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        notifs = Notification.objects.filter(receiver=request.user)
        serializer = NotificationSerializer(notifs, many=True)
        return Response(serializer.data)

class MarkAsRead(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        notif = Notification.objects.get(id=data['id'])
        response = Response()
        if (notif.receiver != request.user):
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        notif.mark_as_read()
        response = Response(status=status.HTTP_200_OK)
        response.data = "Notification marked as read"
        return response

class CheckIsRead(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = request.query_params
        notif = Notification.objects.get(id=data['id'])
        response = Response()
        if (notif.receiver != request.user):
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        response = Response(status=status.HTTP_200_OK)
        response.data = notif.is_read
        return response