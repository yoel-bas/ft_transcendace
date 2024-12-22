from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('requests/', GetRequests.as_view(), name='requests'),
    path('requests/create-request/', CreateRequest.as_view(), name='create_request'),
    path('requests/accept-request/', AcceptRequest.as_view(), name='accept_request'),
    path('requests/reject-request/', RejectRequest.as_view(), name='reject_request'),
    path('requests/remove-friend/', RemoveFriend.as_view(), name='remove_friend'),
    
]