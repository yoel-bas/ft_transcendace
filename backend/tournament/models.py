from django.db import models
from authentication.models import CustomUser
from django.utils.timezone import now


class TournamentDB(models.Model):
    name = models.CharField(max_length=100, default='')
    player1 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player1_in_tournament')
    player2 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player2_in_tournament')
    player3 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player3_in_tournament')
    player4 = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='player4_in_tournament')
    winer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tournament_winner')
    tournament_date = models.DateField(auto_now_add=True)
    tournament_time = models.TimeField(auto_now_add=True)