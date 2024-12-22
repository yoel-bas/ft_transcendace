"use client";

import React, { use, useState } from 'react';
import TournamentForm from './TournamentForm';
import Image from 'next/image';
import { useEffect , useRef} from 'react';
import { player } from '../app/game/Object';
import TableTourGame from '@/app/game/tournament/remote/TableTourGame';
import WaitingTournament from './WaitingTournament';
import { useUserContext } from '../components/context/usercontext';



interface Props {
    PlayerName: string;
    HandleUserExist: (exist: boolean, playerExit: string, message: string) => void;
    GameEnd: (winer: string, img: string) => void; 
}

interface Player {
    name: string;
    id: string;
    player_id: string;
    group_name : string;
}



export default function TournamentSyst({ PlayerName, HandleUserExist, GameEnd }: Props) {
    const socketRef = useRef<WebSocket | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [userExist, setUserExist] = useState(false);
    const {authUser, loading} = useUserContext();
    
    
    useEffect(() => {  
        if (typeof window !== 'undefined' && !socketRef.current) {
            socketRef.current = new WebSocket('wss://localhost/ws/tournament/');
            socketRef.current.onopen = () => {
              socketRef.current.send(JSON.stringify({ type: 'connection', playerName: PlayerName , username: authUser.username}));
            };
      
            socketRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'error_valid_name') {
                    setUserExist(false);
                    HandleUserExist(true, data['player'], "Invalid name: Up to 9 chars, only A-Z,a-z,0-9,-_.");
                }
                if (data.type === 'connection') {
                    if (data.message === 'player_exist') {
                        setUserExist(false);
                        HandleUserExist(true, data['player'], "already exist, please choose another name");
                    }
                    else {
                    setPlayer_id(data.player.id)
                    setCurrentPlayers(data.player.numberplayer);
                    setUserExist(true);
                }
                }
                if (data.type === 'player_number') {
                    setPlayernumber(data.number_of_number);
                }
                if (data.type === 'update_state')
                {
                    if (data['final_tournament'] === false)
                    {
                        if(data['players'][0].numberwiner === 'player1' || data['players'][0].numberwiner === 'player2')
                            setWinner2(data['players'][1].winer);
                        else if(data['players'][0].numberwiner === 'player3' || data['players'][0].numberwiner === 'player4')
                            setWinner1(data['players'][1].winer);
                        if (data['players'][1].numberwiner === 'player1' || data['players'][1].numberwiner === 'player2')
                            setWinner2(data['players'][0].winer);
                        else if (data['players'][1].numberwiner === 'player3' || data['players'][1].numberwiner === 'player4')
                            setWinner1(data['players'][0].winer);
                    }
                    else
                    {
                        setWinner(data['players'].winer);
                        setShowLocalGame(false);
                        setCurrentGame(currentGame + 2);
                        GameEnd(data['players'].winer, data.image);
                    }
                    // handleUpdateState(data.winner1, data.playerN1, data.winner2, data.playerN2);
                }
                if (data.type === 'game_over')
                {;
                    if (data.winner.name === PlayerName)
                        setQualified(true);
            
                    if (data.winner.numberplayer == 'player1' || data.winner.numberplayer == 'player2')
                        setWinner1(data.winner.name);
                    else if (data.winner.numberplayer == 'player4' || data.winner.numberplayer == 'player3')
                        setWinner2(data.winner.name);
                    setShowLocalGame(false);
                    setCurrentGame(currentGame + 1);
                }
                if (data.type === 'tournament_start') {
                    setPlayers(data.players);
                    setPlayer1(data.players[0]['name']);
                    setPlayer2(data.players[1]['name']);
                    setPlayer3(data.players[2]['name']);
                    setPlayer4(data.players[3]['name']);
                    setFinPlayer(true);
                }
            }
              
            };
    }, []);










    const [showLocalGame, setShowLocalGame] = useState(false);
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [player3, setPlayer3] = useState('');
    const [player4, setPlayer4] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [playername1, setNamePlayer1] = useState('');
    const [playername2, setNamePlayer2] = useState('');
    const [nameplayer, setNamePlayer] = useState('');
    const [qualified, setQualified] = useState(false);
    const [player_id, setPlayer_id] = useState('');
    const [currentPlayers, setCurrentPlayers] = useState('');
    const [group_name, setGroup_name] = useState('');
    const [currentGame, setCurrentGame] = useState(1);
    const [id, setId] = useState('');
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner, setWinner] = useState('');
    const [finPlayer, setFinPlayer] = useState(false);
    const [playernum, setPlayernumber] = useState(0);

    const getImage = (name: string) => {
        for (let i = 0; i < players.length; i++) {
            if (players[i]['name'] === name)
                return players[i]['image'];
        }
    }

    const handleButtonClick = () => {
        for (let i = 0; i < players.length; i++) {
            if (players[i]['name'] === PlayerName && (winner1 === '' || winner2 === '')) {
                if (players[i]['numberplayer'] === 'player1')
                {
                    setNamePlayer(players[i]['player_id']);
                    setImage1(players[i]['image']);
                    setImage2(players[i + 1]['image']);
                    setNamePlayer1(players[i]['name']);
                    setNamePlayer2(players[i + 1]['name']);
                    
                }
                else if (players[i]['numberplayer'] === 'player2')
                {
                    setNamePlayer(players[i]['player_id']);
                    setImage1(players[i - 1]['image']);
                    setImage2(players[i]['image']);
                    setNamePlayer1(players[i - 1]['name']);
                    setNamePlayer2(players[i]['name']);
                }
                else if (players[i]['numberplayer'] === 'player3')
                    {
                    setNamePlayer(players[i]['player_id']);
                    setImage1(players[i]['image']);
                    setImage2(players[i + 1]['image']);
                    setNamePlayer1(players[i]['name']);
                    setNamePlayer2(players[i + 1]['name']);
                    
                }
                else if (players[i]['numberplayer'] === 'player4')
                {
                    setNamePlayer(players[i]['player_id']);
                    setImage1(players[i - 1]['image']);
                    setImage2(players[i]['image']);
                    setNamePlayer1(players[i - 1]['name']);
                    setNamePlayer2(players[i]['name']);
                }
                setGroup_name(players[i]['group_name']);
                setId(players[i]['id']);
                break;
            }
            else if (players[i]['name'] === PlayerName && winner1 !== '' && winner2 !== '') {
                if (PlayerName === winner1)
                {
                    setNamePlayer('player1');
                    setImage1(players[i]['image']);
                    setImage2(getImage(winner2));
                    setNamePlayer1(winner1);
                    setNamePlayer2(winner2);
                }
                else if (PlayerName === winner2)
                {
                    setNamePlayer('player2');
                    setImage1(getImage(winner1));
                    setImage2(players[i]['image']);
                    setNamePlayer1(winner1);
                    setNamePlayer2(winner2);
                }
            }
        }
        setShowLocalGame(true);
    };


    const handleUpdateState = (winer1, playerN1, winer2, playerN2) => {
        if(playerN1 === 'player1' || playerN1 === 'player2')
            setWinner2(winer2);
        else if(playerN1 === 'player3' || playerN1 === 'player4')
            setWinner1(winer2);
        if (playerN2 === 'player1' || playerN2 === 'player2')
            setWinner2(winer1);
        else if (playerN2 === 'player3' || playerN2 === 'player4')
            setWinner1(winer1);
    }

    const handlefinal = (wineer, image) => {
        setWinner(wineer);
        setShowLocalGame(false);
        setCurrentGame(currentGame + 2);
        GameEnd(wineer, image);
    }


    const handleGameEnd = (winner, number) => {

        if (winner === PlayerName)
            setQualified(true);

        if (number == 'player1' || number == 'player2')
            setWinner1(winner);
        else if (number == 'player4' || number == 'player3')
            setWinner2(winner);
        setShowLocalGame(false);
        setCurrentGame(currentGame + 1);
    };

    return (
        <div className="w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]">
            {!finPlayer ? (<WaitingTournament numberplayer={playernum}  /> ): (showLocalGame ? (
                <TableTourGame playerna={PlayerName} socketRef={socketRef.current} playernambre={currentPlayers}
                 groupname={group_name} image1={image1} image2={image2} 
                player_nambre={nameplayer} playername1={playername1} playername2={playername2}
                player_id={player_id} qualified={qualified} onGameEnd={handleGameEnd} handleUpdate={handleUpdateState} handlefinal={handlefinal}/>
            ) : (userExist && (
                    <div className="w-[85%] h-[80vh] flex justify-center items-center lg:justify-start lg:items-start flex-col mt-[5vh]">
                        <div className='sm:hidden w[100px] h-[60px] text-white '>{currentGame === 3 ? "Final" : "Demi Final"}</div>
                        {currentGame === 1 && (<div className='text-white sm:hidden'>Match 1</div>)}
                        {currentGame === 1 && (
                            <div className=' sm:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px] bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{player1}</div>
                                <div className='text-white'>VS</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{player2}</div>
                                <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick()}>Play</button>
                            </div>
                        )}
                        {currentGame === 2 && (<div className='text-white sm:hidden'>Match 2</div>)}
                        {currentGame === 2 && (
                            <div className='sm:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px] bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{player3}</div>
                                <div className='text-white'>VS</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{player4}</div>
                                <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick()}>Play</button>
                            </div>
                        )}
                        {currentGame == 3 && (
                            <div className=' sm:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px] bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner1.substring(0, 9)}</div>
                                <div className='text-white'>VS</div>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner2.substring(0, 9)}</div>
                                <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick()}>Play</button>
                            </div>
                        )}
                        {currentGame > 3 && (
                            <div className=' sm:hidden w-[350px] h-[100px] bg-sky-400 rounded-lg flex justify-center items-center space-x-[30px]'>
                                <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner.substring(0,9)}</div>
                            </div>
                        )}




                            <div className='hidden sm:block l:hidden w-full h-full mb-10'>
                                <div className='flex justify-between items-center flex-col h-full'>
                                    <div className={`flex flex-row ${((currentPlayers === 'player1' || currentPlayers === 'player2') && currentGame == 1) ? '' : 'space-x-36'}`}>
                                            <div className={`border 
                                                    sm:w-[120px] sm:h-[40px]  md:w-[140px] md:h-[50px] rounded-tl-[50px] rounded-br-[50px]
                                                    flex justify-center items-center text-white
                                                    ${currentGame > 1 && player1 !== winner1 && winner1 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                    : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player1}</div>
                                            {((currentPlayers === 'player1' || currentPlayers === 'player2') && currentGame == 1) && (
                                            <div className="flex flex-col justify-center items-center mt-2 w-36">
                                                <hr className="border-t border-paddlefill w-full" />
                                                <hr className="border-l border-paddlefill h-8" />
                                                <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick()}>Play</button>
                                            </div>
                                            )}
                                            <div className={`border 
                                                    sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                    flex justify-center items-center text-white
                                                    ${currentGame > 1 && player2 !== winner1 && winner1 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                    : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player2}</div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className={`border 
                                                        sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 2 && winner1 !== winner && winner !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner1.substring(0, 9)}</div>
                                    </div>
                                    <div className='flex flex-col space-y-1'>

                                            <Image alt='' src='/images/trophy.png' width={300} height={380} className='sm:w-[120px] sm:h-[140px] md:w-[150px] md:h-[180px] mx-auto' />
                                        <div className='sm:w-[120px] sm:h-[40px] md:w-[200px] md:h-[50px] border border-paddlefill bg-cover bg-center rounded-bl-[50px] rounded-br-[50px]
                                                         bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30
                                                         flex justify-center items-center text-white'>{winner.substring(0,9)}</div>
                                        {(currentGame === 2 && qualified == true) && (
                                            <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white mx-auto' onClick={() => handleButtonClick()}>Play</button>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className={`border 
                                                        sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 2 && winner2 !== winner && winner !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner2.substring(0, 9)}</div>
                                    </div>
                                    <div className={`flex flex-row ${((currentPlayers === 'player3' || currentPlayers === 'player4') && currentGame == 1) ? '' : 'space-x-36'} items-end`}>
                                            <div className={`border 
                                                    sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                    flex justify-center items-center text-white 
                                                    ${currentGame > 1 && player3 !== winner2 && winner2 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                    : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player3}</div>
                                            {((currentPlayers === 'player3' || currentPlayers === 'player4') && currentGame == 1) && (
                                            <div className="flex flex-col justify-center items-center w-36">
                                                <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick()}>Play</button>
                                                <hr className="border-l border-paddlefill h-8" />
                                                <hr className="border-t border-paddlefill w-full mb-2" />
                                            </div>
                                            )}
                                            <div className={`border 
                                                    sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tl-[50px] rounded-br-[50px]
                                                    flex justify-center items-center text-white
                                                    ${currentGame > 1 && player4 !== winner2 && winner2 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                    : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player4}</div>
                                    </div>
                                </div>
                            </div>



                            <div className='hidden l:block w-full h-full'>
                                <div className='flex items-center justify-between flex-row h-full'>
                                    <div className={`flex flex-col mb-12 ${((currentPlayers === 'player1' || currentPlayers === 'player2') && currentGame == 1) ? '' : 'space-y-56'}`}>
                                        <div className={`border 
                                                        3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 1 && player1 !== winner1 && winner1 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player1}</div>
                                        {((currentPlayers === 'player1' || currentPlayers === 'player2') && currentGame == 1) && (
                                        <div className=" border-l border-paddlefill h-56 ml-8 flex justify-center items-center">
                                            <hr className="border-t border-paddlefill l:w-[47px] 3xl:w-[98px]" />
                                            <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick()}>Play</button>
                                        </div>
                                        )}
                                        <div className={`border 
                                                        3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 1 && player2 !== winner1 && winner1 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player2}</div>
                                    </div>
                                    <div className='flex space-y-64 flex-col mb-12'>
                                        <div className={`border 
                                                        3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 2 && winner1 !== winner && winner !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner1.substring(0, 9)}</div>
                                    </div>
                                    <div className='flex flex-col space-y-2 mb-12'>

                                            <Image alt='' src='/images/trophy.png' width={350} height={420} className='3xl:w-[350px] 3xl:h-[420px] l:w-[200px] l:h-[250px] lm:w-[150px] lm:h-[180px] mx-auto' />
                                        <div className=' 3xl:w-[350px] 3xl:h-[80px] lm:w-[200px] lm:h-[50px] border border-paddlefill bg-cover bg-center rounded-bl-[50px] rounded-br-[50px]
                                                         bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30
                                                         flex justify-center items-center text-white'>{winner.substring(0,9)}</div>
                                        {(currentGame === 2 && qualified == true) && (
                                            <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white mx-auto' onClick={() => handleButtonClick()}>Play</button>
                                        )}
                                    </div>
                                    <div className='flex space-y-64 flex-col mb-12 '>
                                        <div className={`border 
                                                        3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 2 && winner2 !== winner && winner !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner2.substring(0, 9)}</div>
                                    </div>
                                    <div className={`flex flex-col mb-12 ${((currentPlayers === 'player3' || currentPlayers === 'player4') && currentGame == 1) ? '' : 'space-y-56'}`}>
                                        <div className={`border 
                                                        3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 1 && player3 !== winner2 && winner2 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player3}</div>
                                        {((currentPlayers === 'player3' || currentPlayers === 'player4') && currentGame == 1) && (
                                        <div className="border-r border-paddlefill h-56 mr-8 flex justify-center items-center">
                                            <button className='border-animated w-[60px] h-[60px]  bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick()}>Play</button>
                                            <hr className="border-t border-paddlefill l:w-[47px] 3xl:w-[98px]" />
                                        </div>
                                        )}
                                        <div className={`border 
                                                        3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 1 && player4 !== winner2 && winner2 !== '' ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{player4}</div>
                                    </div>
                                </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}