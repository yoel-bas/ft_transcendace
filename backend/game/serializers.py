from rest_framework import serializers
from .models import Player, Match
from authentication.models import CustomUser

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'avatar_url', 'level', 'top_score', 'current_xp', 'online',  'is_playing']       

class MatchSerializer(serializers.ModelSerializer):
    player1 = CustomUserSerializer()
    player2 = CustomUserSerializer()
    winer = CustomUserSerializer()
    
    class Meta:
        model = Match
        fields = ['id', 'name',  'player1', 'player2', 'score1', 'score2', 'winer', 'match_date', 'match_time']