'use client'
import React from 'react'
import { useState } from 'react'
import TournamentSyst from '../../../../components/TournSystem'
import WinnerTour from '@/components/WinnerTour'
import WaitingTournament from '@/components/WaitingTournament'
import { useTranslation } from 'next-i18next'


export default function TournamentRemote() {
    const { t } = useTranslation()
    const [player, setPlayer] = useState('')
    const [form, setForm] = useState(false)
    const [userExist, setUserExist] = useState(false)
    const [message, setMessage] = useState('')
    const [gamEnd, setGameEnd] = useState(false)
    const [playerExit, setPlayerExit] = useState('')
    const [winner, setWinner] = useState('')
    const [img, setImg] = useState('')

    const handlSubmit = (e) => {
        e.preventDefault()
        setForm(true)
    }
    const HandleUserExist = (exist, playerExit, message) => {
        setUserExist(true)
        setMessage(message)
        setPlayerExit(playerExit)
        setForm(false)
    }

    const handleGameEnd = (winer, img) => {
        setWinner(winer)
        setImg(img)
        setGameEnd(true)
    }

  return (
    <div className="w-full h-full flex justify-center items-center">
        <div className='w-[90%] h-[80vh] flex justify-center items-center flex-col  ml-[28px]
                        md:border md:border-white md:border-opacity-30
                        md:bg-black md:bg-opacity-20
                        md:rounded-[50px]'>
                
            {!form ? (
                <div className='flex justify-center items-center'>
                    <div className="3xl:w-[450px] 3xl:h-[550px] 3xl:space-y-[150px] border border-white border-opacity-20 bg-[url('/images/tour7.png')] bg-cover bg-centre flex justify-center items-center flex-col rounded-[20px]
                                    l:w-[400px] l:h-[500px] l:space-y-[120px]
                                    lm:w-[400px] lm:h-[500px] lm:space-y-[120px]
                                    xs:w-[300px] xs:h-[400px] xs:space-y-[100px]
                                    w-[200px] h-[300px] space-y-[30px]">
                        <h1 className='text-white font-bold 3xl:mt-[40px] l:mt-[40px] lm:mt-[40px] ls:mt-[30px] mt-[30px]'>{t("Join Tournament")}</h1>
                        <form action="" className='flex flex-col items-center h-full' onSubmit={handlSubmit}>
                            <input type="text" id="player" placeholder="AliasName" required
                                        value={player}
                                        onChange={(e) => setPlayer(e.target.value)}
                                        className='w-[70%] h-10 bg-transparent border-b ml-[20px] border-white border-opacity-30 text-white text-center'/>
                                        <div className="relative w-full">
                                            {userExist && (
                                                <div className="absolute text-red-500 text-center text-sm">
                                                {playerExit} {message}
                                                </div>
                                            )}
                                        </div>
                            <button type='submit' className='bg-blue-500 text-white rounded-lg w-[30%] p-2 3xl:mt-[150px] l:mt-[130px] lm:mt-[130px] xs:mt-[90px]'>Join</button>
                        </form>
                    </div>
                </div>
            ) : (
                !gamEnd ? (<TournamentSyst PlayerName={player} HandleUserExist={HandleUserExist} GameEnd={handleGameEnd} />) : (<WinnerTour winner={winner} img={img}  />)
            )}
        </div>
    </div>
  )
}
