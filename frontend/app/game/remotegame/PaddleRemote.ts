import { player } from './Object';
import p5 from 'p5';


export function movePaddle(sketch: p5, playerInfo: player, game_channel: string, socketRef: WebSocket | null): void {
  if (sketch.keyIsPressed) {
    if ((sketch.keyIsDown(68) || sketch.keyIsDown(sketch.RIGHT_ARROW)) && playerInfo && socketRef) {
      socketRef.send(JSON.stringify({ type: 'move', direction: 'right', player_id: playerInfo.player_id, name: playerInfo.name, game_channel: game_channel }));
    } else if ((sketch.keyIsDown(65) || sketch.keyIsDown(sketch.LEFT_ARROW)) && playerInfo && socketRef) {
      socketRef.send(JSON.stringify({ type: 'move', direction: 'left', player_id: playerInfo.player_id, name: playerInfo.name, game_channel: game_channel }));
    }
  }
}