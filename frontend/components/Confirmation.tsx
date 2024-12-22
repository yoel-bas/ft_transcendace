import { useState, useEffect, use } from "react";
import axios from "axios";
import { useContext } from "react";
import {disableTwoFactorAuth, verify2FA } from "./twoFa";
import { UserContext } from './context/usercontext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { getCookies } from "./auth";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";


const Confirmation = ({
  isOpen,
  setIsOpen,
  title,
  message,
  action,
}) => {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { t } = useTranslation();

  const deleteAccount = async () => {
    try {
      const cookies = await getCookies();
      const csrftoken = cookies.cookies.csrftoken;
      const res = await axios.delete(`${API}/delete/`, {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      });
      toast.success(t("Account Deleted Successfully"));
      router.push("/landing");
    } catch (err) {
      toast.error(t("Error Deleting Sccount"));
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      deleteAccount();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
  };
}
, [handleEnterPress]);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500
              bg-opacity-75 flex items-center justify-center min-h-screen w-full overflow-hidden min-w-[300px]">
          <div
            className="bg-[#1A1F26] flex w-[380px] tablet:w-[500px] h-[220px]
            laptop:flex-row flex-col laptop:w-[600px] justify-center items-center
               overflow-hidden rounded-2xl py-10 
          "
          >
            <div className="py-[70px] px-6 rounded-lg shadow-lg ">
              <h1 className="
                text-white text-2xl font-bold w-full mb-4
                border-b-[0.5px] border-white border-opacity-40
                pb-2
              "> {title}
              </h1>
              <p className="text-white w-full mb-4 overflow-y-auto no-scrollbar h-[50px]">
                {message}
              </p>
              <div className="flex justify-between">
                <button
                  className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white
                  p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 "
                  onClick={deleteAccount}
                >
                  {action}
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 "
                  onClick={()=>{
                    setIsOpen(false);
                  }}>
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirmation;
