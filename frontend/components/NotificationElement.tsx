import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillMessage } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BsPersonCheckFill } from "react-icons/bs";
import { getCookies } from '@/components/auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNotificationContext } from './context/NotificationContext'
import { useTranslation } from 'react-i18next';

type Props = {
    Url: string,
    Avatar: string,
    Description: string,
    Date: string,
    Key: string,
    IsRead: boolean,
    FullName: string,
}


function NotificationElement({Url, Avatar, Description, Date, Key, IsRead, FullName}: Props) {

  const {notifications, setNotifications} = useNotificationContext()
  const {t} = useTranslation()
  
  const handleClick = async (notificationId) => {
    const body = {
      id: notificationId
    }
    try {
      const cookies = await getCookies();
      const csrfToken = cookies.cookies.csrftoken;
      const response = await axios.post('https://localhost/api/notifications/mark-as-read/', body, {
        headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setNotifications(notifications.map(notification => {
          if (notification.id === notificationId) {
            return {
              ...notification,
              is_read: true
            }
          }
          return notification
        }))
      }
    } catch (error) {
      toast.error(error.response.data)
    }
  }

  return (
      <Link href={Url} onClick={() => handleClick(Key)} className={`w-full ${!IsRead ? 'bg-white/5 text-white/1000' : 'text-white/60'}  p-4 flex gap-3 hover:cursor-pointer`}>
        <div className='w-[60px] h-[60px] rounded-full'>
          <Image className='rounded-full' width={60} height={60} src={Avatar} alt='user_image'></Image>
        </div>
        <div className='flex flex-col gap-3'>
          <span className='text-[18px]'>{FullName + ' ' + t(Description.split(FullName)[1])}</span>
          <span className='text-[15px]'>{t(Date.split(',')[0]) + ',' + Date.split(',')[1]}</span>
        </div>
      </Link>
  )
}

export default NotificationElement