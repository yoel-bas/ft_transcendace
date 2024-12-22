from django.core.management.base import BaseCommand
from authentication.models import CustomUser

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        bot_full_name = 'AlienPong Bot'
        bot_username = 'alienpong_bot'
        bot_email = 'alienpong@aliens.com'
        bot_password = 'alien123'
        bot_avatar_url = 'https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vZDgwOTAzNmEtNzg4Yy00YzU5LWI4N2QtNTVlMTA3MmQyM2Y5LmpwZWc.webp'

        if not CustomUser.objects.filter(username=bot_username).exists():
            CustomUser.objects.create_user(
                full_name=bot_full_name,
                username=bot_username,
                email=bot_email,
                password=bot_password,
                avatar_url=bot_avatar_url,
                is_bot=True
            )
