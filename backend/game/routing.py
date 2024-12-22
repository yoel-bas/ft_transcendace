from django.urls import re_path
from .consumers import Game


websocket_urlpatterns = [
    re_path(r'ws/game/remotegame', Game.as_asgi()),
]