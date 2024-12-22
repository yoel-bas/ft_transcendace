"use client";
import React, { useEffect, useContext, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./styles/global.css";
import { usePathname, useRouter } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { UserProvider, UserContext } from "../components/context/usercontext";
import "../i18n";
import { Toaster } from "react-hot-toast";
import NotificationMenu from "../components/NotificationMenu";
import DropDown from "../components/DropDown";
import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { Provider } from "@/components/ui/provider";
import Image from "next/image";
import Link from "next/link";
import { NotificationProvider } from "@/components/context/NotificationContext";
import { useNotificationContext } from "@/components/context/NotificationContext";
import { OnlineStatusProvider } from "@/components/context/OnlineStatusContext";


function RootLayout({ children }: any) {
  const pathname = usePathname();
  const exclude = ["/login", "/twofa", "/landing", "/game", "/game/remotegame", "/game/tournament", "/game/tournament/remote"];
  const router = useRouter();

  return (
    <UserProvider>
      <OnlineStatusProvider>
        <NotificationProvider>
          <html lang="en">
            <head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
                title="TrueTalk"
              />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link href="https://fonts.googleapis.com/css2?family=Chelsea+Market&family=Faculty+Glyphic&family=Nabla&display=swap" rel="stylesheet" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link href="https://fonts.googleapis.com/css2?family=Bona+Nova+SC:ital,wght@0,400;0,700;1,400&family=Doto:wght@100..900&display=swap" rel="stylesheet" />
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lilita+One&display=swap" rel="stylesheet" />
              <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bowlby+One&family=Itim&family=Lilita+One&display=swap" rel="stylesheet" />
              <link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&display=swap" rel="stylesheet"></link>
              <link href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&display=swap" rel="stylesheet"></link>
              <link href="https://fonts.cdnfonts.com/css/barcade" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/barcade" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/earth-orbiter" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/pilot-command" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/landepz-glitch" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/veritas-sans" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/informative" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/warriot-tech" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/nevermind-bauhaus" rel="stylesheet" /> 
              <link href="https://fonts.cdnfonts.com/css/a-space-demo" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/flexsteel" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/oceanic-drift" rel="stylesheet"/>
              <link href="https://fonts.cdnfonts.com/css/nk57-monospace" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/red-hat-mono" rel="stylesheet" />
              <link href="https://fonts.cdnfonts.com/css/freemono" rel="stylesheet" />
                

                
                
                
              <title>
                {pathname.charAt(1).toUpperCase() + pathname.slice(2)}
              </title>
            </head>
            <body className="h-screen">
              <AuthProtectedLayout
                pathname={pathname}
                exclude={exclude}
                router={router}
              >
                {children}
              </AuthProtectedLayout>
            </body>
          </html>
        </NotificationProvider>
      </OnlineStatusProvider>
    </UserProvider>
  );
}

function AuthProtectedLayout({ children, pathname, exclude, router }: any) {
  const {
    loading,
    isAuthenticated,
    fetchAuthUser,
    authUser,
    searchResults,
    searchLoading,
    isSearching,
    setIsSearching,
  } = useContext(UserContext);
  const [token, setToken] = useState(null);
  const [notificationClicked, setNotificationClicked] = useState(false);
  const [profileDropDownClicked, setProfileDropDownClicked] = useState(false);
  const { t } = useTranslation();
  const {notifications, notifSocket, fetchNotifications} = useNotificationContext();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAuthUser();
      if (pathname !== "/twofa" && authUser?.enabeld_2fa && !authUser?.twofa_verified) {
        router.push("/twofa");
      } else
      if (pathname === "/login" || (pathname === "/twofa"
          && (!authUser?.enabeld_2fa || (authUser?.enabeld_2fa && authUser?.twofa_verified)))) {
        router.push("/profile");
      }
      fetchNotifications();
    }
  }, [pathname, isAuthenticated]);

    const handleDocumentClick = (e: any) => {
        if (e.target.id !== 'notification-id') {
            setNotificationClicked(false);
        }
        if (e.target.id !== 'profile-id') {
            setProfileDropDownClicked(false);
        }
        if (e.target.id !== 'textsearch-id') {
            setIsSearching(false);
        }
    }

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const loginSuccessCookie = cookies.find(cookie => cookie.startsWith('loginSuccess='));
    if (loginSuccessCookie) {
      const cookieValue = loginSuccessCookie.split('=')[1];
      if (cookieValue === 'true') {
        setTimeout(() => {
          toast.success(t('Logged In Successfully'));
        }, 1200);
      } else if(cookieValue === 'false') {
        toast.error(t('Something Went Wrong'));
      }
      document.cookie = 'loginSuccess=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    }
  }
  , []);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen w-screen bg-main-bg border
                border-black bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]"
      >
        <ScaleLoader color="#949DA2" loading={loading} height={40} width={6} />
      </div>
    );
  }

  return (
    <div className="bg-main-bg border border-black
        w-screen h-full bg-cover bg-no-repeat bg-center fixed min-w-[280px] min-h-[800px]">
      {!exclude.includes(pathname) && (
        <div className="h-[100px]">
          <Header
            setNotificationClicked={setNotificationClicked}
            notificationClicked={notificationClicked}
            setProfileDropDownClicked={setProfileDropDownClicked}
            profileDropDownClicked={profileDropDownClicked}
          />
        </div>
      )}

            <div className="h-[95%] flex flex-col-reverse sm:flex-row max-sm:justify-center max-sm:items-center">
                {/* Render Sidebar if pathname is not in exclude list */}
                {!exclude.includes(pathname) && (
                    <div className="flex sm:flex-col w-full sm:w-[100px] ">
                        <Sidebar />
                    </div>
                )}
                <div className="h-[100%]  w-full flex ">
                    {
                        (isAuthenticated && isSearching) && (
                            <div className='z-50 fixed left-0 flex items-center justify-center w-full h-[600px] text-white'>
                                <div className='border border-white/40 ml-[-100px] w-[50%] sm:w-[400px] md:w-[500px] lg:w-[600px] 2xl:w-[700px] h-full bg-black bg-opacity-80 rounded-[30px] no-scrollbar overflow-y-auto scroll-smooth'>
                                    <div className='border-b border-white/40 p-4'>
                                        <span className='text-white text-[20px]'>Search Results</span>
                                    </div>
                                    {searchLoading && <div/>}
                                    {searchResults.map((user: any) => (
                                        user.username !== authUser?.username &&
                                        <Link key={user.id} href={`/profile/${user.username}/`} className='w-full p-4 flex gap-3 items-center hover:bg-white hover:bg-opacity-10 hover:cursor-pointer'>
                                            <div className='w-[50px] h-[50px] rounded-full'>
                                                <Image src={user?.avatar_url} height={50} width={50} alt='avatar' className='rounded-full' />
                                            </div>
                                            <span>{user.full_name}</span>
                                        </Link>
                                    ))} 
                                </div>
                            </div>
                        )
                    }
          {isAuthenticated && notificationClicked && <NotificationMenu />}
          {isAuthenticated && profileDropDownClicked && (
            <div className="w-[calc(100%_-_100px)] fixed h-[170px] flex flex-row-reverse">
              <DropDown
                className="w-[250px] h-[50px] flex items-center border
                border-white border-opacity-20 cursor-pointer hover:bg-white
                hover:bg-opacity-10 bg-[#201f1f] bg-opacity-100"
                items={["View Profile", "Friend Requests", "Logout"]}
              />
            </div>
          )}
          <Provider >
          {children}
          </Provider>
          <ToastContainer
              position="top-center"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover
              draggable
              // stacked
              theme="dark"
              progressStyle={{ backgroundColor: "#4cd964" }}
              style={{
                fontSize: "10px",
                textAlign: "center",
                color: "#fff",
                width: "70%",
                maxWidth: "400px",
                margin: "0 auto", // Ensure horizontal centering
                left: "50%", // Shift to center
                top: "20px", // Ensure top position
                transform: "translateX(-50%)", // Compensate for the left shift
              }}
            />
        </div>
      </div>
    </div>
  );
}

export default RootLayout;
