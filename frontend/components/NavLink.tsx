import Link from 'next/link'
import React from 'react'

type Props = {
    children: React.ReactNode,
    href: string,
    isActive?: boolean
}

function NavLink({children, href, isActive}: Props) {
  return (
    <Link href={href} className={isActive ? "w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] flex items-center justify-center bg-white bg-opacity-15 rounded-[7px]" : ''}>{children}</Link>
  )
}

export default NavLink