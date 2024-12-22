'use client';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { axiosInstance } from '@/utils/axiosInstance'
import { UserContext, useUserContext } from '@/components/context/usercontext'
import Image from 'next/image'
import axios from 'axios'
import { getCookies } from '../../components/auth';
import { FaUserFriends } from "react-icons/fa";
import { TbMessageUser } from "react-icons/tb";
import { IoIosSend } from "react-icons/io";
import { MdBlockFlipped } from "react-icons/md";
import TextBox from '@/components/TextBox';
import { FaUsers } from "react-icons/fa";
import { fetchSearchResults, handleBlock, handleUnblock } from '@/components/friendHelper';
import {toast} from 'react-toastify'
import { useRouter } from 'next/navigation';
import { useNotificationContext } from '@/components/context/NotificationContext';
import { SlMenu } from "react-icons/sl";
import { MdMenuOpen } from "react-icons/md";
import { BounceLoader } from 'react-spinners';
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

function page() {
    const [friendRequests, setFriendRequests] = useState([]);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [friendRequestsSent, setFriendRequestsSent] = useState([]);
    const [friends, setFriends] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [isFriend, setIsFriend] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [requests, setRequests] = useState(true);
    const [sentRequest, setSentRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const {authUser,loading,} = useUserContext();
    const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);
    const [isUpdate, setIsUpdate] = useState(false);
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {notifications, isFriendRequest} = useNotificationContext();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
  
  const requestsRef = useRef(null);
  const friendsRef = useRef(null);

  useEffect(() => {
    const section = searchParams.get('section');

    if (section === 'friends') {
        setTimeout(() => {
            setIsFriend(true);
            
        }, 300);
      setRequests(false);
      setSentRequest(false);
      setIsBlocked(false);
      setIsSearch(false);
    } else if (section === 'requests') {
      setRequests(true);
      setIsFriend(false);
      setSentRequest(false);
      setIsBlocked(false);
      setIsSearch(false);
    }
  }, [searchParams]);
  
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearchInput(searchInput);
        }, 300);
    
        return () => clearTimeout(handler);
      }, [searchInput]);

      useEffect(() => {
        const fetchFriendRequests = async () => {
            setIsLoading(true);
            try {
                const res = await axiosInstance.get('friends/requests/');
                setFriendRequests(res.data.receive_requests);
                setFriendRequestsSent(res.data.send_requests);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
                setIsUpdate(false);
            }
        };
        fetchFriendRequests();
    }, [isUpdate, isSearch, requests, sentRequest, isFriend, isBlocked, isFriendRequest, notifications]);

    const handleAccept = async (requestId) => {
        const body = {
            id: requestId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`https://localhost/api/friends/requests/accept-request/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 200) {
                setIsUpdate(true);
                toast.success(response.data)
            }
          } catch (error) {
            toast.error(error.response.data)
          }
    }
    
    useEffect(() => {
        if (debouncedSearchInput !== "") {
            setIsUpdate(true);
          fetchSearchResults(debouncedSearchInput, setSearchResults, setSearchLoading);
        } else {
          setSearchResults([]);
        }
      }, [debouncedSearchInput]);
    
      const handleReject = async (requestId) => {
          const body = {
            id: requestId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`https://localhost/api/friends/requests/reject-request/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 200) {
                setIsUpdate(true);
                toast.success(response.data)
            }
          } catch (error) {
            toast.error(error.response.data)
          }
    }

    const createFriendRequest = async (receiverId, senderId) => {
        const body = {
            receiver: receiverId,
            sender: senderId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`https://localhost/api/friends/requests/create-request/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 201) {
                setIsUpdate(true);
                setSendSuccess(true);
                toast.success(response.data)
            }
          } catch (error) {
            toast.error(error.response.data)
          }
    }
    const getFriends = async () => {
        
        try {
            const res = await axiosInstance.get('auth/get-friends/')
            if (res.status === 200) {
                setFriends(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getBlockedUsers = async () => {
        try {
            const res = await axiosInstance.get('auth/get-blocked/')
            if (res.status === 200) {
                setBlockedUsers(res.data.blocked_users)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const removeFriend = async (friendId) => {
        const body = {
            id: friendId
        }
        try {
            const cookies = await getCookies();
            const csrfToken = cookies.cookies.csrftoken;
            const response = await axios.post(`https://localhost/api/friends/requests/remove-friend/`, body, {
              headers: {
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken,
              },
              withCredentials: true,
            });
            if (response.status === 200) {
                setIsUpdate(true);
                toast.success(response.data)
            }
          } catch (error) {
            toast.error(error.response.data)
          }
    }
    useEffect(() => {
        getFriends();
        getBlockedUsers();
    }, [isFriend, isBlocked, isUpdate, isLoading, notifications]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (!value || value.length < 1) {
            setSearchInput('');
            setSearchResults([]);
            return;
        }
        setSearchInput(value);
    };
    const handleChatClick = (username) => {
        router.push(`/chat/?username=${username}`);
    }
    
    if (loading) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className='border border-white/30 rounded-[30px] bg-black bg-opacity-50 w-[90%] h-[95%] flex items-center p-5'>
                    <BounceLoader size={320} color='#1f959d' />
                </div>
            </div>
        )
    }
    const handleMenuClick = (e) => {
        if (isMenuOpen && e.target.id !== 'menu') {
            setIsMenuOpen(false);
        }
    }
    useEffect(() => {
        document.addEventListener('click', handleMenuClick);
        return () => {
            document.removeEventListener('click', handleMenuClick);
        }
    }, [isMenuOpen])
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='border border-white/30 rounded-[30px] bg-black bg-opacity-50 md:w-[90%] ml-5 w-[90%] 3xl:w-[1700px] h-[90%] pr-10 p-5 
        overflow-hidden no-scrollbar
        '>
            <div className='flex justify-around w-full gap-2 h-[30px] sm:h-[50px]'>
            <button onClick={
                () => {
                    setTimeout(() => {
                    setRequests(true)
                    }
                    , 300);
                    setSentRequest(false)
                    setIsSearch(false)
                    setIsFriend(false)
                    setIsBlocked(false)
                    setIsUpdate(true);
                    setIsMenuOpen(false);
                    setSearchInput('');
                    setSearchResults([])
                }
            } className={`flex justify-start mx-2 xs:mx-0
                ${requests ? 'lg:border-b-2 border-[#37c8b7] text-[#37c8b7]' : 'text-white'}
            `}>
                <FaUserFriends className={`text-[25px] lg:text-[30px]  mr-2
                    ${requests ? 'text-[#37c8b7]' : 'text-white'}
                `} />
                <div className={`text-sm lg:text-lg hidden lg:block
                    ${requests ? 'text-[#37c8b7]' : 'text-white'}
                `}>{t("Requests")}</div>
            </button>
            <button onClick={
                () => {
                    setTimeout(() => {
                        setSentRequest(true)
                    }, 300);
                    setRequests(false)
                    setIsSearch(false)
                    setIsFriend(false)
                    setIsMenuOpen(false);
                    setIsBlocked(false)
                    setIsUpdate(true);
                    setSearchInput('');
                    setSearchResults([])
                }
            } className={`flex  justify-start mx-2 xs:mx-0 
                ${sentRequest ? 'lg:border-b-2 border-[#37c8b7] text-[#37c8b7]' : 'text-white'}
            `}
            >
                <TbMessageUser className={`text-[25px] lg:text-[30px] mr-2
                    ${sentRequest ? 'text-[#37c8b7]' : 'text-white'}
                `} />
                <div className={`text-sm lg:text-lg hidden lg:block
                    ${sentRequest ? 'text-[#37c8b7]' : 'text-white'}
                `}>{t("Sent")}</div>
            </button>
            <button onClick={
                () => {setSentRequest(false)
                    setRequests(false)
                    setIsSearch(false)
                    setTimeout(() => {
                        setIsFriend(true)
                    }, 300);
                    setIsBlocked(false)
                    setIsUpdate(true);
                    setSearchInput('');
                    setSearchResults([])
                }
            } className={`flex  justify-start mx-2 xs:mx-0 
                ${isFriend ? 'lg:border-b-2 border-[#37c8b7] text-[#37c8b7]' : 'text-white'}
            `}>
                <FaUsers className={`text-[25px] lg:text-[30px] mr-2
                    ${isFriend ? 'text-[#37c8b7]' : 'text-white'}
                `} />
                <div className={`text-sm lg:text-lg hidden lg:block
                    ${isFriend ? 'text-[#37c8b7]' : 'text-white'}
                `}>
                    {t("Friends")}
                </div>
            </button>
            <button onClick={
                () => {setSentRequest(false)
                    setRequests(false)
                    setIsSearch(false)
                    setIsFriend(false)
                    setIsMenuOpen(false);
                    setTimeout(() => {
                        setIsBlocked(true)
                    }, 300);
                    setIsUpdate(true);
                    setSearchInput('');
                    setSearchResults([])
                }
            } className={`flex  justify-start mx-2 xs:mx-0 
                ${isBlocked ? 'lg:border-b-2 border-[#37c8b7] text-[#37c8b7]' : 'text-white'}
            `}>
                <MdBlockFlipped className={`text-[25px] lg:text-[30px] mr-2
                    ${isBlocked ? 'text-[#37c8b7]' : 'text-white'}
                `} />
                <div className={`text-sm lg:text-lg hidden lg:block
                    ${isBlocked ? 'text-[#37c8b7]' : 'text-white'}
                `}>
                    {t("Blocked")}
                </div>
            </button>
            <button onClick={
                () => {setSentRequest(false)
                    setRequests(false)
                    setIsFriend(false)
                    setIsSearch(false)
                    setIsMenuOpen(false);
                    setIsBlocked(false)
                    setIsSearch(true)
                }
            } className={`flex justify-start mx-2 xs:mx-0
            `}>
                {!isSearch ?
                <>
                    <IoIosSend className='text-[25px] lg:text-[30px] text-white mr-2' />
                    <div className='text-white text-sm lg:text-lg hidden lg:block'>{t("Send")}</div>
                </>
                :
                <TextBox focus={true} onChange={(e) => handleInputChange(e)} placeholder='Search'
                    icon='/icons/search.png' className='border border-white border-opacity-30 w-full sm:w-[90%] h-[40px]
                        bg-black bg-opacity-50 rounded-[30px] flex items-center '/>
                }
            </button>
            </div>
            <div className='w-full h-[1px] bg-white/30 my-5'></div>
            <div className='w-full text-white gap-3 h-full overflow-y-auto overflow-x-hidden no-scrollbar '>
            {requests && (
                <>
                    {(friendRequests || !friendRequests) && friendRequests.length < 1 && <p>{t("No friend requests")}</p>}
                    {friendRequests?.map((request) => (
                    request.receiver_info.username === authUser?.username && (
                    <div key={request.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                        <button onClick={
                            () => router.push(`/profile/${request.sender_info.username}`)
                        }
                         className='flex items-center gap-2 w-full'>
                        <Image src={request.sender_info.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                        <div className='text-white text-[15px] sm:text-[20px]'>{request.sender_info.full_name}</div>
                        </button>
                        <div className='flex gap-3'>
                        <button onClick={() => handleAccept(request.id)} className='bg-[#37c8b7] hover:bg-[#32b7a8] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Accept</button>
                        <button onClick={() => handleReject(request.id)} className='bg-[#c75462] hover:bg-[#db5e6c] text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Reject</button>
                        </div>
                    </div>
                    )
                    ))}
                </>
                )}
                {sentRequest && (
                <>
                    {(friendRequestsSent || !friendRequestsSent) && friendRequestsSent.length < 1 && <p>{t("No sent requests")}</p>}
                    {friendRequestsSent?.map((request) => (
                    request.sender_info.username === authUser?.username && (
                    <div key={request.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                        <button onClick={
                            () => router.push(`/profile/${request.receiver_info.username}`)
                        }
                         className='flex items-center gap-2 w-full'>
                        <Image src={request.receiver_info.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                        <div className='text-white text-[15px] sm:text-[20px]'>{request.receiver_info.full_name}</div>
                        </button>
                        <div className='flex gap-1'>
                        <button onClick={() => handleReject(request.id)} className='bg-[#c75462] hover:bg-[#db5e6c] 
                        text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>Cancel</button>
                        </div>
                    </div>
                    )
                    ))}
                </>
                )}
                {isFriend && (
                <>
                    {friends && friends.length < 1 && <p>{t("No friends")}</p>}
                    {friends?.map((friend) => (
                    <div key={friend.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                        <button onClick={
                            () => router.push(`/profile/${friend.username}`)
                        }
                         className='flex items-center gap-2 w-full'>
                        <Image src={friend.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                        <div className='text-white text-[15px] sm:text-[20px]'>{friend.full_name}</div>
                        </button>
                        <div className=' gap-3 hidden sm:flex
                        '>
                        <button onClick={() => handleBlock(friend.username, setIsUpdate)}
                            className='bg-[#f44336] hover:bg-[#d32f2f]
                            text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>
                                    Block
                        </button>
                        <button onClick={() => removeFriend(friend.id)}
                            className='bg-[#c75462] hover:bg-[#db5e6c]
                             text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>
                                    Remove
                        </button>
                        <button onClick={() => handleChatClick(friend.username)} className='bg-[#0b637b] text-[15px]
                            sm:text-[20px] w-[80px] hover:bg-[#318aa2] sm:w-[100px] rounded-[30px] p-2'>
                                Chat
                        </button>
                        </div>
                        <div className='
                        relative flex flex-col items-center justify-center sm:hidden
                        '>
                        <button id='menu'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <MdMenuOpen className='text-white text-[30px]' /> : <SlMenu className='text-white text-[30px]' />}
                        </button>
                        {isMenuOpen && (
                            <div className='absolute top-6 right-0 bg-black p-2 rounded-lg block sm:hidden
                            '>
                                <button onClick={() => handleChatClick(friend.username)} className='text-white text-[15px]
                                    sm:text-[20px] w-[100px] rounded-[20px] p-2 hover:bg-[#318aa2]
                                    '>
                                    Chat
                                </button>
                                <button onClick={() => removeFriend(friend.id)}
                                className='text-white text-[15px] sm:text-[20px] w-[100px] rounded-[20px] p-2
                                hover:bg-[#db5e6c]
                                '>
                                    Remove
                                </button>
                                <button onClick={() => handleBlock(friend.username, setIsUpdate)}
                                className='text-white text-[15px] sm:text-[20px] w-[100px] rounded-[20px] p-2
                                hover:bg-[#d32f2f]
                                '>
                                    Block
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                    ))}
                </>
                )
                }
                {isBlocked && (
                <>
                    {blockedUsers && blockedUsers.length < 1 && <p>{t("No blocked users")}</p>}
                    {blockedUsers?.map((user) => (
                    <div key={user.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                        <div className='flex items-center gap-2 w-full'>
                        <Image src={user.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                        <div className='text-white text-[15px] sm:text-[20px]'>{user.full_name}</div>
                        </div>
                        <div className='flex gap-1'>
                        <button onClick={() => handleUnblock(user.username, setIsUpdate)}
                            className='bg-[#37c8b7] hover:bg-[#32b7a8]
                            text-[15px] sm:text-[20px] w-[80px] sm:w-[100px] rounded-[30px] p-2'>
                                    Unblock
                        </button>
                        </div>
                    </div>
                    ))}
                </>
                )
                }
                {isSearch && (
                    <>
                    {(!searchResults || searchResults.length < 1) && <p>{t("No search results")}</p>}
                    {searchResults?.map((result) => (
                        result?.username !== authUser?.username &&
                         (
                        <div key={result?.id} className='flex gap-2 xs:gap-0 flex-row min-w-[220px] xs:items-center xs:justify-between mb-3'>
                            <button onClick={
                                () => router.push(`/profile/${result?.username}`)
                            }
                             className='flex items-center gap-2 w-full'>
                                <Image src={result?.avatar_url} alt='profile_pic' width={50} height={50} className='rounded-full' />
                                <div className='text-white text-[15px] sm:text-[20px]'>{result?.full_name}</div>
                            </button>
                            <div className='flex gap-1'>
                                <button onClick={() => {
                                    friendRequestsSent.some((request) => request.receiver_info.username === result.username) ?
                                    handleReject(friendRequestsSent.find((request) => request.receiver_info?.username === result.username).id) :
                                    createFriendRequest(result?.id, authUser?.id)
                                }}
                                className={`${
                                    friendRequestsSent.some((request) => request.receiver_info.username === result.username) ?
                                    'bg-[#c75462] hover:bg-[#db5e6c]' : 'bg-[#37c8b7] hover:bg-[#32b7a8]'}
                                    text-[17px] xs:text-[20px] w-[75px] xs:w-[100px] rounded-[30px] p-2`}>
                                        {friendRequestsSent.some((request) => request.receiver_info.username === result.username) ? 'Cancel' : 'Send'}
                                </button>
                            </div>
                        </div>
                        )
                    ))}
                    </>
                )}
            </div>
        </div>
    </div>
  )
}

export default page