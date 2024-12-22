"use client"
import Link from 'next/link'
import React, { use, useContext } from 'react'
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoLogoGameControllerB } from "react-icons/io";
import { GiLaurelsTrophy } from "react-icons/gi";
import { FaUser } from "react-icons/fa6";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { BsList } from "react-icons/bs";
import {useRef, useState} from "react";
import {white} from "next/dist/lib/picocolors";
import NavLink from './NavLink';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserFriends } from "react-icons/fa";
import { getCookies, logout } from './auth';
import { UserContext } from './context/usercontext';
import MatchSelect from './MatchSelect';
function Sidebar() {
    const pathname = usePathname();
    const chat = pathname.startsWith('/chat');
    const game = pathname.startsWith('/game');
    const profile = pathname.startsWith('/profile');
    const settings = pathname.startsWith('/settings');
    const tournament = pathname.startsWith('/tournament');
    const friendrequests = pathname === '/friend-requests';
    const [gameOpen, setGameOpen] = useState(false);
    const [tourOpen, setTourOpen] = useState(false);
    const router = useRouter();
    const {setIsAuthenticated, setauthUser} = useContext(UserContext);

    const handleLogout = async () => {
        const cookies = await getCookies();
        const csrfToken = cookies.cookies.csrftoken
        if (csrfToken)
            await logout(csrfToken, setIsAuthenticated, setauthUser, router);
    };
    return (
        <>
        <nav className='w-full sm:w-[100px] sm:h-full h-16 flex sm:flex-col items-center justify-around sm:justify-center sm:gap-[5%]  xs:relative xs:-top-14 z-40'>
            <div className='
            flex sm:flex-col items-around justify-around sm:justify-center items-center sm:gap-[5%] w-full h-full sm:h-[80%] flex-row
            '>
            <button onClick={() => {setGameOpen(!gameOpen); setTourOpen(false)}}>
                <IoLogoGameControllerB title='Game' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/>
            </button>
            <button onClick={() => {setTourOpen(!tourOpen); setGameOpen(false)}} >
                <GiLaurelsTrophy title='Game' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/>
            </button>
            {/* <NavLink href='/game/tournament' isActive={tournament}><GiLaurelsTrophy title='Tournament' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink> */}
            <button onClick={() =>{ setTourOpen(false); setGameOpen(false)} }><NavLink href='/profile' isActive={profile}><FaUser title='Profile' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink></button>
            <button onClick={() =>{ setTourOpen(false); setGameOpen(false)} } ><NavLink href='/chat' isActive={chat}><IoChatbubblesSharp title='Chat' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink></button>
            <button onClick={() =>{ setTourOpen(false); setGameOpen(false)} } ><NavLink href='/friend-requests' isActive={friendrequests}><FaUserFriends title='Friends Requests' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] hover:text-opacity-100 transition'/></NavLink></button>
            <button onClick={() =>{ setTourOpen(false); setGameOpen(false)} } ><NavLink href='/settings' isActive={settings}><IoSettings title='Settings' className='text-white w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></NavLink></button>
            <button  onClick={() =>{ setTourOpen(false); setGameOpen(false) ; handleLogout } } className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] text-white block sm:hidden'><RiLogoutBoxLine title='Logout' className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></button>
            </div> 
            <button className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] sm:block hidden text-white' onClick={handleLogout}><RiLogoutBoxLine title='Logout' className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]'/></button>
         </nav>
        {gameOpen &&
            <div onClick={() => setGameOpen(!gameOpen)} className="mobile:w-full md:w-[90%] lg:w-[100%]   mobile:top-16 mobile:h-[90%] lg:h-full absolute md:right-0 tablet:-right-10    flex justify-center items-center mobile:p-4  md:p-0">
                <MatchSelect url1="/game" url2="/game/remotegame"  type="game" />
            </div>
        }
        {tourOpen &&
            <div onClick={() => setTourOpen(!tourOpen)} className="mobile:w-full md:w-[90%] lg:w-[100%]   mobile:top-16 mobile:h-[90%] lg:h-full absolute md:right-0 tablet:-right-10    flex justify-center items-center mobile:p-4  md:p-0">
                <MatchSelect url1="/game/tournament" url2="/game/tournament/remote" type="Tournament"/>
            </div>
        }
    </>
  )
}

export default Sidebar