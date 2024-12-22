'use client'

import React, { useEffect, useState } from 'react'
import Image from "next/image";
import TextBox from '../../components/TextBox';
import { axiosInstance } from '../../utils/axiosInstance';
import { cookies } from 'next/headers';
import { useUserContext } from '../../components/context/usercontext';
import { useRef } from 'react';
import { truncateMessage } from '../../utils/tools';
import { useChatContext } from '../../components/context/ChatContext';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { BounceLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function Conversations() {
  
  const {authUser, loading} = useUserContext()
  const [input, setInput] = useState('')
  const
  {
    Conversations,
    fetchConversations,
    conversationsLoading,
    setSelectedConversation,
    selectedConversation,
    setConversations,
    setOtherUser,
    isMobile,
    refScroll
  } = useChatContext()
  
  const {t} = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendUserName = searchParams.get('username');
  
  useEffect(() => {
    if (friendUserName) {
      axiosInstance.get(`/chat/conversations/`, {
        params: {friend_username: friendUserName}
      })
      .then((response) => {
        if (response.data.length > 0) {
          setSelectedConversation(response.data[0])
          authUser?.username === response.data[0].user1_info.username ? setOtherUser(response.data[0].user2_info) : setOtherUser(response.data[0].user1_info)
        }
        else
        {
          setOtherUser(null)
          setSelectedConversation(null)
        }
      })
      .catch((err) => {
        toast.error(t('Error fetching conversation'))
      })
    }
  }, [])

  
  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation)
    authUser?.username === conversation.user1_info.username ? setOtherUser(conversation.user2_info) : setOtherUser(conversation.user1_info)
  }

  const handleConversationSearch = (e) => {
    let search = e.target.value
    if (search.length === 0) {
      fetchConversations()
    } else {
      axiosInstance.get(`/chat/search/`, {
        params: {search: search}
      })
      .then((response) => {
        setConversations(response.data)
      })
      .catch((err) => {
        toast.error(t('Error searching conversation'))
      })
    }
  }

  const returnConversationImage = (conversation) => {
    let otherUser = authUser?.username === conversation.user1_info.username ? conversation.user2_info : conversation.user1_info
    return otherUser?.avatar_url
  }
  
  if (loading === true || conversationsLoading === true) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <BounceLoader size={320} color='#1f959d' />
      </div>
    )
  }
  
  return (
    <div className={`whitespace-pre-wrap w-full h-full lg:w-[400px] 2xl:w-[550px] ${isMobile && selectedConversation ? 'hidden' : 'flex flex-col'}`}>
            <div className='h-[200px]'>
              <div className='h-[120px] flex gap-4 p-[20px]'>
                <div className='relative h-[80px] w-[80px] rounded-full'>
                  <Image className='rounded-full' src={authUser?.avatar_url} width={80} height={80} alt='avatar'/>
                  <div className='absolute bottom-1 right-1 text-xs text-opacity-50 border border-white border-opacity-30 bg-[#7ED4AD] rounded-full p-[5px]'></div>
                </div>
                <div className='flex flex-col justify-center gap-4'>
                  <span className='text-[17px] sm:text-[20px]'>{authUser?.full_name}</span>
                  <span className='text-[15px] sm:text-[18px] text-white text-opacity-65'>{t('Online')}</span>
                </div>
              </div>
              <div className='h-[100px] flex items-center justify-center'>
                <TextBox focus={false}  onChange={(e) => handleConversationSearch(e)} placeholder={t('Search')} icon='/icons/search.png' className='border border-white border-opacity-20 w-[95%] h-[70px] bg-white bg-opacity-10 rounded-[40px] flex items-center'></TextBox>
              </div>
            </div>
        <div className='mt-[20px] h-[calc(100%_-_270px)] no-scrollbar overflow-y-auto scroll-smooth'>
          {Conversations !== null && Conversations.map((conversation) => {
            return (
              <div onClick={() => handleConversationClick(conversation)} key={conversation.id} className={`${(selectedConversation && selectedConversation.id === conversation.id) && 'bg-white bg-opacity-10'} flex items-center gap-4 p-[20px]`}>
                <div className='h-[80px] w-[80px] rounded-full bg-blue-800'>
                  <Image className='rounded-full' src={returnConversationImage(conversation)} width={80} height={80} alt='avatar'/>
                </div>
                <div className='flex flex-col gap-4'>
                  {
                    authUser?.username === conversation.user1_info.username ?
                    <span className='text-[16px] sm:text-[20px]'>{conversation.user2_info.full_name}</span> :
                    <span className='text-[16px] sm:text-[20px]'>{conversation.user1_info.full_name}</span>
                  }
                  <span className='text-[15px] sm:text-[18px] text-white text-opacity-65'>{truncateMessage(t(conversation.last_message), 20)}</span>
                </div>
              </div>)
            })
          }
        </div>
    </div>
  )
}

export default Conversations