"use client"

import React, { useEffect, useRef , useState} from 'react';
import dynamic from 'next/dynamic';
import { useUserContext } from '../../../components/context/usercontext';
import Platform from '@/components/Platform';
import Versus from '@/components/Versus';
import TableGame from '../../../components/TableGame';
import Winner from '@/components/Winner';
import { useSearchParams } from 'next/navigation';
interface player {
    player_id: string;
    name: string;
}

export default function Game() {
    const {authUser, loading} = useUserContext();
    const [id_channel, setIdChannel] = useState('');
    const [matchready, setMatchReady] = useState(false);
    const [winerImage, setWinnerImg] = useState('');
    const [loserImage, setLoserImg] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [nameplayer1, setNamePlayer1] = useState('');
    const [nameplayer2, setNamePlayer2] = useState('');
    const [scoreWinner, setScoreWinner] = useState('');
    const [scoreLoser, setScoreLoser] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [game_roum, setGameRoom] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [playernumber, setPlayerNumber] = useState('');
    const [isplaying, setIsPlaying] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const searchParams = useSearchParams();
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');
    const typeGame = searchParams.get('type');

    const handleGameEnd = (winner, scoreWinner, scoreLoser, imageWin, imageLos) => {
        setWinnerImg(imageWin);
        setLoserImg(imageLos);
        setScoreWinner(scoreWinner);
        setScoreLoser(scoreLoser);
        setGameOver(true);
        setIsPlaying(false);
    };

    const rematch = (rematch) => {
        setGameOver(false);
        setMatchReady(false);
        setGameStarted(false);
        setGameRoom('');
        setPlayerNumber('');
        setIsPlaying(false);
        if (socketRef.current) {
            socketRef.current.send(
                JSON.stringify({ type: 'rematch' })
            );
        }
    }

    const handleRematch = (data) => {
        setImage1(data['players'][0].image);
        setImage2(data['players'][1].image);
        setNamePlayer1(data['players'][0].name)
        setNamePlayer2(data['players'][1].name)
        setGameRoom(data.game_channel);
        setMatchReady(true);
    }

    const handlGoToGame = () => {
        setGameStarted(true);
    } 

    const handleConnection= (play_id, playerNumber) => {
        setPlayerNumber(playerNumber)
                    setIdChannel(play_id);
    }

    const handlGameOver=(winer, scoreWiner,scoreLoser, winerImage, loserImage) => {
        setWinnerImg(winerImage);
        setLoserImg(loserImage);
        setScoreWinner(scoreWiner);
        setScoreLoser(scoreLoser);
        setGameOver(true);
        setIsPlaying(false);
        setGameStarted(true);
    }

    const goGame = () => {  
        setGameStarted(true);
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            socketRef.current = new WebSocket('wss://localhost/ws/game/');
            socketRef.current.onopen = () => {
                socketRef.current.send(JSON.stringify({ type: 'connection', username: authUser.username, flag: typeGame, sender: sender, receiver: receiver }));
            }
            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'is_playing') {
                    setIsPlaying(true);
                }
                if (data.type === 'connection') {
                    
                    setPlayerNumber(data.player.player_number)
                    setIdChannel(data.player.id);
                }
                if (data.type === 'match_ready') {
                    setImage1(data['players'][0].image);
                    setImage2(data['players'][1].image);
                    setNamePlayer1(data['players'][0].name)
                    setNamePlayer2(data['players'][1].name)
                    setGameRoom(data.game_channel);
                    setMatchReady(true);
                }
                if (data.type === 'go_to_game') {
                    setGameStarted(true);
                }
            }
            socketRef.current.onclose = () => {
            }
            socketRef.current.onerror = () => {
            }
            return () => {
                socketRef.current.close();
                socketRef.current = null;
            }
        } 
    }, []);
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className='w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                            md:border md:border-white md:border-opacity-30
                            md:bg-black md:bg-opacity-20
                            md:rounded-[50px]'>
            {!gameStarted ? ( !matchready ? (!isplaying ? (<Platform />) : <>already playing</>) : (<Versus socket={socketRef.current} game_roum={game_roum} username={authUser.username} image1={image1} image2={image2} handlGameOver={handlGameOver} goToGame={goGame}/>)) 
            : (!gameOver ? (<TableGame playerna={authUser.username} socketRef={socketRef.current}  groupname={game_roum} player_id={id_channel} 
                image1={image1} image2={image2} player_number={playernumber} playername1={nameplayer1} playername2={nameplayer2} onGameEnd={handleGameEnd}/>) 
            : (<Winner winer={winerImage} loser={loserImage} scoreWinner={scoreWinner} scoreLoser={scoreLoser} rematch={rematch} socket={socketRef.current} handleRematch={handleRematch} handlGoToGame={handlGoToGame} handleConnection={handleConnection} />))}
            </div>
        </div>
    );
}