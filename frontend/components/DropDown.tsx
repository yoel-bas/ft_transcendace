import React from 'react'
import Link from 'next/link'
import { getCookies, logout } from './auth';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from './context/usercontext';

type Props = {
    className?: string,
    items: string[],
    url?: string
}

function DropDown({className, items}: Props) {
    const router = useRouter();
    const {setIsAuthenticated, setauthUser} = useContext(UserContext);
    const handleLogout = async () => {
        const cookies = await getCookies();
        const csrfToken = cookies.cookies.csrftoken
        if (csrfToken)
            await logout(csrfToken, setIsAuthenticated, setauthUser, router);
    };
    
  return (
    <div className=''>
        {
            items.map((item, index) => {
                return (
                    <div key={index} className={className}>
                        <Link href="" onClick={item === 'Logout' ? handleLogout : () => {}}
                         className='text-white ml-4'>{item}</Link>
                    </div>
                )
            })
        }
    </div>
  )
}

export default DropDown