import React from 'react'
import { useState , useEffect} from 'react'

interface WaitingTournamentProps {
  numberplayer: number
}

export default function WaitingTournament({ numberplayer }: WaitingTournamentProps) {
  const [numplayer, setNumplayer] = useState(0);

  useEffect(() => {
    setNumplayer(numberplayer);
  }, [numberplayer]);  
  return (
    <div className="aspect-[4/3] flex justify-center items-center bg-[url('/images/waitingimage.png')] flex-col lm:flex-row space-y-3 lm:space-y-0 lm:space-x-3
                    3xl:w-[800px] 2xl:w-[700px] xl:w-[600px] lm:w-[500px] ls:w-[400px] w-[300px] bg-cover bg-center border border-white border-opacity-30 rounded-[30px]  opacity-90">
        <div className='flex justify-center items-center space-x-3 '>
            <div className={`bg-[url('/images/avta.png')] 2xl:w-[100px] 2xl:h-[100px] xl:w-[80px] xl:h-[80px] lm:w-[70px] lm:h-[70px]
                              ls:w-[60px] ls:h-[60px] w-[50px] h-[50px]
                             border ${ numplayer >= 1 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
            </div>
            <div className={`bg-[url('/images/avta.png')] 2xl:w-[100px] 2xl:h-[100px] xl:w-[80px] xl:h-[80px] lm:w-[70px] lm:h-[70px]
                              ls:w-[60px] ls:h-[60px] w-[50px] h-[50px]
                              border ${ numplayer >= 2 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
            </div>
        </div>
        <div className='flex justify-center items-center space-x-3'>
            <div className={`bg-[url('/images/avta.png')] 2xl:w-[100px] 2xl:h-[100px]
                              xl:w-[80px] xl:h-[80px] lm:w-[70px] lm:h-[70px] ls:w-[60px] ls:h-[60px] w-[50px] h-[50px]
                              border ${ numplayer >= 3 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
            </div>
            <div className={`bg-[url('/images/avta.png')] 2xl:w-[100px] 2xl:h-[100px]
                              xl:w-[80px] xl:h-[80px] lm:w-[70px] lm:h-[70px] ls:w-[60px] ls:h-[60px] w-[50px] h-[50px]
                             border ${ numplayer >= 4 ? 'border-yellow-300': 'border-black opacity-40'} bg-cover bg-center rounded-[100px]`}>
            </div>
        </div>
    </div>
  )
}
