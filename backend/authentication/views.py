from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login, authenticate, logout
from .serializers import *
from .models import CustomUser
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from django.forms.models import model_to_dict
from authentication.twofaAuth import twofactorAuth
import pyotp
from urllib.parse import urljoin
import os
from django.http import HttpResponseRedirect
import jwt
from django.utils.timezone import now
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import random
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser, FormParser
from .host_image import host_qrcode

URL = os.getenv('URL')

# Sign Up View
class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = SignUpSerializer

def setTokens(response, user):
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    response.set_cookie(
        key='access',
        value=access_token,
        httponly=True,
        secure=True,
        samesite='Lax',
    )
    return response

def delete_tokens(request, status):
    response = Response(status=status)
    response.delete_cookie('access')
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    return response

# Callback Intra View
class Intra42Callback(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        code = request.GET.get('code')
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.INTRA_42_CLIENT_ID,
            'client_secret': settings.INTRA_42_CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.INTRA_42_REDIRECT_URI
        }
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        if response.status_code != 200:
                response = HttpResponseRedirect(f"{URL}/login")
                response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
                return response
        response_data = response.json()
        access_token = response_data['access_token']
        if not access_token:
                response = HttpResponseRedirect(f"{URL}/login")
                response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
                return response
        user_info = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()

        if 'login' not in user_info or 'email' not in user_info:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response

        try:
            user = CustomUser.objects.get((Q(username=user_info['login']) | Q(email=user_info['email'])))
        except CustomUser.DoesNotExist:
            user = CustomUser.objects.create(
                username=user_info['login'],
                email=user_info['email'],
                full_name=user_info['displayname'],
                avatar_url=user_info['image']['link'],
                social_logged=True,
                password_is_set=False
            )

        authenticate(request, username=user.username)
        if not user.is_authenticated:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response
        login(request, user)
        if not user.enabeld_2fa:
            user.is_already_logged = True
            user.save()
            response = HttpResponseRedirect(f'{URL}/profile')
            response.set_cookie('loginSuccess', 'true', max_age=30, samesite='Lax')
        if user.enabeld_2fa:
            response = HttpResponseRedirect(f'{URL}/twofa')
            response.set_cookie('loginSuccess', 'twofa', max_age=30, samesite='Lax')
        response = setTokens(response, user)
        user_data = Intra42UserSerializer(user).data
        response.data = user_data
        return response

# Callback Google View
class GoogleLoginCallback(APIView):
    def get(self, request):
        code = request.GET.get("code")
        if not code:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response

        # Google OAuth token endpoint
        token_endpoint_url = urljoin("https://oauth2.googleapis.com", "/token")
        data = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
            "grant_type": "authorization_code",
        }

        response = requests.post(token_endpoint_url, data=data)
        if response.status_code != 200:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response

        try:
            response_data = response.json()
            access_token = response_data.get("access_token")
        except ValueError:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response

        if not access_token:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response
        
        # Get user info from Google
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = requests.get(user_info_url, headers=headers)
        if user_info_response.status_code != 200:
            response = HttpResponseRedirect(f"{URL}/login")
            response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
            return response
        try:
            user_info = user_info_response.json()

            if 'sub' not in user_info or 'email' not in user_info:
                response = HttpResponseRedirect(f"{URL}/login")
                response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
                return response
            try:
                user = CustomUser.objects.get((Q(username=user_info['given_name']) | Q(email=user_info['email'])))
            except CustomUser.DoesNotExist:
                user = CustomUser.objects.create(
                    username=user_info['email'].split('@')[0],
                    email=user_info['email'],
                    full_name=user_info['name'],
                    avatar_url=user_info['picture'],
                    social_logged=True,
                    online=True,
                    password_is_set=False
                )
            authenticate(request, username=user.username)
            if not user.is_authenticated:
                response = HttpResponseRedirect(f"{URL}/login")
                response.set_cookie('loginSuccess', 'false', max_age=30, samesite='Lax')
                return response
            login(request, user)
            if not user.enabeld_2fa:
                user.is_already_logged = True
                user.save()
                response = HttpResponseRedirect(f'{URL}/profile')
                response.set_cookie('loginSuccess', 'true', max_age=30, samesite='Lax')
            if user.enabeld_2fa:
                HttpResponseRedirect(f"{URL}/twofa")
                response.set_cookie('loginSuccess', 'twofa', max_age=30, samesite='Lax')
            response = setTokens(response, user)
            user_data = GoogleUserSerializer(user).data
            response.data = user_data
            return response
        except ValueError:
            return HttpResponseRedirect(f"{URL}/login")

# Login View
class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
            
            user = authenticate(username=user.username, password=password)
            if user is not None:
                login(request, user)
                if not user.avatar_url:
                    avatar_url = host_qrcode('/app/avatars/default.png')
                    user.avatar_url = avatar_url
                if not user.enabeld_2fa:
                    user.is_already_logged = True
                response = Response(status=status.HTTP_200_OK)
                if user.enabeld_2fa:
                    response.set_cookie('loginSuccess', 'twofa', max_age=30, samesite='Lax')
                    HttpResponseRedirect(f"{URL}/twofa")
                user.save()
                response = setTokens(response, user)
                return response
            else:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# get all users
class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get_queryset(self):
        search = self.request.GET.get('search')
        username = self.request.GET.get('username')
        if search:
            result_users = CustomUser.objects.filter(Q(username__icontains=search) | Q(full_name__icontains=search))
            blocked_by_users = CustomUser.objects.filter(blocked_users=self.request.user)
            blocked_users = self.request.user.blocked_users.all()
            friends = self.request.user.friends.all()
            return result_users.exclude(username__in=blocked_by_users.all().values_list('username', flat=True)).exclude(username__in=blocked_users.all().values_list('username', flat=True)).exclude(username__in=friends.all().values_list('username', flat=True)).filter(Q(is_active=True) & Q(is_bot=False))
        return CustomUser.objects.filter(Q(is_active=True) & Q(is_bot=False))

class FriendsListView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        friends = user.friends.all()
        serializer = FriendListSerializer(friends, many=True)
        return Response(serializer.data)

class BlockListView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        blocked_users = user.blocked_users.all()
        blocked_by_users = CustomUser.objects.filter(blocked_users=user)
        serializer = BlockedUserSerializer(blocked_users, many=True)
        blocked_by_serializer = BlockedUserSerializer(blocked_by_users, many=True)
        return Response({'blocked_users': serializer.data, 'blocked_by_users': blocked_by_serializer.data})

class GetUser(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.GET.get('username')
        if username:
            try:
                user = CustomUser.objects.get(username=username)
                if user.is_active == False or user.username in request.user.blocked_users.all().values_list('username', flat=True):
                    return Response("User not found", status=status.HTTP_404_NOT_FOUND)
            except CustomUser.DoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)
            user_data = UserSerializer(user).data
            return Response(user_data, status=status.HTTP_200_OK)
        return Response("Username required", status=status.HTTP_400_BAD_REQUEST)

def generate_tokens(request):
    user = request.user
    refresh = RefreshToken.for_user(user)
    res = requests.post(f'{URL}api/auth/refresh/', data={'refresh': str(refresh),
    'X-CSRFToken': request.COOKIES.get('csrftoken')})
    if res.status_code != 200:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    tokens = res.json()
    access_token = tokens.get('access')
    response = Response(status=res.status_code)
    response.set_cookie(
        key='access',
        value=access_token,
        httponly=True,
        secure=True,
        samesite='Lax',
    )
    user = request.user
    user_data = UserSerializer(user).data
    response.data = user_data
    return response



class AuthenticatedUserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        access_token = request.COOKIES.get('access')
        try:
            decoded_access_token = jwt.decode(
                access_token,
                key=settings.SECRET_KEY,
                algorithms=["HS256"]
            )
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, jwt.DecodeError):
            return generate_tokens(request)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

# Logout View
class Logout(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_authenticated:
            logout(request)
            user.twofa_verified = False
            user.is_already_logged = False
            user.save()
            return delete_tokens(request, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

#enable 2fa
class EnableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        key, qrcode_url = twofactorAuth(user.username)
        user.twofa_secret = key
        user.qrcode_url = qrcode_url
        user.save()
        return Response(status=status.HTTP_200_OK)

#disable 2fa
class DisableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user.enabeld_2fa = False
        user.twofa_secret = None
        user.qrcode_url = None
        user.save()
        return Response(status=status.HTTP_200_OK)

#verify 2fa
class VerifyTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_code = request.data.get('code')

        if not user.twofa_secret:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = {'error': 'secret not found'} 
            return response

        totp = pyotp.TOTP(user.twofa_secret)

        if totp.verify(user_code):
            user.enabeld_2fa = True
            user.twofa_verified = not user.twofa_verified
            user.is_already_logged = True
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = {'error': 'Invalid code'}
            return response

#get cookies
class GetCookies(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Access cookies from the request
        cookies = request.COOKIES

        # You can format the cookies as needed
        cookie_data = {key: value for key, value in cookies.items()}
        return Response({'cookies': cookie_data}, status=200)

#update user Information
class UpdateUserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data
        serializer = UpdateUserSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        updated = False
        full_name = data.get('full_name')
        if full_name and full_name != user.full_name:
            user.full_name = full_name
            updated = True
        phone_number = data.get('phone_number')
        if phone_number and phone_number != user.phone_number:
            user.phone_number = phone_number
            updated = True
        city = data.get('city')
        if city and city != user.city:
            user.city = city
            updated = True
        address = data.get('address')
        if address and address != user.address:
            user.address = address
            updated = True
        if 'new_password' in data:
            password_change_response = self.change_password(user, data)
            if password_change_response is not None:
                return password_change_response
            updated = True
        if 'language' in data:
            language_change_response = self.change_language(user, data)
            if language_change_response:
                updated = True
        if 'color' in data and 'board_name' in data:
            color = data.get('color')
            board_name = data.get('board_name')
            user.color = color
            user.board_name = board_name
            updated = True
        if 'avatar' in request.FILES:
            file_url = self.upload_avatar(request)
            user.avatar_url = host_qrcode(f'/app{file_url}')
            os.remove(f'/app{file_url}')
            updated = True
        user_data = UpdateUserSerializer(user).data
        if updated:
            user.save()
        return Response(user_data, status=status.HTTP_200_OK)

#change password
    def change_password(self, user, data):
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        if not user.social_logged:
            if not user.check_password(current_password):
                response = Response(status=status.HTTP_400_BAD_REQUEST)
                response.data = 'Current password is incorrect'
                return response
        else:
            if user.password_is_set:
                if not user.check_password(current_password):
                    response = Response(status=status.HTTP_400_BAD_REQUEST)
                    response.data = 'Current password is incorrect'
                    return response
        if not new_password or not confirm_password:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = 'New password and confirm password are required'
            return response
        if new_password == current_password:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = 'New password cannot be the same as the current password'
            return response
        if new_password != confirm_password:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = 'Passwords do not match'
            return response
        user.set_password(new_password)
        if user.social_logged:
            user.password_is_set = True
        return None

    def change_language(self, user, data):
        language = data.get('language')
        if language:
            user.language = language
            return True
        return False
    
    def upload_avatar(self, request):
        file_obj = request.FILES.get('avatar')
        if not file_obj:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = 'No file provided'
            return response
        file_path = default_storage.save(f"avatars/{file_obj.name}", file_obj)
        file_url = default_storage.url(file_path)
        return file_url

class Delete_account(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        if not user.is_active:
            return Response({'error': 'User is already deleted'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

@async_to_sync
async def broadcast_msg(user, other_user, msg_type):
    channel_layer = get_channel_layer()
    room_group_name = f'chat_{user}'
    other_user_room_group_name = f'chat_{other_user}'
    await channel_layer.group_send(
        room_group_name,
        {
            'type': 'send_message',
            'msg_type': msg_type,
            'content': 'blocked',
            'id': -1,
            'conversation_id': -1,
            'sent_by_user': user
        }
    )
    await channel_layer.group_send(
        other_user_room_group_name,
        {
            'type': 'send_message',
            'msg_type': msg_type,
            'content': 'blocked',
            'id': -1,
            'conversation_id': -1,
            'sent_by_user': user
        }
    )

class block_user(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        username = data.get('username')
        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)
        if username == user.username:
            return Response({'error': 'You cannot block yourself'}, status=status.HTTP_400_BAD_REQUEST)
        if user.blocked_users.filter(username=username).exists():
            return Response({'error': 'User is already blocked'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            blocked_user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if (not blocked_user.is_active):
            return Response({'error': 'User deleted'}, status=status.HTTP_400_BAD_REQUEST)
        if user.friends.filter(username=username).exists():
            user.friends.remove(blocked_user)
        user.blocked_users.add(blocked_user)
        user.save()
        broadcast_msg(user.username, username, 'block')
        return Response({'info': f'{blocked_user.username} is blocked'}, status=status.HTTP_200_OK)

class unblock_user(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        username = data.get('username')
        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.blocked_users.filter(username=username).exists():
            return Response({'error': 'User is not blocked'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            blocked_user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if (not blocked_user.is_active):
            return Response({'error': 'User deleted'}, status=status.HTTP_400_BAD_REQUEST)
        user.blocked_users.remove(blocked_user)
        user.save()
        broadcast_msg(user.username, username, 'unblock')
        return Response({'info': f'{blocked_user.username} is unblocked'}, status=status.HTTP_200_OK)

class check_blocked(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        username = request.GET.get('username')
        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not CustomUser.objects.filter(username=username).exists():
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if (not CustomUser.objects.get(username=username).is_active):
            return Response({'error': 'User deleted'}, status=status.HTTP_400_BAD_REQUEST)
        if user.blocked_users.filter(username=username).exists():
            return Response({'blocked': True, 'blocker': user.username}, status=status.HTTP_200_OK)
        if CustomUser.objects.get(username=username).blocked_users.filter(username=user.username).exists():
            return Response({'blocked': True, 'blocker': username}, status=status.HTTP_200_OK)
        return Response({'blocked': False}, status=status.HTTP_200_OK)

class AnonymousUserViewSet(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            anonymous_user = CustomUser.objects.get(email=user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Anonymous user not found'}, status=status.HTTP_404_NOT_FOUND)
        response = Response(status=status.HTTP_200_OK)
        response.data = UserSerializer(anonymous_user).data
        return response

    def put(self, request):
        user = request.user
        try:
            anonymous_user = CustomUser.objects.get(email=user.email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'user not found'}, status=status.HTTP_404_NOT_FOUND)
        random_number = random.randint(1, 100000)
        anonymous_user.username = 'Anonymous' + str(random_number)
        anonymous_user.email = 'anonymous' + str(random_number) + '@gmail.com'
        anonymous_user.full_name = 'Anonymous' + str(random_number)
        anonymous_user.avatar_url = f'{URL}/avatars/anonym.jpg'
        anonymous_user.city = 'anonymous city'
        anonymous_user.address = 'anonymous address'
        anonymous_user.is_anonymous = True
        anonymous_user.save()
        response = delete_tokens(request, status=status.HTTP_200_OK)
        response.data = UserSerializer(anonymous_user).data
        return response

class UserStatusView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        username = request.GET.get('username')
        respone = Response()
        if not username:
            respone.data = 'username is required'
            respone.status = status.HTTP_400_BAD_REQUEST
            return respone
        respone.status = status.HTTP_200_OK
        respone.data = CustomUser.objects.get(username=username).online
        return respone
