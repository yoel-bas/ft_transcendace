'use client';
import { FaEnvelope, FaUserAlt } from "react-icons/fa";
import PasswordHelper from "./passwordHelper";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from "react";
import { UserContext } from "./context/usercontext";
import axios from 'axios';
import { useTranslation } from "react-i18next";

interface SignupPageProps {
  onNavigate?: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [full_name, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setSignupData } = useContext(UserContext);
  const { t } = useTranslation();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const body = { full_name, username, email, password };
  
    try {
      const response = await axios.post(`${API}/signup/`, body, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 201) {
        toast.success(t("Account Created Successfully."));
        setSignupData({ email, password });
        onNavigate();
      }
    } catch (error) {
      const errorMessage =
      error.response?.data?.email?.[0] ||
      error.response?.data?.non_field_errors?.[0] ||
      error.response?.data?.username?.[0] ||
      error.response?.data?.password?.[0] ||
      error.response?.data?.full_name?.[0] ||
      t("Something went wrong");
  
      toast.error(errorMessage);
    }
  };
  

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSignup(event);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [full_name, username, email, password]);

    return (
    <motion.form onSubmit={(e) => e.preventDefault()} 
    className="flex flex-col items-center justify-center h-screen w-screen min-h-[800px]
      overflow-hidden">
      <div className="flex items-center justify-center h-[720px] max-sm:mb-10 laptop:w-[850px]
        tablet:w-[750px] tablet:h-[770px] desktop:h-[760px] desktop:w-[950px]
        laptop:h-[770px]  min-w-[500px] overflow-hidden
       ">
        <motion.div
          initial={{ opacity: 1, x: "50%" }}
          animate={{ opacity: 1, x: "0" }}
          transition={{ duration: 0.6 }}
          className="h-full tablet:w-3/4 z-10"
        >
          <img
            className="w-full h-full hidden sm:block rounded-l-[20px]"
            src="/images/login_icon.webp"
            alt="signupPageImage"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 1, x: "-50%" }}
          animate={{ opacity: 1, x: "0" }}
          transition={{ duration: 0.6 }}
          className="h-full w-1/2 max-sm:w-[70%] max-xl:w-[400px]
           bg-[#131E24] rounded-r-[20px] text-sm"
        >
          <img
            className="w-13 h-16 mx-auto mt-[18px]"
            src="/images/logop5.png"
            alt=""
          />
          <h1 className="sm:text-2xl font-bold text-center tablet:mt-[19px] sm:mb-[34px] text-white
            text-lg mb-2 mt-2">
            Create Account
          </h1>
          <div className="flex flex-col justify-center items-center text-white">
            <div className="flex justify-around border-[1px] border-gray-500 hover:bg-[#1E2E36] bg-transparent h-[46px] 
              w-[90%] rounded-[20px] mt-4 bg-[#293B45] rounded-tl-[10px] rounded-bl-[20px] rounded-tr-[20px]
              rounded-br-[10px] text-[19px] mobile:h-[48px]">
              <button
                onClick={onNavigate}
                className="text-white w-[50%] px-2 border-gray-500 
                rounded-tl-[10px] rounded-br-[10px] rounded-tr-[20px] sm:text-sm text-xs
                "
              >
                Login
              </button>
              <div
                className={`text-white w-[50%] px-2 rounded-tl-[10px] border-l-2
                 border-gray-500 rounded-custom-Radius flex items-center justify-center sm:text-sm text-xs
                 ${onNavigate ? "bg-[#293B45]" : "bg-[#131E24]"}`}
              >
                Sign up
              </div>
            </div>
            <div className="flex flex-col w-10/12 mt-7">
              <label className="text-sm text-[#949DA2] ">
                Full Name
              </label>
              <div className="relative flex">
                <input value={full_name} onChange={(e) => setFullName(e.target.value)}
                  type="text" autoFocus
                  className="border-b-[1px] border-[#949DA2] mb-7 h-[34px] w-full focus:outline-none bg-[#131E24] pr-6"
                />
                <FaUserAlt className="absolute right-0.5 text-[#949DA2] top-1" />
              </div>
            </div>
            <div className="flex flex-col w-10/12">
              <label className="text-sm text-[#949DA2] ">
                Username
              </label>
              <div className="relative flex">
                <input value={username} onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="border-b-[1px] border-[#949DA2] mb-7 h-[34px] w-full focus:outline-none bg-[#131E24] pr-6"
                />
                <FaUserAlt className="absolute right-0.5 text-[#949DA2] top-1" />
              </div>
            </div>
            <div className="flex flex-col w-10/12">
              <label className="text-sm text-[#949DA2] ">
                Email Address
              </label>
              <div className="relative flex">
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="border-b-[1px] border-[#949DA2] mb-7 h-[34px] w-full focus:outline-none bg-[#131E24] pr-6"
                />
                <FaEnvelope className="absolute right-0.5 text-[#949DA2] top-1" />
              </div>
            </div>
            <PasswordHelper setPassword={setPassword} password={password}/>
            <button type="submit" onClick={handleSignup}
             className="bg-[#293B45] mobile:mb-3 mb-3 w-10/12 h-[50px] mt-[20px] rounded-custom-Radius
             border-gray-500 border text-sm text-md">
              Sign Up
            </button>
          </div>
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SignupPage;
