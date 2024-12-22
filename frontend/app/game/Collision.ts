import { Ball, ball , player, walls  } from "./Object";

export function Collision(Ball: ball, p: player): boolean{

    let topBall = Ball.ballPosY - Ball.radius;
    let topPadd = p.y;

    let leftBall = Ball.ballPosX - Ball.radius;
    let leftPadd = p.x;
    
    let rightBall = Ball.ballPosX + Ball.radius;
    let rightPadd = p.x + p.paddleWidth;

    let bottomBall = Ball.ballPosY + Ball.radius;
    let bottomPadd = p.y + p.paddleHeight;

    return (topBall < bottomPadd && leftBall < rightPadd && rightBall > leftPadd && bottomBall > topPadd); 
}


export function handleCollision(Ball: ball, Player: player, Walls: walls) {
    let colPoint = Ball.ballPosX - (Player.x + Player.paddleWidth / 2);
    colPoint /= (Player.paddleWidth / 2); // normalizing
    let Angle = colPoint * Math.PI / 4;
    let dir = (Ball.ballPosY < Walls.wallsHeight / 2) ? 1 : -1;
    
    Ball.velocityY = dir * Ball.speedBall * Math.cos(Angle);
    Ball.velocityX = Ball.speedBall * Math.sin(Angle);
}