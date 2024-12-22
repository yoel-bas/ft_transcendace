from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('', GetNotifications.as_view(), name='get_notifications'),
    path('mark-as-read/', MarkAsRead.as_view(), name='mark_as_read'),
    path('check-is-read/', CheckIsRead.as_view(), name='check_is_read'),
]