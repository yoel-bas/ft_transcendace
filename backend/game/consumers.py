import json
import math 
import asyncio
from .models import Player, Match
from asgiref.sync import sync_to_async
from authentication.models import CustomUser
from channels.generic.websocket import AsyncWebsocketConsumer



class paddles:
    def __init__(self, x, y,width, height, speed, color, chan_name, playerNu, username):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color
        self.speed = speed
        self.chan_name = chan_name
        self.username = username
        self.playerNu = playerNu
        self.score = 0

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
            'color': self.color,
            'speed': self.speed,
            'chan_name': self.chan_name,
            'playerNu': self.playerNu,
            'username': self.username,
            'score': self.score
        }
        
class ball:
    def __init__(self, x, y, radius, dirrectionY, speed,color):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.directionX = 0
        self.directionY = dirrectionY
        self.speed = speed

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'radius': self.radius,
            'color': self.color,
            'directionX': self.directionX,
            'directionY': self.directionY,
            'speed': self.speed
        }

@sync_to_async
def check_block2(username1, username2):
    return CustomUser.objects.get(username=username1).blocked_users.filter(username=username2).exists()

class Game(AsyncWebsocketConsumer):

    players = []
    match_making = []
    paddles = {}
    player_match = {}
    games_invites = {}
    games_infor = {}
    games = {}
    Ball = {}
    matchs = {}
    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = None
        useRname = self.scope['user']
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'connection' or data['type'] == 'rematch':
            username = ''
            if data['type'] == 'rematch':
                user = self.scope["user"]
                username = user.username
            else:
                username = data['username']
            
            isPlaying = await sync_to_async(CustomUser.objects.get)(username=username)
            if isPlaying.is_playing:
                await self.send(text_data=json.dumps({
                    'type': 'is_playing',
                    'message': 'You are already playing a game'
                }))
                await self.close()
            else:
                await self.is_playing(username)
                existPlayer = await sync_to_async(Player.objects.filter(username=username).exists)()
                if not existPlayer:
                    await self.create_player(username)
                User = await self.get_user(username)
                self.player = {
                    'name': username,
                    'id': self.channel_name,
                    'image': User.avatar_url,
                    'player_number': '',
                    'player_id': '',
                    'group_name': ''
                }
                
                if data['type'] == 'invite':
                    Game.games_invites[self.player['name']] = self.player
                else:
                    Game.match_making.append(self.player)
                if len(Game.match_making) >= 2:
                    self.player['player_number'] = 'player2'
                else:
                    self.player['player_number'] = 'player1'
                await self.send(text_data=json.dumps({
                    'type': 'connection',
                    'player': self.player
                }))
                if data['type'] == 'invite':
                    await self.invite_game(data) 
                else:
                    await self.matchmaking(data)
        if data['type'] == 'move':
            game_channel = data.get('game_channel')
            player_id = self.player.get('player_id')
            if game_channel in self.games and player_id in self.games[game_channel]:
                if data['direction'] == 'right':
                    if (self.games[game_channel][player_id].x + self.games[game_channel][player_id].width + self.games[game_channel][player_id].speed > 1):
                        self.games[game_channel][player_id].x = 1 - self.games[game_channel][player_id].width
                    else:
                        self.games[game_channel][player_id].x += self.games[game_channel][player_id].speed
                if data['direction'] == 'left':
                    if self.games[game_channel][player_id].x - self.games[game_channel][player_id].speed > 0:
                        self.games[game_channel][player_id].x -= self.games[game_channel][player_id].speed
                    else:
                        self.games[game_channel][player_id].x = 0
                
                await self.channel_layer.group_send(
                    game_channel,
                    {
                        'type': 'paddle_update',
                        'paddle': self.games[game_channel][player_id].to_dict(),
                        'playernumber': self.games[game_channel][player_id].playerNu,
                    }
                )
        if data['type'] == 'playerReady':
            if data['game_roum'] not in self.player_match:
                self.player_match[data['game_roum']] = []
            self.player_match[data['game_roum']].append(self.player)
            if len(self.player_match[data['game_roum']]) == 2:
                await self.channel_layer.group_send(
                    data['game_roum'],
                    {
                        'type': 'go_to_game',
                    })
        if data['type'] == 'game_started':
            if data['data']['groupname'] not in self.matchs:
                    self.matchs[data['data']['groupname']] = []
            self.matchs[data['data']['groupname']].append(data['data'])
            if len(self.matchs[data['data']['groupname']]) == 2:
                match_name = data['data']['groupname']
                player1 = self.matchs[data['data']['groupname']][0]
                player2 = self.matchs[data['data']['groupname']][1]
                self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'])
                self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'])
                self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2/data['data']['Walls']['wallsHeight'], data['data']['dirY'], data['data']['sp'] ,'white')
                self.games[match_name] = {
                    'player1' : self.paddles['player1'],
                    'player2' : self.paddles['player2'],
                    'ball' : self.Ball,
                }
                game_serialized = {
                    'player1': self.games[match_name]['player1'].to_dict(),
                    'player2': self.games[match_name]['player2'].to_dict(),
                    'ball': self.games[match_name]['ball'].to_dict()
                }
                await self.channel_layer.group_send(
                    match_name,
                    {
                        'type': 'start_game',
                        'players': [player1, player2],
                        'name_channel': match_name,
                        'game_serialized': game_serialized,  
                    }
                ) 
                asyncio.create_task(self.update_ball_loop(match_name))
            
        if data['type'] == 'gameOver':
            user = user = self.scope["user"]
            await self.is_not_playing(user.username)
            winer = {'username': '', 'channel_id': ''}
            loser = {'username': '', 'channel_id': ''}
            if self.player:
                if self.player['group_name'] in Game.games_infor:
                    game = Game.games_infor[self.player['group_name']]
                    if self.player['player_id'] == 'player1':
                        if 'player1' in game and 'player2' in game:
                            winer = game['player2']
                            loser = game['player1']
                    else:
                        if 'player1' in game and 'player2' in game:
                            winer = game['player1']
                            loser = game['player2']
                    if winer and loser and 'image' in winer and 'image' in loser:
                        winer_image = winer['image']
                        loser_image = loser['image']
                        await self.gameOver(self.player['group_name'],  winer['username'], loser['username'], winer['channel_id'], loser['channel_id'], 3, 3, 0, winer_image, loser_image)
            
        
        if data['type'] == 'update_ball':
            self.Ball.x += self.Ball.directionX
            self.Ball.y += self.Ball.directionY
            await self.channel_layer.group_send(
                data['game_channel'],
                {
                    'type': 'update_ball',
                    'ball': self.Ball.to_dict()
                }
            )
    async def disconnect(self, close_code):
        winer = {'username': '', 'channel_id': ''}
        loser = {'username': '', 'channel_id': ''}
        user = self.scope["user"]
        await self.is_not_playing(user.username) 
        Game.match_making = [player for player in Game.match_making if player['name'] != user.username]
        if self.player:
            if self.player['group_name'] in Game.games_infor:
                game = Game.games_infor[self.player['group_name']]
                if self.player['player_id'] == 'player1':
                    if 'player1' in game and 'player2' in game:
                        winer = game['player2']
                        loser = game['player1']
                else:
                    if 'player1' in game and 'player2' in game:
                        winer = game['player1']
                        loser = game['player2']
                if winer and loser and 'image' in winer and 'image' in loser:
                    winer_image = winer['image']
                    loser_image = loser['image']
                    await self.gameOver(self.player['group_name'],  winer['username'], loser['username'], winer['channel_id'], loser['channel_id'], 3, 3, 0, winer_image, loser_image)

    async def matchmaking(self, data):
        if len(Game.match_making) >= 2:
            player1 = Game.match_making.pop(0)
            player1['player_id'] = 'player1'
            player2 = Game.match_making.pop(0)
            player2['player_id'] = 'player2'
            count = await Match.objects.acount()
            count += 1
            self.game_channel = f'game{player1["name"]}vs{player2["name"]}_{count}'
            player1['group_name'] = self.game_channel
            player2['group_name'] = self.game_channel
            if self.game_channel not in Game.games_infor:
                Game.games_infor[self.game_channel] = []
            Game.games_infor[self.game_channel] = {
                'player1': {"username": player1['name'], "channel_id": player1['id'], "image": player1['image']},
                'player2': {"username": player2['name'], "channel_id": player2['id'], "image": player2['image']}
            }
            await self.update_matchCount(player1['name'])
            await self.update_matchCount(player2['name'])
            await self.create_match(player1['name'], player2['name'], self.game_channel)
            await self.channel_layer.group_add(
                self.game_channel,
                player1['id']
            )

            await self.channel_layer.group_add(
                self.game_channel,
                player2['id']
            )
            await self.channel_layer.group_send(
                self.game_channel,
                {
                    'type': 'match_ready',
                    'players': [player1, player2],
                    'game_channel': self.game_channel,
                }
            )

 
    async def invite_game(self, data):
        if len(Game.games_invites) >= 2:
            player1 = Game.games_invites[data['sender']]
            player2 = Game.games_invites[data['receiver']]
            player1['player_id'] = 'player1'
            player2['player_id'] = 'player2'
            self.game_channel = f'game{player1["name"]}vs{player2["name"]}'
            player1['group_name'] = self.game_channel
            player2['group_name'] = self.game_channel
            await self.channel_layer.group_add(
                    self.game_channel,
                    player1['id']
                )

            await self.channel_layer.group_add(
                self.game_channel,
                player2['id']
            )
            await self.channel_layer.group_send(
                self.game_channel,
                {
                    'type': 'match_ready',
                    'players': [player1, player2],
                    'game_channel': self.game_channel,
                }
            )
            Game.games_invites[data['sender']] = None
            Game.games_invites[data['receiver']] = None
    
        
    
    async def colletion(self, player, ball):
        topBall  = ball.y - ball.radius
        topPadd = player.y
        
        leftBall = ball.x - ball.radius
        leftPadd = player.x
        
        rightBall = ball.x + ball.radius
        rightPadd = player.x + player.width
        
        bottomBall = ball.y + ball.radius
        bottomPadd = player.y + player.height
        return (topBall < bottomPadd and leftBall < rightPadd and rightBall > leftPadd and bottomBall > topPadd)
    
    async def handleCollision(self, player, ball):
        colPoint = ball.x - (player.x + player.width/2)
        colPoint = colPoint / (player.width/2)
        angle = colPoint * (math.pi /4)
        direc = 1 if ball.y < 0.5 else -1
        
        ball.directionY = direc * ball.speed * math.cos(angle)
        ball.directionX = ball.speed * math.sin(angle)
    async def update_ball_loop(self, game_channel):
        await asyncio.sleep(3)
        while True:
            if game_channel in self.games:
                if 'ball' not in self.games[game_channel]:
                    break
                self.games[game_channel]['ball'].x += self.games[game_channel]['ball'].directionX
                self.games[game_channel]['ball'].y += self.games[game_channel]['ball'].directionY
                if await self.colletion(self.games[game_channel]['player1'], self.games[game_channel]['ball']):
                    await self.handleCollision(self.games[game_channel]['player1'], self.games[game_channel]['ball'])
                if await self.colletion(self.games[game_channel]['player2'], self.games[game_channel]['ball']):
                    await self.handleCollision(self.games[game_channel]['player2'], self.games[game_channel]['ball'])
                if self.games[game_channel]['ball'].x <= 0:
                    self.games[game_channel]['ball'].x = 0
                    self.games[game_channel]['ball'].directionX *= -1
                if self.games[game_channel]['ball'].x + self.games[game_channel]['ball'].radius >= 1:
                    self.games[game_channel]['ball'].x = 1 - self.games[game_channel]['ball'].radius
                    self.games[game_channel]['ball'].directionX *= -1
                if self.games[game_channel]['ball'].y <= 0:
                    self.games[game_channel]['ball'].directionX = 0
                    self.games[game_channel]['ball'].y = 0.5
                    self.games[game_channel]['ball'].x = 0.5
                    self.games[game_channel]['ball'].directionY *= -1
                    self.games[game_channel]['player1'].score += 1
                    if self.games[game_channel]['player1'].score == 6:
                        winer = self.games[game_channel]['player1'] 
                        loser = self.games[game_channel]['player2']
                        Tscore = winer.score - loser.score
                        game = Game.games_infor[game_channel]
                        winerimage = game['player1']
                        loserimage = game['player2']
                        winerImage = winerimage['image'] 
                        loserImage = loserimage['image']
                        await self.gameOver(game_channel, winer.username, loser.username, winer.chan_name, loser.chan_name, Tscore, winer.score, loser.score, winerImage, loserImage)
                        break
                if self.games[game_channel]['ball'].y >= 1:
                    self.games[game_channel]['ball'].directionX = 0
                    self.games[game_channel]['ball'].y = 0.5
                    self.games[game_channel]['ball'].x = 0.5
                    self.games[game_channel]['ball'].directionY *= -1
                    self.games[game_channel]['player2'].score += 1
                    if self.games[game_channel]['player2'].score == 6:
                        winer = self.games[game_channel]['player2']
                        loser = self.games[game_channel]['player1']
                        game = Game.games_infor[game_channel]
                        winerimage = game['player2']
                        loserimage = game['player1']
                        winerImage = winerimage['image']
                        loserImage = loserimage['image']
                        Tscore = winer.score - loser.score
                        await self.gameOver(game_channel, winer.username, loser.username, winer.chan_name, loser.chan_name, Tscore, winer.score, loser.score, winerImage, loserImage)
                        break
                await self.channel_layer.group_send(   
                    game_channel,
                    {
                        'type': 'update_ball',
                        'ball': self.games[game_channel]['ball'].to_dict(),
                        'player1': self.games[game_channel]['player1'].to_dict(),
                        'player2': self.games[game_channel]['player2'].to_dict()
                    }
                )
                await asyncio.sleep(1/40)
    
    async def gameOver(self, game_chan ,winer, loser, chan_name1, chan_name2, Tscore, scoreWiner, scoreLoser, winerImage, loserImage):
        await self.top_score(winer, Tscore)
        await self.update_xp(winer, 100)
        await self.update_xp(loser, 50)
        await self.update_winner(winer)
        await self.update_loser(loser)
        await self.is_not_playing(winer)
        await self.is_not_playing(loser)
        await self.Update_matches(loser, winer, scoreLoser, scoreWiner, game_chan)
        if game_chan in self.player_match:
            self.player_match[game_chan].clear()
        if game_chan in self.matchs:
            self.matchs[game_chan].clear()
        if game_chan in self.games:
            self.games[game_chan].clear()
        await self.channel_layer.group_send(
            game_chan,
            {
                'type': 'game_over',
                'scoreWiner': scoreWiner,
                'scoreLoser': scoreLoser,
                'winerImage': winerImage,
                'loserImage': loserImage,
                'winner': winer
            }
        )
        await self.channel_layer.group_discard(
            game_chan,
            chan_name1
        )
        await self.channel_layer.group_discard(
            game_chan,
            chan_name2
        )
        if game_chan in self.games_infor:
            self.games_infor[game_chan].clear()
        if game_chan in self.games:
            self.games[game_chan].clear()
        
    
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'players': event['players'],
            'name_channel': event['name_channel'],
            'game_serialized': event['game_serialized']
        }))

    async def match_ready(self, event):
        await self.send(text_data=json.dumps({
            'type': 'match_ready',
            'players': event['players'],
            'game_channel': event['game_channel']
        }))
        
    async def go_to_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'go_to_game',
        }))

    async def paddle_update(self, event):
        paddle_data = event['paddle']
        playernumber = event['playernumber']
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'paddle': paddle_data,
            'playernumber': playernumber
        }))
    
    async def update_ball(self, event):
        ball_data = event['ball']
        await self.send(text_data=json.dumps({
            'type': 'update_ball',
            'ball': ball_data,
            'player1': event['player1'],
            'player2': event['player2']
        }))

    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'scoreWiner': event['scoreWiner'],
            'scoreLoser': event['scoreLoser'],
            'winerImage': event['winerImage'],
            'loserImage': event['loserImage'],
            'winner': event['winner']
        }))
    

    @sync_to_async
    def create_player(self, username):
        Player.objects.create(
                username=username,
                wins=0,
                loses=0,
                topScore=0,
                currentXP=0,
                matchCount=0,
                tournamentCount=0,
                is_active=True
            )


    @sync_to_async
    def update_matchCount(self, username):
        player = CustomUser.objects.get(username=username)
        player.matches += 1
        player.save()
        
    @sync_to_async
    def get_user(self, username):
        try:
            return CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return None

    @sync_to_async
    def is_user_blocked(self, user, username):
        return user.blocked_users.filter(username=username).exists()

    @sync_to_async
    def is_playing(self, username):
        player = CustomUser.objects.get(username=username)
        player.is_playing = True
        player.save()
        
        
    @sync_to_async
    def is_not_playing(self, username):
        player = CustomUser.objects.get(username=username)
        player.is_playing = False
        player.save()

        
    @sync_to_async
    def update_winner(self, username):
        player = CustomUser.objects.get(username=username)
        player.wins += 1
        player.save()
        
    @sync_to_async
    def update_loser(self, username):
        player = CustomUser.objects.get(username=username)
        player.losses += 1
        player.save()

    @sync_to_async 
    def top_score(self, username, score):
        player = CustomUser.objects.get(username=username)
        if player.top_score < score:
            player.top_score = score
            player.save()
    

    @sync_to_async
    def create_match(self, username1 , username2, nameMatch):
        player1 = CustomUser.objects.get(username=username1)
        player2 = CustomUser.objects.get(username=username2)
        mAtch = Match.objects.create(
            name=nameMatch,
            player1=player1,
            player2=player2,
            score1=0,
            score2=0,
            winer=player1
        )
        
    @sync_to_async
    def Update_matches(self, username1, username2, score1, score2, nameMatch):
        loser = CustomUser.objects.get(username=username1)
        winer = CustomUser.objects.get(username=username2)
        try:
            match = Match.objects.filter(name=nameMatch).first()
            if loser.username == match.player1.username:
                match.score1 = score1
                match.score2 = score2
            else:
                match.score2 = score1
                match.score1 = score2
            match.winer = winer
            match.save()
        except Match.DoesNotExist:
            print("Match does not exist")
            
    @sync_to_async
    def update_xp(self, username, xp):
        player = CustomUser.objects.get(username=username)
        player.current_xp += xp
        while player.current_xp >= player.target_xp:
            player.level += 1
            player.current_xp -= player.target_xp
            player.target_xp = (player.level * (player.level + 1) // 2) * 100
        player.save()
