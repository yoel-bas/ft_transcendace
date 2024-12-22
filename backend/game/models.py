
from django.db import models
from authentication.models import CustomUser
from django.utils.timezone import now


class Player(models.Model):
    username = models.CharField(max_length=100, default='')
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    topScore = models.IntegerField(default=0)
    currentXP = models.IntegerField(default=0)
    matchCount = models.IntegerField(default=0)
    tournamentCount = models.IntegerField(default=0)
    is_active = models.BooleanField(default=False)

class Match(models.Model):
    name = models.CharField(max_length=100, default='')
    player1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player1_in_match')
    player2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player2_in_match')
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    winer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='match_winner')
    match_date = models.DateField(auto_now_add=True)
    match_time = models.TimeField(auto_now_add=True) 