import json
import re
import math
import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from authentication.models import CustomUser
from .models import TournamentDB
from django.shortcuts import get_object_or_404
from channels.db import database_sync_to_async
from chat.models import conversation, message
from asgiref.sync import async_to_sync

class paddles:
    def __init__(self, x, y,width, height, speed, color, chan_name, playerNu, username, N_tour):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color
        self.speed = speed
        self.chan_name = chan_name
        self.username = username
        self.playerNu = playerNu
        self.playernambertour = N_tour
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
            'playernambertour': self.playernambertour,
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

def is_valid_player_name(name):
    pattern = r'^[A-Za-z0-9._-]{1,9}$'
    return re.match(pattern, name) is not None



def check_conversation_exists(user1, user2):
    try:
        conversation.objects.get(user1_id=user1, user2_id=user2)
        return True
    except conversation.DoesNotExist:
        return False

def create_conversation(user1, user2, last_message=None):
    return conversation.objects.create(user1_id=user1, user2_id=user2, last_message=last_message)

def create_message(conversation, sender, receiver, content):
    return message.objects.create(conversation_id=conversation, sender_id=sender, receiver_id=receiver, content=content)

def get_conversation(user1, user2):
    return conversation.objects.get(user1_id=user1, user2_id=user2)

@database_sync_to_async
def save_bot_message(username1, username2, is_final=False):
    bot = CustomUser.objects.get(username='alienpong_bot')
    user1 = CustomUser.objects.get(username=username1)
    user2 = CustomUser.objects.get(username=username2)
    conv = None
    if is_final:
        message = f'You will play against {user2.full_name} in the final match. Good luck!'
    else:
        message = f'You will play against {user2.full_name} in the tournament. Good luck!'
    if check_conversation_exists(bot, user1) == False:
        conv = create_conversation(bot, user1, message)
    else:
        conv = get_conversation(bot, user1)
    msg = create_message(conv, bot, user1, message)
    conv.last_message = msg.content
    return msg

class Tournament(AsyncWebsocketConsumer):

    players = []
    Tournaments = {}
    tour_players = []
    players_tournament = []
    games_infor = {}
    match1 = {}
    match2 = {}
    final_players = {}
    final_match = {}
    players_final = {}
    paddles = {}
    games = {}
    Ball = {}

    async def connect(self):
        self.user = self.scope['user']
        await self.accept()
        self.player = None
        self.game_channel = None
        self.group_name_tournament = ""
        
    async def broadcast_message(self, message):
        chat_room_group_name = f'chat_{message.receiver_id.username}'
        notif_room_group_name = f'notif_{message.receiver_id.username}'
        id  = message.id
        conversation_id = message.conversation_id.id
        sent_by_user = message.sender_id.username
        content = message.content

        await self.channel_layer.group_send(
            chat_room_group_name,
            {
                'type': 'send_message',
                'msg_type': 'message',
                'id': id,
                'conversation_id': conversation_id,
                'sent_by_user': sent_by_user,
                'content': content
            }
        )
        await self.channel_layer.group_send(
            notif_room_group_name,
            {
                'type': 'send_notification',
                'notif_type': 'players_warning',
                'id': None,
                'sender': sent_by_user,
                'receiver': message.receiver_id.username,
                'title': 'Players warning',
                'description': content
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'connection':
            User = await self.get_user(self.scope["user"])
            if not is_valid_player_name(data['playerName']):
                await self.send(text_data=json.dumps({
                    'type': 'error_valid_name',
                    'message': 'Invalid player name',
                    'player': data['playerName']
                }))
                return
            isPlaying = await sync_to_async(CustomUser.objects.get)(username=User.username)
            if isPlaying.is_playing:
                await self.send(text_data=json.dumps({
                    'type': 'connection',
                    'message': 'player_exist',
                    'player': data['playerName']
                }))
                return
            if not any(player['usernameDB'] == User.username for player in Tournament.players_tournament):
                self.player = {
                    'name': data['playerName'],
                    'usernameDB': data['username'], 
                    'id': self.channel_name,
                    'image': User.avatar_url,
                    'player_id': '',
                    'numberplayer': '',
                    'group_name': '',
                    'game_channel': '',
                }
                await self.is_playing(User.username)
                self.players.append(self.player)
                Tournament.players_tournament.append(self.player)
                if len(Tournament.players_tournament) % 2 != 0:
                    self.player['player_id'] = 'player1'
                else:
                    self.player['player_id'] = 'player2'
                self.player['numberplayer'] = f'player{len(Tournament.players_tournament)}'
                await self.send(text_data=json.dumps({
                    'type': 'connection',
                    'message': 'User connected',
                    'player': self.player,
                }))
                await self.channel_layer.group_add(
                        Tournament.players_tournament[0]['usernameDB'],  
                        self.player['id']
                    )
                await self.channel_layer.group_send(
                    Tournament.players_tournament[0]['usernameDB'],
                    {
                        'type': 'player_number',
                        'number_of_number': len(Tournament.players_tournament)
                    }
                )
                if len(Tournament.players_tournament) >= 4:
                    for player in Tournament.players_tournament:
                        self.group_name_tournament += f'{player["name"]}'
                    count = await (sync_to_async(TournamentDB.objects.count)())
                    self.group_name_tournament += f'_{count}'
                    for _ in range(4):
                        player = Tournament.players_tournament.pop(0)
                        Tournament.tour_players.append(player)
                        player['group_name'] = self.group_name_tournament
                        await self.channel_layer.group_add(
                            self.group_name_tournament,  
                            player['id']
                        )
                    Tournament.Tournaments[self.group_name_tournament] = {
                        'player1': self.tour_players[0],
                        'player2': self.tour_players[1],
                        'player3': self.tour_players[2],
                        'player4': self.tour_players[3],
                    }
                    await self.channel_layer.group_send(
                        self.group_name_tournament,  
                        {
                            'type': 'tournament_start',
                            'players': self.tour_players
                        }
                    )
                    """"
                        self.tour_players[0]['usernameDB'] play with self.tour_players[1]['usernameDB']
                        self.tour_players[2]['usernameDB'] play with self.tour_players[3]['usernameDB']
                    """  

                    message1 = await save_bot_message(self.tour_players[0]['usernameDB'], self.tour_players[1]['usernameDB'])
                    message2 = await save_bot_message(self.tour_players[1]['usernameDB'], self.tour_players[0]['usernameDB'])
                    message3 = await save_bot_message(self.tour_players[2]['usernameDB'], self.tour_players[3]['usernameDB'])
                    message4 = await save_bot_message(self.tour_players[3]['usernameDB'], self.tour_players[2]['usernameDB'])
                    await self.broadcast_message(message1)
                    await self.broadcast_message(message2)
                    await self.broadcast_message(message3)
                    await self.broadcast_message(message4)
                    await self.create_tournament(self.tour_players[0]['usernameDB'], self.tour_players[1]['usernameDB'], self.tour_players[2]['usernameDB'], self.tour_players[3]['usernameDB'],  self.group_name_tournament)
                    self.tour_players.clear()
            else:
                await self.send(text_data=json.dumps({
                    'type': 'connection',
                    'message': 'player_exist',
                    'player': data['playerName']
                }))
            
        if data['type'] == 'move':
            game_channel = data['game_channel']
            player_id = self.player['player_id']
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
        if data['type'] == 'qualified':
            winerGame = await self.return_player_obj(data['data']['winer'], data['groupname'])
            if data['groupname'] not in Tournament.players_final:
                Tournament.players_final[data['groupname']] = []
            Tournament.players_final[data['groupname']].append(data['data'])
            if len(Tournament.players_final[data['groupname']]) == 2:
                username1 = self.get_usernames(data['groupname'], Tournament.players_final[data['groupname']][0]['winer'])
                username2 = self.get_usernames(data['groupname'], Tournament.players_final[data['groupname']][1]['winer'])
                message1 = await save_bot_message(username1, username2, True)
                message2 = await save_bot_message(username2, username1, True)
                await self.broadcast_message(message1)
                await self.broadcast_message(message2)
            if data['final_tournament'] == True:
                await self.channel_layer.group_send(
                    data['groupname'],
                    {
                        'type': 'update_state',
                        'players': data['data'],
                        'image': winerGame['image'],
                        'final_tournament': True
                    } 
                )
            elif len(Tournament.players_final[data['groupname']]) == 2:
                await self.channel_layer.group_send(
                    data['groupname'],
                    {
                        'type': 'update_state',
                        'players': Tournament.players_final[data['groupname']],
                        'image': winerGame['image'],
                        'final_tournament': False
                    }
                )
    
        if data['type'] == 'match_tour':
            if data['data']['qualified'] == True: 
                if data['data']['groupname'] not in self.final_match:
                    self.final_match[data['data']['groupname']] = []
                self.final_match[data['data']['groupname']].append(data['data'])
                if data['data']['playernambre'] == 'player1' or data['data']['playernambre'] == 'player2':
                    self.player['player_id'] = 'player1'
                else:
                    self.player['player_id'] = 'player2'
                if len(self.final_match[data['data']['groupname']]) == 1:
                    asyncio.create_task(self.wait_for_player2(self.final_match[data['data']['groupname']], data['data']['groupname'], True))
                if len(self.final_match[data['data']['groupname']]) == 2:
                    match_name = f"{self.final_match[data['data']['groupname']][0]['username']}vs{self.final_match[data['data']['groupname']][1]['username']}"
                    p1 = self.final_match[data['data']['groupname']][0]['playernambre'] 
                    p2 = self.final_match[data['data']['groupname']][1]['playernambre']
                    tourn = Tournament.Tournaments[data['data']['groupname']]
                    if p1 == 'player1' or p1 == 'player2':
                        player1 = tourn[p1]
                        player2 = tourn[p2]
                    else:
                        player1 = tourn[p2]
                        player2 = tourn[p1]
                    player1['game_channel'] = match_name
                    player2['game_channel'] = match_name
                    if match_name not in self.games_infor:
                        Tournament.games_infor[match_name] = []
                    Tournament.games_infor[match_name] = {
                        'player1': {"name": player1['name'], "channel_id": player1['id'], "image": player1['image'], "chanel_game": match_name},
                        'player2': {"name": player2['name'], "channel_id": player2['id'], "image": player2['image'], "chanel_game": match_name},
                        'final_tournament': True
                    }
                    await self.channel_layer.group_add(
                        match_name,
                        self.final_match[data['data']['groupname']][0]['id_channel']
                    )
                    await self.channel_layer.group_add(
                        match_name,
                        self.final_match[data['data']['groupname']][1]['id_channel']
                    )
                    if data['data']['playerNumber'] == 'player4' or data['data']['playerNumber'] == 'player3':
                        player1 = self.final_match[data['data']['groupname']][0]
                        player2 = self.final_match[data['data']['groupname']][1]
                    else:
                        player1 = self.final_match[data['data']['groupname']][1]
                        player2 = self.final_match[data['data']['groupname']][0]
                    self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'], player1['playerNumber'])
                    self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'], player2['playerNumber'])
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
                    asyncio.create_task(self.update_ball_loop(match_name, True, data['data']['groupname']))
            elif data['data']['playerNumber'] == 'player1' or data['data']['playerNumber'] == 'player2':
                if data['data']['groupname'] not in self.match1:
                    self.match1[data['data']['groupname']] = []
                self.match1[data['data']['groupname']].append(data['data'])
                if len(self.match1[data['data']['groupname']]) == 2:
                    match_name = f"{self.match1[data['data']['groupname']][0]['username']}vs{self.match1[data['data']['groupname']][1]['username']}"
                    tourn = Tournament.Tournaments[data['data']['groupname']]
                    player1 = tourn['player1']
                    player2 = tourn['player2']
                    player1['game_channel'] = match_name
                    player2['game_channel'] = match_name
                    if match_name not in self.games_infor:
                        Tournament.games_infor[match_name] = []
                    
                    Tournament.games_infor[match_name] = {
                        'player1': {"name": player1['name'], "channel_id": player1['id'], "image": player1['image'], "chanel_game": match_name},
                        'player2': {"name": player2['name'], "channel_id": player2['id'], "image": player2['image'], "chanel_game": match_name},
                        'final_tournament': False
                    }
                    await self.channel_layer.group_add(
                        match_name,
                        self.match1[data['data']['groupname']][0]['id_channel']
                    )
                    await self.channel_layer.group_add(
                        match_name,
                        self.match1[data['data']['groupname']][1]['id_channel']
                    )
                    if data['data']['playerNumber'] == 'player1':
                        player1 = self.match1[data['data']['groupname']][1]
                        player2 = self.match1[data['data']['groupname']][0]
                    else:
                        player1 = self.match1[data['data']['groupname']][0]
                        player2 = self.match1[data['data']['groupname']][1]
                    self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'], player1['playerNumber'])
                    self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'], player2['playerNumber'])
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
                    asyncio.create_task(self.update_ball_loop(match_name, False, data['data']['groupname']))
            elif data['data']['playerNumber'] == 'player3' or data['data']['playerNumber'] == 'player4':
                if data['data']['groupname'] not in self.match2:
                    self.match2[data['data']['groupname']] = []
                self.match2[data['data']['groupname']].append(data['data'])
                if len(self.match2[data['data']['groupname']]) == 2:
                    match_name = f"{self.match2[data['data']['groupname']][0]['username']}vs{self.match2[data['data']['groupname']][1]['username']}"
                    await self.channel_layer.group_add(
                        match_name,
                        self.match2[data['data']['groupname']][0]['id_channel']
                    )
                    await self.channel_layer.group_add(
                        match_name,
                        self.match2[data['data']['groupname']][1]['id_channel']
                    )
                    tourn = Tournament.Tournaments[data['data']['groupname']]
                    player1 = tourn['player3']
                    player2 = tourn['player4']
                    player1['game_channel'] = match_name
                    player2['game_channel'] = match_name
                    if match_name not in self.games_infor:
                        Tournament.games_infor[match_name] = []
                    Tournament.games_infor[match_name] = {
                        'player1': {"name": player1['name'], "channel_id": player1['id'], "image": player1['image'], "chanel_game": match_name},
                        'player2': {"name": player2['name'], "channel_id": player2['id'], "image": player2['image'], "chanel_game": match_name},
                        'final_tournament': False
                    }
                    if data['data']['playerNumber'] == 'player4':
                        player1 = self.match2[data['data']['groupname']][0]
                        player2 = self.match2[data['data']['groupname']][1]
                    else:
                        player1 = self.match2[data['data']['groupname']][1]
                        player2 = self.match2[data['data']['groupname']][0]
                    self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id_channel'], 1, player1['username'], player1['playerNumber'])
                    self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id_channel'], 2, player2['username'], player2['playerNumber'])
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
                    asyncio.create_task(self.update_ball_loop(match_name, False, data['data']['groupname']))
                    
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
        
    async def wait_for_player2(self, matchTour, game_group, finalMatch):
        await asyncio.sleep(4)
        if len(matchTour) < 2:
            game = Tournament.Tournaments[game_group]
            if finalMatch == True:
                if isinstance(winPla, list) and len(winPla) > 0 and isinstance(winPla[0], dict):
                    if winPla[0]['name'] == self.player['name']:
                        winer = game[self.player['numberplayer']]
                        loser = game[winPla[1]['numberplayer']]
                        await self.overGameTime(winer, loser, finalMatch)
                    else:
                        winer = game[winPla[0]['numberplayer']]
                        loser = game[self.player['numberplayer']]

                        await self.overGameTime(winer, loser, finalMatch)
            
            elif self.player:
                if self.player['numberplayer'] == 'player1':
                    winer = game['player1']
                    loser = game['player2']
                    await self.overGameTime(winer, loser, finalMatch)
                if self.player['numberplayer'] == 'player2':
                    winer = game['player2']
                    loser = game['player1']
                    await self.overGameTime(winer, loser, finalMatch)
                if self.player['numberplayer'] == 'player3':
                    winer = game['player3']
                    loser = game['player4']
                    await self.overGameTime(winer, loser, finalMatch)
                if self.player['numberplayer'] == 'player4':
                    winer = game['player4']
                    loser = game['player3']
                    await self.overGameTime(winer, loser, finalMatch)
                    
                    
    async def overGameTime(self, win, loser, final_tournament):
        match_name = f"{win['name']}{loser['name']}"               
        await self.channel_layer.group_add(
            match_name,
            win["id"]
        )
        await self.channel_layer.group_add(
            match_name,
            loser["id"]
        )
        await self.gameOver(match_name, win, final_tournament, self.player['group_name'], False)
            
    async def start_game(self, event):
        players = event['players']
        name_channel = event['name_channel']
        game_serialized = event['game_serialized']

        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'players': players,
            'name_channel': name_channel,
            'game_serialized': game_serialized,
        }))
        
        
    async def paddle_update(self, event):
        paddle_data = event['paddle']
        playernumber = event['playernumber']
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'paddle': paddle_data,
            'playernumber': playernumber
        }))
        
    async def player_number(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player_number',
            'number_of_number': event['number_of_number']
        }))



    async def disconnect(self, close_code):
        win = {'username': '', 'channel_id': ''}
        los = {'username': '', 'channel_id': ''}
        user = self.scope["user"]

        await self.is_not_playing(user.username)
        if self.player:
            game_channel = self.player.get('game_channel', None)
            if game_channel and game_channel in Tournament.games_infor:
                game = Tournament.games_infor[self.player['game_channel']]
                player1 = game.get('player1')
                player2 = game.get('player2')
                if player1 and player2:
                    if self.player['name'] == game['player1']['name']:
                        win = game['player2']
                        los = game['player1']
                        is_final = game['final_tournament']
                        winer = await self.return_player_obj(win['name'], self.player['group_name'])
                    else:
                        win = game['player1']
                        los = game['player2']
                        is_final = game['final_tournament']
                        winer = await self.return_player_obj(win['name'], self.player['group_name'])
                    await self.gameOver(win['chanel_game'] ,winer, is_final, self.player['group_name'], True)
        Tournament.players_tournament = [player for player in Tournament.players_tournament if player['usernameDB'] != user.username]

    async def tournament_start(self, event):
        await self.send(text_data=json.dumps({
            'type': 'tournament_start',
            'players': event['players']
        }))
    
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
        

    async def update_ball_loop(self, game_channel, final_tournament, group_name):
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
                    if self.games[game_channel]['player1'].score == 4:
                        winer = self.games[game_channel]['player1']
                        loser = self.games[game_channel]['player2']
                        Tscore = winer.score - loser.score
                        winerPlayer = winer.to_dict()
                        win = await self.return_player_obj(winerPlayer['username'], group_name)
                        await self.gameOver(game_channel, win, final_tournament, self.player['group_name'], True)
                        break
                if self.games[game_channel]['ball'].y >= 1:
                    self.games[game_channel]['ball'].directionX = 0
                    self.games[game_channel]['ball'].y = 0.5
                    self.games[game_channel]['ball'].x = 0.5
                    self.games[game_channel]['ball'].directionY *= -1
                    self.games[game_channel]['player2'].score += 1
                    if self.games[game_channel]['player2'].score == 4: 
                        winer = self.games[game_channel]['player2']
                        loser = self.games[game_channel]['player1']
                        Tscore = winer.score - loser.score
                        winerPlayer = winer.to_dict()
                        win = await self.return_player_obj(winerPlayer['username'], group_name)
                        await self.gameOver(game_channel, win, final_tournament, self.player['group_name'], True)
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

    async def update_state(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update_state',
            'players': event['players'],
            'image': event['image'],
            'final_tournament': event['final_tournament']
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
    
    async def gameOver(self, game_chan ,winer, finTour, game_group, obP):
        if game_group not in Tournament.final_players:
            Tournament.final_players[game_group] = []
        Tournament.final_players[game_group].append(winer)
        # if finTour == True:
        #     await self.update_tournament(winer, game_group)
        await self.channel_layer.group_send(
            game_chan,
            {
                'type': 'game_over',
                'final_tournament': finTour,
                'winner': winer,
                'isOp': obP
            }
        )
        if game_chan in self.games:
            self.games[game_chan].clear()
        if game_chan in self.games_infor:
            self.games_infor[game_chan].clear()
        
        
    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'final_tournament': event['final_tournament'],
            'winner': event['winner']
        }))
    
    async def return_player_obj(self, name, group_name):
        game = Tournament.Tournaments[group_name]
        for i in range(4):
            if game[f'player{i+1}']['name'] == name:
                return game[f'player{i+1}']
        return None
    
    @sync_to_async
    def get_user(self, username):
        try:
            return CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return None
        
    @sync_to_async
    def create_tournament(self, username1 , username2, username3, username4, name):
        player1 = CustomUser.objects.get(username=username1)
        player2 = CustomUser.objects.get(username=username2)
        player3 = CustomUser.objects.get(username=username3)
        player4 = CustomUser.objects.get(username=username4)
        tourn = TournamentDB.objects.create(
            name=name,
            player1=player1,
            player2=player2,
            player3=player3,
            player4=player4,
            winer=player1
        )

    @sync_to_async
    def update_tournament(self, winer, tournamentname):
        try:
            username = self.get_usernames(tournamentname, winer.username)
            winer_user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            print("CustomUser does not exist")  
            return

        try:
            tournament = get_object_or_404(TournamentDB, name=tournamentname)
            tournament.winer = winer_user
            tournament.save()
        except TournamentDB.DoesNotExist:
            print("Tournament does not exist") 
            
    def get_usernames(self, tournamentname, name):
        Tourn = Tournament.Tournaments[tournamentname]        
        for i in range(4):
            if Tourn[f'player{i+1}']['name'] == name:
                return Tourn[f'player{i + 1}']['usernameDB'] 
    
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
