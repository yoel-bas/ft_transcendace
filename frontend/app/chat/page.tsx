'use client'

import React, { useEffect, useRef, useState } from 'react'
import Conversations from './Conversations'
import Chat from './Chat'
import axios from 'axios'
import { truncateMessage } from '../../utils/tools';
import { ChatProvider } from '../../components/context/ChatContext';
import AlertDialog from '../../components/AlertDialog'

function ChatPage() {
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  return (
    <ChatProvider>
      <div className='w-full h-full flex items-center justify-center'>
        <div className='text-white w-[97%] h-full flex flex-col bg-black bg-opacity-60 rounded-[50px] border border-white border-opacity-30 sm:border sm:rounded-[50px] sm:w-[90%] sm:h-[90%] xl:w-[80%] xl:h-[90%] lg:flex-row'>
          <Conversations />
          <Chat setShowBlockDialog={setShowBlockDialog} />
          {showBlockDialog && <AlertDialog showBlockDialog={showBlockDialog} setShowBlockDialog={setShowBlockDialog}/>}
        </div>
      </div>
    </ChatProvider>
  )
}

export default ChatPage