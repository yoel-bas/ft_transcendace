`use client`;
import { FaEnvelope } from "react-icons/fa";
import PasswordHelper from "./passwordHelper";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams} from 'next/navigation';
import axios from 'axios';
import { useContext } from "react";
import { UserContext } from "./context/usercontext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from "react-i18next";

interface SigninPageProps {
  onNavigate?: () => void;
}

const SigninPage: React.FC<SigninPageProps> = ({ onNavigate}) => {
  const router = useRouter();
  const { setIsAuthenticated, signupData, fetchAuthUser, authUser} = useContext(UserContext);
  const [password, setPassword] = useState(
    signupData?.password || ""
  );
  const [email, setEmail] = useState(
    signupData?.email || ""
  );
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const GG_REDIRECT_URL=process.env.NEXT_PUBLIC_GG_REDIRECT_URL
  const INTRA_REDIRECT_URL=process.env.NEXT_PUBLIC_INTRA_REDIRECT_URL
  const GG_CLIENT_ID=process.env.NEXT_PUBLIC_GG_CLIENT_ID
  const INTRA_CLIENT_ID=process.env.NEXT_PUBLIC_INTRA_CLIENT_ID
  const INTRA_AUTH_URL = process.env.NEXT_PUBLIC_INTRA_42_AUTH_URL
  const GG_AUTH_URL = process.env.NEXT_PUBLIC_GG_AUTH_URL

  const URL = `${GG_AUTH_URL}?redirect_uri=${GG_REDIRECT_URL}&prompt=consent&response_type=code&client_id=${GG_CLIENT_ID}&scope=openid%20email%20profile&access_type=offline`;
  const URL42 = `${INTRA_AUTH_URL}?client_id=${INTRA_CLIENT_ID}&redirect_uri=${INTRA_REDIRECT_URL}&response_type=code`;
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSignin = async (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    try {
      const response = await axios.post(`${API}/login/`, body, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setTimeout(() => {
          toast.success(t('Logged In Successfully'),
          
        );
        }, 400);
        router.push("/profile");
      }
    } catch (error) {
      const errorMessages = 
      error.response?.data?.email?.[0] ||
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.password?.[0] ||
        t("Something went wrong");

      toast.error(errorMessages);
      setIsAuthenticated(false);
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSignin(event);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
  };
}
, [email, password]);

return (
    <motion.form onSubmit={(e) => e.preventDefault()} 
    className=" flex flex-col items-center justify-center h-screen w-screen
      min-h-[800px] overflow-hidden
      ">
      <div
        className="flex items-center justify-center w-full h-[720px] mb-10 laptop:w-[850px]
        tablet:w-[620px] tablet:h-[770px] desktop:h-[760px] desktop:w-[950px]
        laptop:h-[770px]  min-w-[500px] overflow-hidden
        ">
        <motion.div
          initial={{ opacity: 1, x: "50%" }}
          animate={{ opacity: 1, x: "0" }}
          transition={{ duration: 0.6 }}
          className=" h-full w-1/2 max-sm:w-[70%] max-xl:w-[400px]
           bg-[#131E24] rounded-l-[20px] text-sm">
          <img
            className="w-13 h-16 mx-auto mt-[18px]"
            src="/images/logop5.png"
            alt=""
          />
          <h1 className="sm:text-2xl font-bold text-center tablet:mt-[19px] sm:mb-[34px] text-white
            text-lg mb-2 mt-2">
            Sign In
          </h1>
          <div className="flex flex-col justify-center items-center text-white">
            <div className="flex justify-around border-[1px] border-gray-500 hover:bg-[#1E2E36] bg-transparent h-[46px] 
              w-[90%] rounded-[20px] mt-4 bg-[#293B45] rounded-tl-[10px] rounded-bl-[20px] rounded-tr-[20px]
              rounded-br-[10px] text-[19px] mobile:h-[48px]">
              <div
                className={`flex items-center justify-around text-white w-[55%] text-xs
                 border-gray-500 rounded-tl-[10px] rounded-br-[10px] 
                rounded-tr-[20px] sm:text-sm border-r-2
                rounded-bl-[20px]
                ${onNavigate ? "bg-[#293B45]" : "bg-[#131E24]"}`}>
                Login
              </div>
              <button
                onClick={onNavigate}
                className="text-white rounded-tl-[10px] w-[50%] border-gray-500
                rounded-custom-Radius flex items-center justify-center sm:text-sm text-xs">
                Sign up
              </button>
            </div>
            <Link href={URL42}
              className="
                w-full flex justify-center items-center"
            >
              <button
                className="flex items-center bg-[#131E24] text-white w-[90%] justify-center py-2 rounded mt-7 
                  hover:bg-[#1E2E36] rounded-tl-[13px] rounded-bl-[22px] rounded-tr-[22px] rounded-br-[10px] border border-gray-500"
              >
                <img
                  src="/images/logo42.png"
                  alt="Intra Icon"
                  className="w-6 h-6 mr-2"
                />
                Sign in with Intra
              </button>
            </Link>
            <Link href={URL} className="
              w-full flex items-center justify-center
            ">
            <button className="flex items-center bg-[#131E24] text-white
            w-[90%] py-2 rounded mt-4  hover:bg-[#1E2E36] rounded-tl-[9px]
            rounded-bl-[18px] rounded-tr-[22px] rounded-br-[10px] border border-gray-500  justify-center">
              <img
                className="w-6 h-6 mr-2 fill-white"
                src="/images/logo_google.png"
                alt="Google Icon"
                />
                Sign in with Google
            </button>
            </Link>
            <div className="flex items-center justify-center w-10/12 text-[#949DA2]">
              <img
                className="sm:w-full w-[40%] h-[50px]"
                src="/images/line2.png"
                alt="line"
              />
              <p className="text-[#949DA2] text-center mx-1 text-sm">OR</p>
              <img
                className=" sm:w-full w-[40%] h-[50px]"
                src="/images/line2.png"
                alt="line"
              />
            </div>
            <div className="flex flex-col w-10/12 mt-3">
              <label className="text-sm  text-[#949DA2]">
                Email Address
              </label>
              <div className="relative flex">
                <input value={email} onChange={(e) => setEmail(e.target.value)}
                  type="email" autoFocus
                  className="border-b-[1px] border-[#949DA2] mb-7 h-[34px] w-full focus:outline-none bg-[#131E24] pr-6"
                />
                <FaEnvelope className="absolute right-0.5 text-[#949DA2] top-1" />
              </div>
            </div>
            <PasswordHelper setPassword={setPassword} password={password}/>
            <button type="submit" onClick={handleSignin}
            className="bg-[#293B45] mobile:mb-3 mb-3 w-10/12 h-[50px] mt-[20px] rounded-custom-Radius
                    border-gray-500 border text-sm text-md
                     ">
              Sign In
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 1, x: "-50%" }}
          animate={{ opacity: 1, x: "0" }}
          transition={{ duration: 0.6 }}
          className="h-full tablet:w-3/4"
        >
          <img
            className="w-full h-full hidden sm:block rounded-r-[20px]"
            src="/images/login_icon.webp"
            alt="loginPageImage"
          />
        </motion.div>
      </div>
    </motion.form>
  );
};

export default SigninPage;
