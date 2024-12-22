import Link from 'next/link'
import React from 'react'

function GameMode (info : any) {
    return(

         <div    className="flex flex-col justify-center items-center lg:h-[42%] lg:w-[96%] xs:h-[48%] xs:w-[100%] rounded-3xl bg-cover bg-center bg-black bg-opacity-60 bg-blend-overlay border_cus_mode hover:bg-opacity-0 hover:cursor-pointer " 
                style={{ backgroundImage: `url(${info.bg})` }} >
            <h1 className='text-[white] font-custom-t 2xl:text-[66px] lg:text-[40px] ' >{info.type}</h1>
            <p className='text-[#c8c6c6] 2xl:text-[20px] xs:text-[10px] text-[15px]  text-center'>{info.des}</p>
        </div>
    )

}
export default GameMode