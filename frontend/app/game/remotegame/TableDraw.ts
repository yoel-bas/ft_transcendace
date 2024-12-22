import p5 from 'p5';
import { player } from './Object';
import { walls } from './Object';
import dynamic from 'next/dynamic';





export function getRandomName(): string {
    const adjectives = [
      "Brave", "Calm", "Delightful", "Eager", "Fancy", 
      "Gentle", "Happy", "Jolly", "Kind", "Lively", 
      "Mighty", "Nice", "Proud", "Quick", "Royal"
    ];
  
    const nouns = [
      "Lion", "Tiger", "Eagle", "Hawk", "Falcon", 
      "Shark", "Wolf", "Bear", "Fox", "Whale", 
      "Panda", "Elephant", "Cheetah", "Leopard", "Rhino"
    ];
  

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${randomAdjective}`;
  }
  

export function tableDraw(sketch: p5, game_state: {} ,Walls: walls, playerInofo: player): void {
    
  let player1Y = game_state['player1'].y;
  let player2Y = game_state['player2'].y;
  let ballY = game_state['ball'].y;
  let br = 0;
  let bl = 0;
  let detailX = 50;
  let detailY = 50;
  let br2 = 50;
  let bl2 = 50;
  let detailX2 = 0;
  let detailY2 = 0;
  if (playerInofo.player_number === 'player2') 
    {
      Score2(sketch, Walls, game_state['player2'].score);
      Score1(sketch, Walls, game_state['player1'].score);
      player1Y = 1 - game_state['player1'].y - (Walls.wallsHeight/40) / Walls.wallsHeight;
      player2Y = 1 - game_state['player2'].y - (Walls.wallsHeight/40) / Walls.wallsHeight;
      ballY = 1 - game_state['ball'].y;
      br = 50;
      bl = 50;
      detailX = 0;
      detailY = 0;
      br2 = 0;
      bl2 = 0;
      detailX2 = 50;
      detailY2 = 50;
    }
    else
    {
      Score2(sketch, Walls, game_state['player1'].score);
      Score1(sketch, Walls, game_state['player2'].score);
    }
    sketch.fill("#00A88C");
    sketch.stroke("#58FFE3");
    sketch.rect(game_state['player1'].x * Walls.wallsWidth,  player1Y * Walls.wallsHeight, Walls.wallsWidth/4, Walls.wallsHeight / 40, br, bl, detailX, detailY);
    sketch.rect(game_state['player2'].x * Walls.wallsWidth, player2Y * Walls.wallsHeight, Walls.wallsWidth/4, Walls.wallsHeight / 40, br2, bl2, detailX2, detailY2);
    Line(sketch, Walls);
    sketch.fill("#009DFF");
    sketch.stroke("#009DFF");
    sketch.circle(game_state['ball'].x * Walls.wallsWidth,  ballY * Walls.wallsHeight, Walls.wallsHeight / 25);

}

function Line(sketch: p5, Walls: walls):void {
  sketch.fill(200, 20);
  sketch.stroke(100, 128);
  sketch.line(0, Walls.wallsHeight / 2, Walls.wallsWidth, Walls.wallsHeight / 2);
}


function Score1(sketch: p5, Walls : walls,  Scor1: number):void {
  sketch.fill(200, 20);
  sketch.stroke(0, 36);
  sketch.textAlign(sketch.CENTER, sketch.CENTER);
  sketch.textSize(Walls.wallsWidth / 3);
  sketch.text(Scor1, Walls.wallsWidth / 2, Walls.wallsHeight / 4);
}

function Score2(sketch: p5, Walls : walls,  Scor1: number):void {
  sketch.fill(200, 20);
  sketch.stroke(0, 36);
  sketch.textAlign(sketch.CENTER, sketch.CENTER);
  sketch.textSize(Walls.wallsWidth / 3);
  sketch.text(Scor1, Walls.wallsWidth / 2, 3 * (Walls.wallsHeight / 4));
}
