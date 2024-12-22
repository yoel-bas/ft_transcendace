'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from './usercontext';

const OnlineStatusContext = createContext(null);

export const OnlineStatusProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    // const [onlineSocket, setOnlineSocket] = useState(null);
    const { t } = useTranslation();
    const {authUser} = useUserContext();
    const onlineSocket = useRef(null);

    useEffect(() => {
        if (authUser !== null) {
            if (!onlineSocket.current) {
                onlineSocket.current = new WebSocket("wss://localhost/ws/online/");
            }
      
            onlineSocket.current.onmessage = (message) => {
                setOnlineUsers(JSON.parse(message.data));
            };
        }
        else
        {
            if (onlineSocket.current !== null && onlineSocket.current.readyState === WebSocket.OPEN) {
                onlineSocket.current.close();
                onlineSocket.current = null;
            }
        }
    }, [authUser]);

    return (
        <OnlineStatusContext.Provider value={{ onlineUsers }}>
            {children}
        </OnlineStatusContext.Provider>
    );
}

export const useOnlineStatus = () => {
    const context = useContext(OnlineStatusContext);
    if (!context) {
        throw new Error('useOnlineStatus must be used within a OnlineStatusProvider');
    }
    return context;
}