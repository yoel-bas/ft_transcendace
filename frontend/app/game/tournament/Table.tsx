"use client"

import React, { useRef, useEffect } from 'react';
import { Player1, Player2} from '../Object';
import { Walls , walls} from '../Object';
import { UpPaddle } from '../Paddle';
import { DownPaddle } from '../Paddle';
import { Ball, ball } from '../Object';
import { Score1, Score2 } from '../Score';
import { Collision } from '../Collision';
import { handleCollision } from '../Collision';
import { countdown } from '../Score';
import p5 from 'p5';
import { redirect } from 'next/navigation';


interface TableProps {
    onGameEnd: (winner: string) => void;
}

export default function Table({onGameEnd}: TableProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    let count = 3; 
    let startTime = 0;
    let Duration = 1000;
    let gameStarted = false;

    useEffect(() => {
        const p = new p5((sketch) => {
            sketch.setup = () => {
                sketch.createCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
                startTime = sketch.millis();
            };

            sketch.draw = () => {
                sketch.background("#0B4464");
                
                if (!gameStarted) {
                    const elapsedTime = sketch.millis() - startTime;

                    if (elapsedTime >= Duration) {
                        count -= 1;
                        startTime = sketch.millis();

                        if (count <= 0) {
                            gameStarted = true;
                            Ball.initialize(canvasRef.current);
                        }
                    }

                    countdown(sketch, Walls, count);
                    return;
                }

                Walls.initialize(canvasRef.current);
                Player1.initialize(Walls);
                Player2.initialize(Walls);
                Score1(sketch, Walls, Player1.score);
                Score2(sketch, Walls, Player2.score);
                Line(sketch, Walls);
                UpPaddle(sketch, Walls);
                Ball.ballPosX += Ball.velocityX;
                Ball.ballPosY += Ball.velocityY;
                if (Collision(Ball, Player1)) {
                    handleCollision(Ball, Player1, Walls);
                    Ball.speedBall += 0.5;
                } else if (Collision(Ball, Player2)) {
                    handleCollision(Ball, Player2, Walls);
                    Ball.speedBall += 0.5;
                } else if (Ball.ballPosX <= 0) {
                    Ball.ballPosX = 0; 
                    Ball.velocityX *= -1;
                } else if (Ball.ballPosX + Ball.radius >= Walls.wallsWidth) {
                    Ball.ballPosX = Walls.wallsWidth - Ball.radius;
                    Ball.velocityX *= -1;
                } else if (Ball.ballPosY <= 0) {
                    Ball.initialize(canvasRef.current);
                    Ball.velocityY *= -1;
                    Player2.score += 1;
                    if (Player2.score == 6) {
                        sketch.noLoop();
                        onGameEnd('player 2');
                        Player2.score = 0;
                        Player1.score = 0;
                        redirect('/game/tournament');
                    }
                } else if (Ball.ballPosY >= Walls.wallsHeight) {
                    Ball.initialize(canvasRef.current);
                    Ball.velocityY *= -1;
                    Player1.score += 1;
                    if (Player1.score == 6) {
                        sketch.noLoop();
                        onGameEnd('player 2');
                        Player1.score = 0;
                        Player2.score = 0;
                        redirect('/game/tournament');
                    }
                }
                DownPaddle(sketch, Walls);
                drawBall(sketch, Ball, Walls);
            };
        }, canvasRef.current);

        const handleResize = () => {
            p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            p.remove();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={canvasRef} className="aspect-[3/4] w-[250px]
                                          xs:w-[350px]
                                          ls:w-[380px]
                                          sm:w-[330px]
                                          md:w-[350px]
                                          lm:w-[400px]
                                          2xl:w-[430px]
                                          3xl:w-[530px]
                                          4xl:w-[530px]
                                          rounded-lg overflow-hidden 
                                          border-2 border-teal-300
                                          shadow-[0_0_12px_#fff]"/>
    );
}

function drawBall(sketch: p5, B: ball, W: walls):void {
  sketch.fill("#009DFF");
  sketch.stroke("#009DFF");
  sketch.circle(B.ballPosX, B.ballPosY, W.wallsHeight / 25);
}

function Line(sketch: p5, Walls: walls):void {
  sketch.stroke(100, 128);
  sketch.line(0, Walls.wallsHeight / 2, Walls.wallsWidth, Walls.wallsHeight / 2);
}


