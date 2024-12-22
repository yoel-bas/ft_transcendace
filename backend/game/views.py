from django.shortcuts import render
from django.http import JsonResponse
from .models import Player, Match
from rest_framework.decorators import api_view
from .serializers import PlayerSerializer, MatchSerializer
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework import generics
from django.db.models import Q
# Create your views here.

class PlayersList(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication] 


class MatchesList(generics.ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get_queryset(self):
        
        username = self.request.query_params.get('username', None)
        if username:
            return Match.objects.filter(Q(player1__username=username) | Q(player2__username=username))
        
        user = self.request.user
        return Match.objects.filter(Q(player1=user) | Q(player2=user))