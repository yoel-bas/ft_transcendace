from django.urls import path, include
from .views import TournamentList
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('tournaments/', TournamentList.as_view()),
]
