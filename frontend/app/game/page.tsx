"use client"
import WinnerLocal from '@/components/WinnerLocal';
import React, { useState } from 'react';

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('./Table'), { ssr: false });
const Player1 = dynamic(() => import('./Player1'), { ssr: false });
const Player2 = dynamic(() => import('./Player2'), { ssr: false });

// Keep the interface separate from the default export

const page = () => {
    const [gameEnded, setGameEnded] = useState(false);
    const [scoreWinner, setScoreWinner] = useState('');
    const [scoreLoser, setScoreLoser] = useState('');
    const [name, setName] = useState('');
    const [loser, setLoser] = useState('');

    const handleGameEnd = (winner: string, loser: string,scoreWinner: string, scoreLoser: string) => {
        setName(winner);
        setLoser(loser);
        setGameEnded(true);
        setScoreWinner(scoreWinner);
        setScoreLoser(scoreLoser);
    };

    const rematch = () => {
        setGameEnded(false);
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-[85%] h-[80vh] flex justify-center items-center flex-col mt-[5vh] ml-[32px]
                            space-y-[20px] md:border md:border-white md:border-opacity-30
                            md:bg-black md:bg-opacity-20
                            md:rounded-[50px]">
                {gameEnded ? (
                    <WinnerLocal winer={name} loser={loser} rematch={rematch} scoreWinner={scoreWinner} scoreLoser={scoreLoser}  />
                ) : (
                    <>
                        <Player1 name={"Player 1"} gameStarted={true} />
                        <Table onGameEnd={handleGameEnd} />
                        <Player2 name={"Player 2"} gameStarted={true} />
                    </>
                )}
            </div>
        </div>
    );
};

export default page;
