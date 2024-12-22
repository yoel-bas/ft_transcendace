'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { autocompleteClasses } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import { useUserContext } from './usercontext';
import { redirect } from 'next/navigation';
import { Bounce } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isFriendRequest, setIsFriendRequest] = useState(false);
    const [notificationsLoading, setNotificationsLoading] = useState(true);
    // const [notifSocket, setNotifSocket] = useState(null);
    const notifSocket = useRef(null);
    const { t } = useTranslation();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useUserContext();

    const AcceptInvite = (socket: WebSocket, sender: string, receiver: string) => {
        socket.send(JSON.stringify({"notif_type": "accept_game", "sender": receiver, "receiver": sender,
                        "title": "Accept Game", "description": "I accept your game invitation"
                }));
                const query = new URLSearchParams({
                    type: 'invite',
                    sender: sender,
                    receiver: receiver,
                }).toString();
            
                redirect(`/game/remotegame?${query}`);
    }

    const removeNotifications = (senderId, receiverId) => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => (notification.sender_info.id !== senderId || notification.receiver_info.id !== receiverId) && notification.notif_type === 'message')
        );
    };

    const Msg = ({sender, receiver}) => (
        <div className='flex justify-end flex-col'>
            <p className='text-xs'>{t(`You have been invited to a game by ${sender.full_name}`)}</p>
            <div className='flex justify-around items-center w-full'>
                <button onClick={
                    () => {
                        notifSocket.current.send(JSON.stringify({"notif_type": "reject_game", "sender": receiver.username, "receiver": sender.username,
                    "title": "Reject Game", "description": "I reject your game invitation"
                    }));
                    }
                }>Reject</button>
                <button onClick={
                    () => {
                        notifSocket.current.send(JSON.stringify({"notif_type": "accept_game", "sender": receiver.username, "receiver": sender.username,
                    "title": "Accept Game", "description": "I accept your game invitation"
                    }));
                    const query = new URLSearchParams({
                        type: 'invite',
                        sender: sender.username,
                        receiver: receiver.username,
                    }).toString();
                        redirect(`/game/remotegame?${query}`);
                    }

                }>Accept</button>
            </div>
        </div>
    );

    useEffect(() => {
        if (authUser !== null) {
            if (!notifSocket.current)
                notifSocket.current = new WebSocket("wss://localhost/ws/notification/");
            notifSocket.current.onopen = () => {
              console.log("Connected to notification status");
            };

            notifSocket.current.onmessage = (message) => {
                const newNotification = JSON.parse(message.data);
                setIsFriendRequest(false);
                if (newNotification.notif_type === 'invite_game') {
                    toast(<Msg sender={newNotification.sender_info} receiver={newNotification.receiver_info} />, 
                    {
                        autoClose: 8000,
                        theme: "dark",
                        position: 'top-right',
                        style: {
                            width: '300px',
                            height: '100px'
                        }
                    });
                    return;
                }
                else if (newNotification.notif_type === 'friend_request') {
                    setIsFriendRequest(true);
                    toast.info(t(`${newNotification.description}`),
                    {
                        position: 'top-right',
                        transition: Bounce,
                    });
                }
                else if (newNotification.notif_type === 'message') {
                    setIsFriendRequest(true);
                    toast.info(t(`${newNotification.description}`),
                    {
                        position: 'top-right',
                        transition: Bounce,
                    });
                }
                else if (newNotification.notif_type === 'accept_game') {
                    toast.success(t(`${newNotification.sender_info.full_name} has accepted your game invitation`),
                    {
                        autoClose: 8000,
                        theme: "dark",
                        position: 'top-right',
                        style: {
                            width: '400px',
                            height: '100px'
                        }
                    });
                    const query = new URLSearchParams({
                        type: 'invite',
                        sender: newNotification.receiver_info.username,
                        receiver: newNotification.sender_info.username,
                    }).toString();
                    redirect(`/game/remotegame?${query}`);
                    return;
                }
                else if (newNotification.notif_type === 'reject_game') {
                    toast.error(t(`${newNotification.sender_info.full_name} has rejected your game invitation`),
                    {
                        autoClose: 8000,
                        theme: "dark",
                        position: 'top-right',
                        style: {
                            width: '400px',
                            height: '100px'
                        }
                    });
                    return;
                }
                else if (newNotification.notif_type === 'players_warning') {
                    toast.info(t(`${newNotification.description}`),
                    {
                        autoClose: 8000,
                        theme: "dark",
                        position: 'top-right',
                        style: {
                            width: '400px',
                            height: '100px'
                        }
                    });
                    return;
                }
                removeNotifications(newNotification.sender_info.id, newNotification.receiver_info.id);
                setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            };

            notifSocket.current.onclose = () => {

            };

            notifSocket.current.onerror = (error) => {

            }

        }
        else
        {
            if (notifSocket.current !== null && notifSocket.current.readyState === WebSocket.OPEN) {
                notifSocket.current.close();
                notifSocket.current = null;
            }
        }
    }, [authUser]);

    const fetchNotifications = async () => {
        try {
            setNotificationsLoading(true);
            const response = await axiosInstance.get('notifications/');
            if (response.status === 200) {
                setNotifications(response.data);
            }
        }
        catch (error) {
            toast.error(t('Failed to fetch notifications'));
        }
        finally {
            setNotificationsLoading(false);
        }
    }

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, notifSocket, fetchNotifications, isFriendRequest }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (context === null) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}