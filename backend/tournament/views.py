from django.shortcuts import render
from .models import TournamentDB
from .serializers import TournamentSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication





class TournamentList(generics.ListAPIView):
    queryset = TournamentDB.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

# Create your views here.
