from rest_framework import serializers
from .models import TournamentDB
from authentication.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'level']
        
class TournamentSerializer(serializers.ModelSerializer):
    player1 = CustomUserSerializer()
    player2 = CustomUserSerializer()
    player3 = CustomUserSerializer()
    player4 = CustomUserSerializer()
    winer = CustomUserSerializer()
    
    class Meta:
        model = TournamentDB
        fields = ['id', 'name' ,'player1', 'player2', 'player3', 'player4', 'winer', 'tournament_date', 'tournament_time']