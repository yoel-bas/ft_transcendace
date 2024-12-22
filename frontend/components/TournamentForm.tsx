'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function TournamentForm({ onSubmit }) {
    const { t } = useTranslation()
    const [player1, setPlayer1] = useState('')
    const [player2, setPlayer2] = useState('')
    const [player3, setPlayer3] = useState('')
    const [player4, setPlayer4] = useState('')
    const [error, setError] = useState('')

    const validateNames = (names) => {
        const uniqueNames = new Set(names)
        if (uniqueNames.size !== names.length) {
            return 'Player names must be unique'
        }
        for (const name of names) {
            if (name.length > 9) {
                return 'Player names must not exceed 9 characters'
            }
        }
        return ''
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const playerNames = [player1, player2, player3, player4]
        const validationError = validateNames(playerNames)
        if (validationError) {
            setError(validationError)
            return
        }
        setError('')
        onSubmit({ player1, player2, player3, player4 })
        setPlayer1('')
        setPlayer2('')
        setPlayer3('')
        setPlayer4('')
    }

    return (
        <div className='flex justify-center items-center'>
            <div className="aspect-[3/4] bg-[url('/images/tour7.png')] bg-cover bg-centre border-white border-opacity-30 rounded-xl
                            border border-white/50
                            w-[330px]
                            xs:w-[300px]
                            ls:w-[400px]
                            lm:w-[500px]
                            3xl:w-[530px]
                            4xl:w-[530px]">
                <div className='text-white text-center text-2xl mt-5
                                xs:mt-[30px]
                                ls:mt-[38px]
                                sm:mt-[40px]
                                md:mt-[45px]
                                lm:mt-[50px]
                                2xl:mt-[55px]
                                3xl:mt-[60px]
                                4xl:mt-[60px]  font-Bruno'>Create Tournament</div>
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    {error && <div className='text-red-500 text-center text-sm'>{error}</div>}
                    <div className='flex justify-between w-full'>
                        <div className='flex flex-col w-[50%] space-y-2 relative top-4 bg-black/40'>
                            <label htmlFor="player1" className='text-white  ml-2
                                            xs:mt-[30px]
                                            ls:mt-[38px]
                                            sm:mt-[40px]
                                            md:mt-[45px]
                                            lm:mt-[50px]
                                            2xl:mt-[55px]
                                            3xl:mt-[60px]
                                            4xl:mt-[60px] font-Kecil font-bold '>{t("player1")}</label>
                            <input type="text" id="player1" placeholder="Player 1" required
                                value={player1}
                                onChange={(e) => setPlayer1(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-5 border-white border-opacity-30 text-white text-center'/>
                        </div>
                        <div className='flex flex-col w-[50%] mt-[40px] space-y-2 bg-black/40'>
                            <label htmlFor="player2" className='text-white mt-3 mr-2 flex justify-end 
                                            xs:mt-[30px]
                                            ls:mt-[38px]
                                            sm:mt-[40px]
                                            md:mt-[45px]
                                            lm:mt-[50px]
                                            2xl:mt-[55px]
                                            3xl:mt-[60px]
                                            4xl:mt-[60px] font-Kecil font-bold '>{t("player2")}</label>
                            <input type="text" id="player2" placeholder="Player 2" required
                                value={player2}
                                onChange={(e) => setPlayer2(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-[30px] border-white border-opacity-30 text-white text-center'/>
                        </div>
                    </div>
                    <div className='flex justify-between w-full'>
                        <div className='flex flex-col w-[50%] space-y-2 bg-black/40'>
                            <label htmlFor="player3" className='text-white mt-10 ml-2
                                            xs:mt-[30px]
                                            ls:mt-[38px]
                                            sm:mt-[40px]
                                            md:mt-[45px]
                                            lm:mt-[50px]
                                            2xl:mt-[55px]
                                            3xl:mt-[60px]
                                            4xl:mt-[60px] font-Kecil font-bold'>{t("player3")}</label>
                            <input type="text" id="player3" placeholder="Player 3" required
                                value={player3}
                                onChange={(e) => setPlayer3(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-5 border-white border-opacity-30 text-white text-center'/>
                        </div>
                        <div className='flex flex-col w-[50%] mt-[40px] space-y-2 bg-black/40'>
                            <label htmlFor="player4" className='text-white mt-20 mr-2 flex justify-end 
                                            xs:mt-[30px]
                                            ls:mt-[38px]
                                            sm:mt-[40px]
                                            md:mt-[45px]
                                            lm:mt-[50px]
                                            2xl:mt-[55px]
                                            3xl:mt-[60px]
                                            4xl:mt-[60px] font-Kecil font-bold'>{t("player4")}</label>
                            <input type="text" id="player4" placeholder="Player 4" required
                                value={player4}
                                onChange={(e) => setPlayer4(e.target.value)}
                                className='w-[70%] h-10 bg-transparent border-b ml-[30px] border-white border-opacity-30 text-white text-center'/>
                        </div>
                    </div>
                    <button type="submit" className='w-[30%] h-10 bg-white/80 text-black mt-2 ml-[35%] rounded-[30px]
                                                    xs:mt-[3px]
                                                    ls:mt-[3px]
                                                    sm:mt-[4px]
                                                    md:mt-[3px]
                                                    lm:mt-[8px]
                                                    2xl:mt-[2px]
                                                    3xl:mt-[150px]
                                                    4xl:mt-[150px] text-[1.2rem]'>{t("Go")}</button>
                </form>
            </div>
        </div>
    )
}