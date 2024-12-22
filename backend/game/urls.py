from django.urls import path, include
from .views import PlayersList , MatchesList
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('players/', PlayersList.as_view()),
    path('matches/', MatchesList.as_view()),
]