import { useState, useEffect, use } from "react";
import axios from "axios";
import { useContext } from "react";
import {disableTwoFactorAuth, verify2FA } from "./twoFa";
import { UserContext } from '../components/context/usercontext';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";


const Popup = ({
  isOpen,
  setIsOpen,
  enable2FA,
  setEnable2FA,
  code,
  setCode,
  setQrcode,
  qrcode,
}) => {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  var { authUser, setTry2fa, fetchAuthUser} = useContext(UserContext);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      // Allow only single digits
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
      // Focus on the next input
      if (index < 5) {
        document.getElementById(`digit-${index + 1}`).focus();
      }
      if (index === 5) {
        setCode(newValues.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValues = [...values];
      newValues[index] = ""; // Clear current input
      setValues(newValues);
      if (index > 0) {
        // Focus on the previous input
        document.getElementById(`digit-${index - 1}`).focus();
      }
    }
  };

  const clearValues = () => {
    setValues(["", "", "", "", "", ""]);
    setCode("");
    setIsOpen(false);
    setEnable2FA(enable2FA);
    setTry2fa(false);
  };

  const desable2fabutton = async () => {
    if (authUser) {
      disableTwoFactorAuth();
      setEnable2FA(false);
      await fetchAuthUser();
    }
  };

  const handelVerify = async () => {
    const status = await verify2FA(code)
    if (status == 200) {
      if (authUser?.enabeld_2fa) {
        desable2fabutton()
        setTry2fa(false)
        toast.success("Two Factor Authentication Disabled");
      } else {
          setTry2fa(true);
          toast.success("Two Factor Authentication Enabled");
      }
    clearValues();
    setIsOpen(false);
    await fetchAuthUser();
    setEnable2FA(authUser?.enabeld_2fa);
  }
    fetchAuthUser();
    
  }
  
  useEffect(() => {
    authUser && fetchAuthUser();
    if (authUser?.username) {
      setUsername(authUser?.username);
    }
  }, [authUser?.enabeld_2fa, enable2FA, code, username]);


  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handelVerify();
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
              bg-opacity-75 flex items-center justify-center h-screen w-full min-h-[700px] overflow-hidden min-w-[400px]">
          <div
            className="bg-[#1A1F26] flex w-[380px] tablet:w-[500px] h-[670px]
            laptop:w-[800px] laptop:flex-row flex-col items-center justify-center laptop:h-[400px]
            desktop:w-[1000px] laptop:min-w-[400px] overflow-hidden rounded-2xl">
                        {
            !authUser?.enabeld_2fa &&
            <div
              className="
            flex items-center justify-center mt-5 laptop:mt-0 
            "
            >
              {!qrcode && (
                <div className="
                  flex items-center justify-center w-[250px] h-[250px]  rounded-[30px]">
                  {
                    <MoonLoader
                    color="#fff"
                    loading={qrcode ? false : true}
                    size={50}
                    />
                  }
                </div>
              )
              }
              {qrcode && (
              <img
                className={`bg-white text-white
              tablet:w-[300px] tablet:h-[300px] w-[250px] h-[250px]
               rounded-[30px] tablet:ml-5 mt-5 laptop:mt-0
              `}
                src={`${qrcode}`}
                alt="2fa QR Code"
              />
              )}
            </div>
            }
            <div className="py-[70px] px-6 rounded-lg shadow-lg ">
              <h1 className="text-xl font-bold mb-4">Enter The Code</h1>
              <p className="text-white w-full mb-4">
                Enter the six-digit code from your authenticator app:
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex justify-between mb-6 text-black"
              >
                {values.map((value, index) => (
                  <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    maxLength={1}
                    value={value}
                    autoFocus={index === 0}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-10 tablet:w-12 tablet:h-12 text-center tablet:mx-2 text-2xl border border-gray-300 rounded-lg focus:outline-none"
                  />
                ))}
              </form>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 "
                  onClick={handelVerify}
                  disabled={values.some((val) => val === "")} // Disable until all fields are filled
                >
                  Verify
                </button>
                <button
                  className="bg-gradient-to-r from-[#1A1F26]/90 to-[#000]/70 text-white p-2 px-4 rounded-lg border-[0.5px] border-white border-opacity-40 "
                  onClick={() => {
                    clearValues();
                    if (!authUser.enabeld_2fa)
                    {
                        disableTwoFactorAuth();
                        setQrcode('');
                    }
                  }
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
