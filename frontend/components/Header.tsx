'use client'
import React, { use } from 'react'
import Image from 'next/image'
import TextBox from './TextBox';
import Link from 'next/link';
import {UserContext, useUserContext} from './context/usercontext';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import BounceLoader from "react-spinners/ClipLoader";
import { IoIosNotifications, IoIosNotificationsOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { CiCamera } from "react-icons/ci";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getCookies } from './auth';
import { useNotificationContext } from './context/NotificationContext'

function Header({setNotificationClicked, notificationClicked, setProfileDropDownClicked, profileDropDownClicked}) {
  const { authUser, fetchAuthUser, setSearchInput, setIsSearching} = useContext(UserContext);
  const { t } = useTranslation();
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [imageUploaded, setImageUploaded] = useState(false);
  const {notifications, fetchNotifications} = useNotificationContext()
  const [unreadNotifications, setUnreadNotifications] = useState('0');

  const handleNotificationClick = () => {
    setProfileDropDownClicked(false);
    setNotificationClicked(!notificationClicked);
    if (notificationClicked === true) {
      fetchNotifications();
    }
  }

  const handleProfileClick = () => {
    setNotificationClicked(false);
    setProfileDropDownClicked(!profileDropDownClicked);
  }

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setIsSearching(true);
  }

    
  const uploadImage = async () => {
    const fileInput = document.getElementById("file") as HTMLInputElement;
  
    if (!fileInput?.files?.[0]) {
      toast.error("Please select a file");
      return;
    }
  
    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);
  
    try {
      const cookies = await getCookies();
      const csrftoken = cookies.cookies.csrftoken;
  
      const response = await axios.put(`${API}/update/`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrftoken,
        },
      });
  
      if (response.status === 200) {
        setImageUploaded(true);
        toast.success("Image Changed Successfully");
      }
    } catch (error) {
      toast.error("Error uploading image");
      setImageUploaded(false);
    }
  };
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_SIZE) {
        toast.error("File size too large. Max size is 5MB");
        return;
      }
      uploadImage();
    }
  };

  useEffect(() => {
    fetchAuthUser();
    setImageUploaded(false);
  }
  , [imageUploaded])
  useEffect(() => {
    const unreadNotifications = notifications.filter(notification => notification.is_read === false).length
    if (unreadNotifications > 99) {
      setUnreadNotifications('+99')
    }
    else {
      setUnreadNotifications(unreadNotifications)
    }
  }, [notifications])

  return (
    <header className='text-white flex justify-between items-center p-[10px]'>
      <div>
        <Link href='/'><Image src='/icons/logo.png' priority height={60} width={60} alt='logo'/></Link>
      </div>
      <div className='sm:w-[400px] md:w-[500px] lg:w-[600px] 2xl:w-[700px] w-[50%] h-[60px]'>
        <TextBox focus={false}  id='textsearch-id' onChange={(e) => handleInputChange(e)} placeholder={t('Search')} icon='/icons/search.png' className='border border-white border-opacity-30 w-full h-full bg-black bg-opacity-50 rounded-[30px] flex items-center'/>
      </div>
      <div className='w-[170px] flex justify-between'>
        <button id='notification-id' onClick={handleNotificationClick} className={`h-[70px] w-[70px] bg-white bg-opacity-0 rounded-full flex items-center justify-center hover:bg-opacity-15 hover:cursor-pointer relative`}>
          <div className='w-[25px] h-[25px] rounded-full bg-red-500 absolute top-2 right-2 flex items-center justify-center text-center'>
            <span className={`${unreadNotifications === '+99' ? 'text-[12px]' : 'text-[14px]'}`}>{unreadNotifications}</span>
          </div>
          {
            notificationClicked === true ? 
            <IoIosNotifications id='notification-id' className='text-white h-[50px] w-[50px]'/> : 
            <IoIosNotificationsOutline id='notification-id' className='text-white h-[50px] w-[50px]'/>
          }
        </button>
          {authUser?.avatar_url ?
          (
            <div
            className={`relative border border-white border-opacity-30 h-[70px] w-[70px] 
            bg-white bg-opacity-50 rounded-full flex items-center justify-center group`}
          >
            <Image
             title={authUser?.username}
              id="profile-id"
              src={authUser?.avatar_url}
              height={70}
              width={70}
              alt="avatar"
              className="rounded-full"
            />
            <input
              className="hidden"
              type="file"
              name="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 
              rounded-full opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
            >
              <CiCamera
                className="w-8 h-8 text-white rounded-full p-1 transition duration-200 hover:text-white"
              />
            </label>
            <div
              className="absolute bottom-1 left-1 text-xs text-opacity-50 border border-white border-opacity-30 
              bg-[#7ED4AD] rounded-[10px] p-[5px]"
              id="profile-dropdown-id"
            ></div>
          </div>
          ) : (
        <div className='w-full flex justify-center items-center h-full text-white text-opacity-50 text-xs'>
          <BounceLoader color={'#949DA2'} loading={true} size={50} />
        </div>)}
      </div>
    </header>
  )
}

export default Header