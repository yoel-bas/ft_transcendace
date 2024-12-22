'use client'

import React from 'react'
import Image from 'next/image'

type Props = {
    focus: boolean,
    placeholder: string,
    icon?: string,
    className: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void,
    input?: string,
    id?: string,
    disabled?: boolean
}

//border border-white border-opacity-30 w-full h-full bg-black bg-opacity-50 rounded-[30px] flex items-center

function TextBox({focus, placeholder, icon, className, onChange, onKeyUp, onClick, input, id, disabled}: Props) {
  return (
    <div className={className}>
        <div className='ml-[15px] mr-[15px]'>
          {icon != undefined ? <Image className='opacity-60' src={icon} alt='icon' width={32} height={32}/> : null}
        </div>
        <input autoFocus={focus} id={id} disabled={disabled} value={input} onClick={onClick} onKeyUp={onKeyUp} onChange={onChange} type='text' placeholder={placeholder} className='text-white w-full h-full bg-transparent border-none rounded-[inherit] focus:outline-none p-[5px]'/>
    </div>
  )
}

export default TextBox