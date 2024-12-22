from django.urls import path, include
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
    path('42/callback/', Intra42Callback.as_view(), name='42_callback'),
    path('user/', AuthenticatedUserView.as_view(), name='AuthenticatedUser'),
    path('enable-2fa/', EnableTwoFactorView.as_view(), name='enable_2fa'),
    path('disable-2fa/', DisableTwoFactorView.as_view(), name='disable_2fa'),
    path('verify-2fa/', VerifyTwoFactorView.as_view(), name='verify_2fa'),
    path('cookies/', GetCookies.as_view(), name='get_cookies'),
    # path('get-qrcode/', GetQRCodeView.as_view(), name='get-qrcode'),
    path('logout/', Logout.as_view(), name='logout'),
    path('update/', UpdateUserView.as_view(), name='update'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh-access'),
    path('google/callback/', GoogleLoginCallback.as_view(), name='google_callback'),
    path('delete/', Delete_account.as_view(), name='delete_account'),
    path('block/', block_user.as_view(), name='block_user'),
    path('unblock/', unblock_user.as_view(), name='unblock_user'),
    path('check-blocked/', check_blocked.as_view(), name='check_blocked'),
    path('anonymize/', AnonymousUserViewSet.as_view(), name='anonym_user'),
    path('get-user/', GetUser.as_view(), name='get_user'),
    path('get-friends/', FriendsListView.as_view(), name='get_friends'),
    path('get-blocked/', BlockListView.as_view(), name='get_blocked'),
    path('user-status/', UserStatusView.as_view(), name='user_status'),
]
