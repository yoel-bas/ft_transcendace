import React, { useEffect } from 'react'
import { useNotificationContext } from './context/NotificationContext'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { getCookies } from '@/components/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Link from 'next/link'
import { AiFillMessage } from "react-icons/ai";
import NotificationElement from './NotificationElement'
import { BounceLoader } from 'react-spinners'

function NotificationMenu() {

  const {fetchNotifications, notifications, notificationsLoading} = useNotificationContext()
  const router = useRouter()

  // useEffect(() => {
  //   fetchNotifications()
  // }, [])

  if (notificationsLoading) {
    return <div className='text-white fixed w-[95%] md:w-[calc(100%_-_100px)] h-[600px] flex flex-row-reverse z-50'></div>
  }

  return (
    <div className='text-white fixed w-[95%] md:w-[calc(100%_-_100px)] h-[600px] flex flex-row-reverse z-50'>
        <div className='w-full sm:w-[500px] sm:mr-[130px] h-full bg-[#201f1f] rounded-[30px] text-white flex flex-col'>
          <div className='w-full h-[65px] flex items-center border border-white border-t-0 border-r-0 border-l-0 border-opacity-20'>
            <h1 className='text-[22px] ml-4'>Notifications</h1>
          </div>
          <div className='h-[calc(100%_-_65px)] w-full scrollbar-none overflow-y-auto scroll-smooth'>
            {notifications?.map((notification) => {
              return (
                <div key={notification?.id}>
                  {
                    notification.notif_type === 'friend_request' &&
                    <NotificationElement Url='/friend-requests?section=requests' Avatar={notification?.sender_info.avatar_url} FullName={notification?.sender_info.full_name} Description={notification?.description} Date={notification?.get_human_readable_time} Key={notification?.id} IsRead={notification?.is_read} />
                  }
                  {
                    notification.notif_type === 'message' &&
                    <NotificationElement Url={`/chat/?username=${notification?.sender_info.username}`} FullName={notification?.sender_info.full_name} Avatar={notification?.sender_info.avatar_url} Description={notification?.description} Date={notification?.get_human_readable_time} Key={notification?.id} IsRead={notification?.is_read} />
                  }
                  {
                    notification.notif_type === 'accept_friend_request' &&
                    <NotificationElement Url='/friend-requests?section=friends' Avatar={notification?.sender_info.avatar_url} FullName={notification?.sender_info.full_name} Description={notification?.description} Date={notification?.get_human_readable_time} Key={notification?.id} IsRead={notification?.is_read} />  
                  }
                </div>
            )})}
          </div>
        </div>
    </div>
  )
}

export default NotificationMenu