from django.contrib.auth.models import AbstractUser as BaseUser
from django.db import models
from django.core.validators import RegexValidator

phone_regex = RegexValidator(
    regex=r'^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$'
)


class CustomUser(BaseUser):
    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('fr', 'French'),
        ('es', 'Spanish'),
    )

    BOARD_CHOICES = (
        ('df', 'Default'),
        ('bd1', 'board1'),
        ('bd2', 'board2'),
    )

    full_name = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, default='06-00-00-00-00', validators=[phone_regex])
    city = models.CharField(max_length=20, blank=True, default='Khouribga')
    address = models.CharField(max_length=20, blank=True, default='1337 school')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en', error_messages={'invalid': 'Please select a valid language'})
    color = models.CharField(max_length=7, blank=True, null=True, default='#0B4464')
    board_name = models.CharField(max_length=3, choices=BOARD_CHOICES, default='df', error_messages={'invalid': 'Please select a valid board'})
    tournament_name = models.CharField(max_length=20, blank=True, null=True)
    is_already_logged = models.BooleanField(default=False)
    tournament_score = models.IntegerField(default=0)
    ## 2FA fields
    enabeld_2fa = models.BooleanField(default=False)
    twofa_secret = models.CharField(max_length=32, blank=True, null=True)
    twofa_verified = models.BooleanField(default=False)
    qrcode_path = models.CharField(max_length=100, blank=True, null=True)
    qrcode_url = models.URLField(max_length=200, blank=True, null=True)
    avatar_url = models.URLField(max_length=200, blank=True, null=True)
    social_logged = models.BooleanField(default=False)
    password_is_set = models.BooleanField(default=False)
    level = models.IntegerField(default=0)
    matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    profile_visited = models.IntegerField(default=0)
    friends_count = models.IntegerField(default=0)
    top_score = models.IntegerField(default=0)
    tournaments = models.IntegerField(default=0)
    online_matches = models.IntegerField(default=0)
    offline_matches = models.IntegerField(default=0)
    current_xp = models.IntegerField(default=0)
    target_xp = models.IntegerField(default=100)
    online = models.BooleanField(default=False)
    connection_count = models.IntegerField(default=0)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    blocked_users = models.ManyToManyField("self", symmetrical=False, blank=True)
    anonymous = models.BooleanField(default=False)
    is_playing = models.BooleanField(default=False)
    is_bot = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']


    def __str__(self):
        return self.username

    class Meta:
        db_table = 'users'
        verbose_name_plural = 'users'
