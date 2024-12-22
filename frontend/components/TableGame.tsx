
import React, { useRef, useEffect, useState} from 'react';
import { tableDraw } from '../app/game/remotegame/TableDraw';
import {getRandomName} from '../app/game/remotegame/TableDraw';
import { movePaddle } from '../app/game/remotegame/PaddleRemote';
import p5 from 'p5';
import { player , ball } from '../app/game/remotegame/Object';
import { walls } from '../app/game/remotegame/Object';
import { countdown } from '../app/game/remotegame/ScoreRemote';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { useUserContext } from '../components/context/usercontext';



const Player1 = dynamic(() => import('../app/game/remotegame/Player1Remote'), { ssr: false });
const Player2 = dynamic(() => import('../app/game/remotegame/Player2Remote'), { ssr: false });
let playerInfo: player = { player_id: '', name: '',  player_number: '' };
let game_channel: string = '';
let playeNum: string = '';
let game_state = {};
let Balls: ball = { x: 0, y: 0, radius: 0, color: '', directionX: 0, directionY: 0, speed: 0 };
let socketIsOpen = false;
let gameIsStarted = false;

interface GameProps {
    playerna: string ;
    socketRef: WebSocket;
    groupname: string;
    player_id: string;
    image1: string;
    image2: string;
    player_number : string;
    playername1: string;
    playername2: string;
    onGameEnd: (winner: string, scoreWinner: string, scoreLoser: string, imageWin: string, imageLos: string) => void;
}


export default function TableGame({ playerna, socketRef,  groupname ,  player_id, image1, image2 , player_number,playername1, playername2,onGameEnd}: GameProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {authUser, loading} = useUserContext();
  const [gameStarted, setGameStarted] = useState(false);
  const [isplayer2, setIsPlayer2] = useState(false);
  let count = 3; 
  let startTime = 0;
  let Duration = 1000;
  
  useEffect(() => {
    playerInfo.player_id = player_id;
    playerInfo.name = playerna;
    playerInfo.player_number = player_number;
    if (typeof window !== 'undefined') {
      let Walls : walls = { wallsWidth: canvasRef.current.clientWidth, wallsHeight: canvasRef.current.clientHeight };
      const firtsData = { username: playerna , 
                            x: 4/ Walls.wallsWidth,
                            y1: (Walls.wallsHeight - Walls.wallsHeight / 20) / Walls.wallsHeight,
                            y2: ((Walls.wallsHeight / 20) - (Walls.wallsHeight/40)) / Walls.wallsHeight,
                            pw: (Walls.wallsWidth/4) / Walls.wallsWidth ,
                            ph: (Walls.wallsHeight/40) / Walls.wallsHeight,
                            sp: 8 / Walls.wallsWidth,
                            dirY: 5/ Walls.wallsHeight,
                            Walls: Walls,
                            id_channel: player_id,
                            groupname: groupname};
      socketRef.send(JSON.stringify({ type: 'game_started', data: firtsData }));
      socketRef.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'start_game') {
          game_state = data.game_serialized;
          game_channel = data.name_channel;
          if ( playerInfo.player_id === game_state['player1'].chan_name)
          {
            setIsPlayer2(true); 
          }
          socketIsOpen = true;
          setGameStarted(true);
        }
        if (data.type === 'paddle_update') {
          if (data.playernumber === 1)
            game_state['player1'] = data.paddle;
          else
            game_state['player2'] = data.paddle;
        }
        if (data.type === 'update_ball') {
          game_state['ball'] = data.ball;
          game_state['player1'] = data.player1;
          game_state['player2'] = data.player2;
        }
        if (data.type === 'game_over') {
          setIsPlayer2(false);
          game_state = {};
          playerInfo = { player_id: '', name: '',  player_number: '' };
          onGameEnd(data.winner, data.scoreWiner, data.scoreLoser, data.winerImage, data.loserImage);
        }
      };

      socketRef.onerror = (event: Event) => {
    };
      const p = new p5((sketch) => {
        sketch.setup = () => {
          if (canvasRef.current) {
            sketch.createCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            startTime = sketch.millis();
          }
        };


        sketch.draw = () => {
          if (canvasRef.current) {
            p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        }
          sketch.background(authUser.color);
          if (socketIsOpen) {
            if (!gameIsStarted) {
                const elapsedTime = sketch.millis() - startTime;

                if (elapsedTime >= Duration) {
                    count -= 1;
                    startTime = sketch.millis();

                    if (count <= 0) {
                        gameIsStarted = true;
                        socketIsOpen = false;
                    }
                }

                countdown(sketch, Walls, count);
                return;
            }
            const elapsedTime = sketch.millis() - startTime;

            if (elapsedTime >= Duration) {
                count -= 1;
                startTime = sketch.millis();

                if (count <= 0) {
                    gameIsStarted = true;
                    socketIsOpen = false;
                }
            }

            countdown(sketch, Walls, count);
            return;
        }
        if (gameIsStarted)
        {
          movePaddle(sketch, playerInfo, game_channel, socketRef);
          if (game_state['player1'] && game_state['player2'])
            tableDraw(sketch, game_state ,Walls, playerInfo);
        }
        };
      }, canvasRef.current);

      const handleResize = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
          Walls = { wallsWidth: canvasRef.current.clientWidth, wallsHeight: canvasRef.current.clientHeight };
        }
      };
  
      window.addEventListener('resize', handleResize);

      return () => {
        p.remove();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <>
        <div className="w-[100%] h-[90vh] flex justify-center items-center xl:flex-row  flex-col
                        sm:space-y-[20px]
                        lm:space-y-[40px]
                        lg:space-y-[40px]
                        xl:space-x-[60px] xl:space-y-0
                        2xl:space-x-[200px]
                        3xl:space-x-[250px]
                        4xl:space-x-[300px]
                        md:space-y-[30px]
                        md:rounded-[50px]
                        ">
                    { gameStarted && ( playerInfo.player_number === 'player1' ?
                      (<Player2 
                          image={image2}
                          name={playername2 || ''} 
                          />) : ((<Player1
                            image={image1}
                            name={playername1 || ''} 
                            />))
                        )}
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
                        { gameStarted && ( playerInfo.player_number === 'player1' ?
                      (<Player1 
                          image={image1}
                          name={playername1 || ''} 
                          />) : (<Player2 
                          image={image2}
                          name={playername2 || ''}
                      />)
                    )}
        </div>
    </>
  );
}
