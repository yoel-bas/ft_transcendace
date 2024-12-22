import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from game.consumers import Game
from tournament.consumers import Tournament
from chat.consumers import ChatConsumer
from notification.consumers import NotificationConsumer
from authentication.consumers import MyWebSocketConsumer


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

websocket_urlpatterns = [
    path('ws/game/', Game.as_asgi()),
    path('ws/tournament/', Tournament.as_asgi()),
    path('ws/chat/', ChatConsumer.as_asgi()),
    path('ws/notification/', NotificationConsumer.as_asgi()),
    path('ws/online/', MyWebSocketConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns),
    ), 
})
