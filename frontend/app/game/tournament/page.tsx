"use client";

import React, { useState } from 'react';
import TournamentForm from '../../../components/TournamentForm';
import LocalGame from '../../../components/LocalGame';
import Image from 'next/image';
import WinnerTour from '../../../components/WinnerTour';
import { useTranslation } from 'next-i18next';

export default function Tournament() {
    const { t } = useTranslation();
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [showLocalGame, setShowLocalGame] = useState(false);
    const [players, setPlayers] = useState({ player1: '', player2: '', player3: '', player4: '' });
    const [currentPlayers, setCurrentPlayers] = useState({ player1: '', player2: '' });
    const [currentGame, setCurrentGame] = useState(1);
    const [winner1, setWinner1] = useState('');
    const [winner2, setWinner2] = useState('');
    const [winner, setWinner] = useState('');
    const [gameEnd, setGameEnd] = useState(false);

    const handleFormSubmit = (playerData) => {
        setPlayers(playerData);
        setIsFormSubmitted(true);
    };

    const handleButtonClick = (player1, player2) => {
        setCurrentPlayers({ player1, player2 });
        setShowLocalGame(true);
    };

    const handleGameEnd = (winner) => {
        if (currentGame == 1)
            setWinner1(winner);
        else if (currentGame == 2)
            setWinner2(winner);
        else
        {
            setGameEnd(true);
            setWinner(winner)
        }
            
        setShowLocalGame(false);
        setCurrentGame(currentGame + 1);
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                            md:border md:border-white md:border-opacity-30
                            md:bg-black md:bg-opacity-20
                            md:rounded-[50px]">
                
                {!gameEnd ?  (showLocalGame ? (
                    <LocalGame player1={currentPlayers.player1} player2={currentPlayers.player2} onGameEnd={handleGameEnd} />
                ) : (
                    !isFormSubmitted ? (
                        <TournamentForm onSubmit={handleFormSubmit} />
                    ) : (
                        <div className="w-[85%] h-[80vh] flex justify-center items-center lg:justify-start lg:items-start flex-col mt-[5vh]">
                            <div className='sm:hidden w[100px] h-[60px] text-white '>{currentGame === 3 ? "Final" : "Demi Final"}</div>
                            {currentGame === 1 && (<div className='text-white sm:hidden'>Match 1</div>)}
                            {currentGame === 1 && (
                                <div className=' sm:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px] bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30'>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player1.substring(0, 9)}</div>
                                    <div className='text-white'>VS</div>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player2.substring(0, 9)}</div>
                                    <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick(players.player1, players.player2)}>{t("Play")}</button>
                                </div>
                            )}
                            {currentGame === 2 && (<div className='text-white sm:hidden'>Match 2</div>)}
                            {currentGame === 2 && (
                                <div className='sm:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px] bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30'>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player3.substring(0, 9)}</div>
                                    <div className='text-white'>VS</div>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{players.player4.substring(0, 9)}</div>
                                    <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick(players.player3, players.player4)}>{t("Play")}</button>
                                </div>
                            )}
                            {currentGame == 3 && (
                                <div className=' sm:hidden w-[350px] h-[100px] bg-deepSeaBlue/80 rounded-lg flex justify-center items-center space-x-[10px] bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30'>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner1.substring(0, 9)}</div>
                                    <div className='text-white'>VS</div>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner2.substring(0, 9)}</div>
                                    <button className='w-[20%] h-[100%] rounded-lg rounded-l-[40px] bg-deepSeaBlue text-white' onClick={() => handleButtonClick(winner1, winner2)}>{t("Play")}</button>
                                </div>
                            )}
                            {currentGame > 3 && (
                                <div className=' sm:hidden w-[350px] h-[100px] bg-sky-400 rounded-lg flex justify-center items-center space-x-[30px]'>
                                    <div className='w-[120px] h-[70px] text-white flex justify-center items-center'>{winner.substring(0,9)}</div>
                                </div>
                            )}




                                <div className='hidden sm:block l:hidden w-full h-full mb-10'>
                                    <div className='flex justify-between items-center flex-col h-full'>
                                        <div className={`flex flex-row ${currentGame !== 1 ? 'space-x-36' : ''}`}>
                                                <div className={`border 
                                                        sm:w-[120px] sm:h-[40px]  md:w-[140px] md:h-[50px] rounded-tl-[50px] rounded-br-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 1 && players.player1 !== winner1 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player1.substring(0, 9)}</div>
                                                {currentGame === 1 && (
                                                <div className="flex flex-col justify-center items-center mt-2 w-36">
                                                    <hr className="border-t border-paddlefill w-full" />
                                                    <hr className="border-l border-paddlefill h-8" />
                                                    <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick(players.player1, players.player2)}>{t("Play")}</button>
                                                </div>
                                                )}
                                                <div className={`border 
                                                        sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 1 && players.player2 !== winner1 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player2.substring(0, 9)}</div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className={`border 
                                                            sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 3 && winner1 !== winner ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner1.substring(0, 9)}</div>
                                        </div>
                                        <div className='flex flex-col space-y-1'>

                                                <Image alt='' src='/images/trophy.png' width={300} height={380} className='sm:w-[120px] sm:h-[140px] md:w-[150px] md:h-[180px] mx-auto' />
                                            <div className='sm:w-[120px] sm:h-[40px] md:w-[200px] md:h-[50px] border border-paddlefill bg-cover bg-center rounded-bl-[50px] rounded-br-[50px]
                                                            bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30
                                                            flex justify-center items-center text-white'>{winner.substring(0,9)}</div>
                                            {currentGame === 3 && (
                                                <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white mx-auto' onClick={() => handleButtonClick(winner1, winner2)}>{t("Play")}</button>
                                            )}
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className={`border 
                                                            sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 3 && winner2 !== winner ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner2.substring(0, 9)}</div>
                                        </div>
                                        <div className={`flex flex-row ${currentGame !== 2 ? 'space-x-36' : ''} items-end`}>
                                                <div className={`border 
                                                        sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                        flex justify-center items-center text-white 
                                                        ${currentGame > 2 && players.player3 !== winner2 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player3.substring(0, 9)}</div>
                                                {currentGame === 2 && (
                                                <div className="flex flex-col justify-center items-center w-36">
                                                    <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick(players.player3, players.player4)}>{t("Play")}</button>
                                                    <hr className="border-l border-paddlefill h-8" />
                                                    <hr className="border-t border-paddlefill w-full mb-2" />
                                                </div>
                                                )}
                                                <div className={`border 
                                                        sm:w-[120px] sm:h-[40px] md:w-[140px] md:h-[50px] rounded-tl-[50px] rounded-br-[50px]
                                                        flex justify-center items-center text-white
                                                        ${currentGame > 2 && players.player4 !== winner2 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                        : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player4.substring(0, 9)}</div>
                                        </div>
                                    </div>
                                </div>







                                <div className='hidden l:block w-full h-full'>
                                    <div className='flex items-center justify-between flex-row h-full'>
                                        <div className={`flex flex-col mb-12 ${currentGame !== 1 ? 'space-y-56' : ''}`}>
                                            <div className={`border 
                                                            3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 1 && players.player1 !== winner1 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player1.substring(0, 9)}</div>
                                            {currentGame === 1 && (
                                            <div className=" border-l border-paddlefill h-56 ml-8 flex justify-center items-center">
                                                <hr className="border-t border-paddlefill l:w-[47px] 3xl:w-[98px]" />
                                                <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick(players.player1, players.player2)}>{t("Play")}</button>
                                            </div>
                                            )}
                                            <div className={`border 
                                                            3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 1 && players.player2 !== winner1 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player2.substring(0, 9)}</div>
                                        </div>
                                        <div className='flex space-y-64 flex-col mb-12'>
                                            <div className={`border 
                                                            3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 3 && winner1 !== winner ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner1.substring(0, 9)}</div>
                                        </div>
                                        <div className='flex flex-col space-y-2 mb-12'>

                                                <Image alt='' src='/images/trophy.png' width={350} height={400} className='3xl:w-[300px] 3xl:h-[300px] l:w-[200px] l:h-[250px] lm:w-[150px] lm:h-[180px] mx-auto' />
                                            <div className=' 3xl:w-[300px] 3xl:h-[80px] lm:w-[200px] lm:h-[50px] border border-paddlefill bg-cover bg-center rounded-bl-[50px] rounded-br-[50px]
                                                            bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30
                                                            flex justify-center items-center text-white'>{winner.substring(0,9)}</div>
                                            {currentGame === 3 && (
                                                <button className='w-[60px] h-[60px] border-animated bg-deepSeaBlue rounded-[70px] text-white mx-auto' onClick={() => handleButtonClick(winner1, winner2)}>{t("Play")}</button>
                                            )}
                                        </div>
                                        <div className='flex space-y-64 flex-col mb-12 '>
                                            <div className={`border 
                                                            3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 3 && winner2 !== winner ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{winner2.substring(0, 9)}</div>
                                        </div>
                                        <div className={`flex flex-col mb-12 ${currentGame !== 2 ? 'space-y-56' : ''}`}>
                                            <div className={`border 
                                                            3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 2 && players.player3 !== winner2 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player3.substring(0, 9)}</div>
                                            {currentGame === 2 && (
                                            <div className="border-r border-paddlefill h-56 mr-8 flex justify-center items-center">
                                                <button className='border-animated w-[60px] h-[60px]  bg-deepSeaBlue rounded-[70px] text-white' onClick={() => handleButtonClick(players.player3, players.player4)}>{t("Play")}</button>
                                                <hr className="border-t border-paddlefill l:w-[47px] 3xl:w-[98px]" />
                                            </div>
                                            )}
                                            <div className={`border 
                                                            3xl:w-[200px] 3xl:h-[70px] l:w-[150px] l:h-[60px] lm:w-[140px] lm:h-[50px] rounded-tr-[50px] rounded-bl-[50px]
                                                            flex justify-center items-center text-white
                                                            ${currentGame > 2 && players.player4 !== winner2 ? 'bg-black/30 border-paddlefill/30 text-white/30' 
                                                            : 'bg-gradient-to-r from-deepSeaBlue to-paddlestroke/30 border-paddlefill text-white'}`}>{players.player4.substring(0, 9)}</div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    )
                )): ( <WinnerTour winner={winner} img='/images/adil.png' />)}
            </div>
        </div>
    );
}