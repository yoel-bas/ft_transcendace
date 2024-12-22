import React from 'react'
import { MdBlock } from "react-icons/md";
import { GiSpy } from "react-icons/gi";

type Props = {
    Type: string,
    Description: string,
}

function AnonyBlockedPage({Type, Description}: Props) {
  return (
    <div className='w-[75%] h-[85%] border border-white/30 bg-black/50 flex items-center justify-center rounded-[40px] p-3'>
        {
            <div className='flex flex-col items-center gap-4'>
                {Type === 'Blocked' ? <MdBlock className='text-white w-[250px] h-[250px]' /> : <GiSpy className='text-white w-[250px] h-[250px]' />}
                <div className='text-white text-center text-[22px]'>{Description}</div>
            </div>
        }
    </div>
  )
}

export default AnonyBlockedPage