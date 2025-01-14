
interface PlayerProps{
    name: string;
    gameStarted: boolean;
}

export default function Player({name, gameStarted}: PlayerProps)
{
    return (
        <div className="flex justify-center items-center">
            <div className="text-black animate-slide-in-right border bg-paddlefill border-paddlestroke rounded-lg p-2">{name}</div>
        </div>
    );
}