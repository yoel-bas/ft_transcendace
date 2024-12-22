"use client"

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('../app/game/tournament/Table'), { ssr: false });
const Player1 = dynamic(() => import('../app/game/tournament/Player1'), { ssr: false });
const Player2 = dynamic(() => import('../app/game/tournament/Player2'), { ssr: false });

interface GameProps {
    player1: string | undefined;
    player2: string | undefined;
    onGameEnd: (winner: string) => void;
}

export default function LocalGame({ player1, player2, onGameEnd }: GameProps) {
    const handleGameEnd = (winner: string) => {
        let nameWin: string;
        if (winner == 'player 1')
            nameWin = player1
        else
            nameWin = player2
        onGameEnd(nameWin);
    };

    return (
        <div>
            <Player1 name={player1 ?? "Player 1"} gameStarted={true} /> 
            <Table onGameEnd={handleGameEnd}/>
            <Player2 name={player2 ?? "Player 2"} gameStarted={true} />
        </div>
    );
}