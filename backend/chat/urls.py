from django.urls import path, include
from .views import ConversationViewSet, MessageViewSet, SearchConversationViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'search', SearchConversationViewSet, basename='search')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = router.urls