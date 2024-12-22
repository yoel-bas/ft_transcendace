`use client';`;
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { getCookies } from "./auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "./context/usercontext";
import Confirmation from "./Confirmation";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { iconButtonClasses } from "@mui/material";
import { text } from "stream/consumers";

export default function Others() {
  const [isOnline, setIsOnline] = useState("online");
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { fetchAuthUser, authUser } = useContext(UserContext);
  const [activeBoard, setActiveBoard] = useState(authUser?.board_name);
  const [showDialog, setShowDialog] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handelColorChange = async (color, board_name) => {
    try {
      const cookies = await getCookies();
      const csrftoken = cookies.cookies.csrftoken;
      const res = await axios.put(
        `${API}/update/`,
        {
          color: color,
          board_name: board_name,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrftoken,
          },
        }
      );
      setActiveBoard(res.data?.board_name);
      toast.success(t("Color Changed Successfully"));
    } catch (err) {
      toast.error(t("Error Changing Color"));
    }
  };

  const handelClick = () => {
    setShowDialog(true);
  };

  const anonymize = async () => {
    try {
      const cookies = await getCookies();
      const csrftoken = cookies.cookies.csrftoken;
      const res = await axios.put(`${API}/anonymize/`,{},
       {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      }
    );
      if (res.status === 200) {
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  const handelAnnonymizeClick = async () => {
    Swal.fire({
      title: "Are you sure?",
      html: `
        <p class="text-base sm:text-lg lg:text-xl text-red-500 font-bold">
          Anonymizing your account information will remove all personal data associated with your account and replace
           it with anonymous identifiers.
        </p>
        <p class="text-base sm:text-lg lg:text-xl text-blue-500 italic">
          and you will not be able to recover your account.
        </p>`,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
        popup: "bg-[#1A1F26] rounded-lg p-5 sm:p-6 md:p-8 lg:p-10",
        title: "text-lg sm:text-xl md:text-2xl font-semibold text-white",
        htmlContainer: "text-base sm:text-lg lg:text-xl",
      },
      confirmButtonText: "Yes, anonymize my account!",
      cancelButtonText: "Cancel",
    }).then(async(result) => {
      if (result.isConfirmed) {
        const isAnonymized = await anonymize();
  
        if (isAnonymized) {
          Swal.fire({
            title: "Anonymized!",
            html: `<p class="text-base sm:text-lg lg:text-xl text-green-500 font-bold">
              Your account has been anonymized.
              </p>`,
            icon: "success",
            customClass: {
              popup: "bg-[#1A1F26] rounded-lg p-5 sm:p-6 md:p-8 lg:p-10",
              title: "text-lg sm:text-xl md:text-2xl font-semibold text-white",
            },
          }).then(() => {
            router.push("/landing");
          }
          );
        } else {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while anonymizing your account. Please try again.",
            icon: "error",
            customClass: {
              popup: "bg-[#1A1F26] rounded-lg p-5 sm:p-6 md:p-8 lg:p-10",
              title: "text-lg sm:text-xl md:text-2xl font-semibold text-white",
            },
          });
        }
      }
    });
  };


  useEffect(() => {
    fetchAuthUser();
  }, [pathname]);
  return (
    <>
      <div className="text-white w-full h-full flex items-center laptop:justify-center flex-col
            overflow-y-auto no-scrollbar laptop:flex-row min-w-[300px]
             ">
        <div
          className="bg-[#1A1F26] bg-opacity-80 h-[550px] laptop:w-[400px] border-[0.5px] border-white border-opacity-20
          rounded-[50px] flex flex-col w-[90%] tablet:w-[90%] desktop:w-[663px] mt-5 laptop:mt-0
           laptop:mx-2
           ">
          <h1
            className="
            tablet:text-[25px] flex justify-center items-center text-white opacity-50
            text-[20px] h-[10%] mt-5
            "
          >
            {t("Game Appearance")}
          </h1>
            <div className="
                flex flex-col w-full items-center justify-center rounded-[50px] mt-5 h-[55%] 
            ">
          <h1
            className="tablet:text-[20px] ml-5 h-[10%] w-full
            mt-2
            text-[16px]  my-10
            "
          >
            {t("Default board skin")}
          </h1>
          <div className="flex justify-center items-center  w-full ">
            <button
              onClick={() => handelColorChange("#0B4464", "df")}
              className="flex justify-center items-center border desktop:w-32 desktop:h-32
                                laptop:w-20 laptop:h-20 rounded-full bg-[#0B4464]
                                w-14 h-14 tablet:w-24 tablet:h-24
                                ml-2
                            "
            >
              {activeBoard === "df" && (
                <IoMdCheckmark className="w-[48px] h-[48px] text-white" />
              )}
            </button>
            <button
              onClick={() => handelColorChange("#001F54", "bd1")}
              className="flex justify-center items-center border desktop:w-32 desktop:h-32 laptop:w-20 laptop:h-20 
                            w-14 h-14 mx-6 tablet:w-24 tablet:h-24
                            rounded-full  bg-[#001F54]"
            >
              {activeBoard === "bd1" && (
                <IoMdCheckmark className="w-[48px] h-[48px] text-white" />
              )}
            </button>
            <button
              onClick={() => handelColorChange("#872341", "bd2")}
              className="flex justify-center items-center border desktop:w-32 desktop:h-32 laptop:w-20
                        laptop:h-20 rounded-full  bg-[#872341]
                        w-14 h-14 tablet:w-24 tablet:h-24 mr-2
                    "
            >
              {activeBoard === "bd2" && (
                <IoMdCheckmark className="w-[48px] h-[48px] text-white" />
              )}
            </button>
          </div>
        </div>
        </div>
        <div className="bg-[#1A1F26] bg-opacity-80 h-[550px] laptop:w-[400px] border-[0.5px] border-white border-opacity-20
          rounded-[50px] flex flex-col w-[90%] tablet:w-[90%] desktop:w-[663px] mt-5 laptop:mt-0
           laptop:mr-2
           ">
                     <h1 className=" tablet:text-[25px] my-5 h-[20%] flex justify-center items-center text-[#FF0000] opacity-70
                        text-[20px]
                     ">
                         {t("Don't mess here")}
                     </h1>
                     <h1 className="tablet:text-[20px] ml-5 pb-4 text-[#FF0000] border-b-[0.5px] border-white border-opacity-40 w-[90%]
                            text-[18px] h-[10%]">
                         {t("Delete account")}
                     </h1>
                     <p className=" tablet:text-sm ml-5 mt-6 w-[65%] -tracking-tight text-xs">
                         {t("NB. Once you delete your account, there is no going back. Please be certain!")}
                     </p>
                     <div className=" flex w-full items-center justify-center rounded-[50px] mt-2">
                     <button onClick={handelClick}
                        className="rounded-[50px] mt-5 border-[0.5px] border-white border-opacity-40 
                            h-[50px] tablet:h-[80px] w-[90%] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70">
                         <h1 className="text-[22px] text-center text-[#FF0000] 
                         ">{t("Delete your account")}</h1>
                     </button>
            </div>
          <div className=" flex items-center w-full justify-center rounded-[50px] mt-5">
            <button onClick={handelAnnonymizeClick}
              className="rounded-[50px] w-[90%] mb-5 border-[0.5px] border-white border-opacity-40
                        h-[50px] tablet:h-[80px] bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70"
            >
              <h1
                className="tablet:text-[22px] text-center 
                         text-[15px] 
                         "
              >
                {t("Anonymize account information")}
              </h1>
            </button>
          </div>
          {showDialog && (<Confirmation title={t("Delete Account")} message={t("Are you sure you want to delete the account?")} action={t("Delete")}
          isOpen={showDialog} setIsOpen={setShowDialog} />)}
        </div>
      </div>
    </>
  );
}
