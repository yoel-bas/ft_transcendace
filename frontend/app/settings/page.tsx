'use client';
import React, { useEffect } from "react";
import { IoIosInformationCircle } from "react-icons/io";
import { FaFlag } from "react-icons/fa6";
import { PiLockKeyFill } from "react-icons/pi";
import Information from "../../components/information";
import Language from "../../components/language";
import Security from "../../components/security";
import Others from "../../components/others";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../../components/context/usercontext";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function Home() {
    const [activeComponent, setActiveComponent] = useState('information');
    const { t } = useTranslation();
    const { authUser, loading, fetchAuthUser } = useContext(UserContext);
    const pathname = usePathname();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'information':
        return <Information />;
      case 'language':
        return <Language />;
      case 'security':
        return <Security />;
      case 'others':
        return <Others />;
      default:
        return <Information />;
    }
  };
  useEffect(() => {
    !authUser && fetchAuthUser();
  }
  , [ pathname ]);


  return (
    <div className="text-white flex justify-center min-h-[800px] min-w-[300px] sm:justify-start lg:justify-center
               w-screen h-screen ">
        <div className="border-[0.5px] border-white flex sm:h-[85%] laptop:w-[75%] rounded-[50px] border-opacity-40
             bg-black bg-opacity-70 flex-col items-center mobile:w-full tablet:w-[80%] mx-2 w-[90%]
              h-[75%] pb-2 overflow-auto min-w-[300px] min-h-[600px] pt-4
             ">
            <div className=" flex items-center justify-around desktop:w-[85%] 3xl:w-[72%] desktop:h-[100px]
                            sm:border-[0.5px] border-white border-opacity-40 laptop:h-[80px]
                            sm:rounded-full  tablet:w-[90%]  tablet:h-[60px] laptop:w-[90%]
                            w-[90%] rounded-none
                            h-[50px]
                            ">
                <button onClick={() => setActiveComponent('information')}
                className={` tablet:bg-[#D9D9D9] bg-opacity-10 rounded-l-[50px]
                    flex items-center justify-center sm:border-r-[0.5px] border-white border-opacity-40 h-full w-[349px]
                      mobile:w-[200px] tablet:w-full border-0 border-r-0 max-sm:ml-3
                      text-sm p-2
                       text-white text-opacity-50 tablet:text-opacity-100
                    ${
                        activeComponent === 'information' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 text-white text-opacity-100 underline underline-offset-4' : 'tablet:bg-transparent'}
                    `}>
                    <IoIosInformationCircle className="desktop:w-[45px] desktop:h-[45px] text-white tablet:mr-1 laptop:mr-2 hidden sm:block
                      mobile:w-[30px] mobile:h-[30px] h-[20px] w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] text-[14px] mobile:text-[16px] flex justify-center">{t("Information")}</h1>
                </button>
                <button onClick={() => setActiveComponent('language')}
                className={`tablet:bg-[#D9D9D9] bg-opacity-10 
                flex items-center justify-center sm:border-r-[0.5px] border-white border-opacity-40 h-full w-[349px]
                  mobile:w-[200px] tablet:w-full border-0 border-r-0
                  text-sm p-2
                   text-white text-opacity-50 tablet:text-opacity-100
                    ${
                        activeComponent === 'language' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 text-white text-opacity-100 underline underline-offset-4' 
                        : 'tablet:bg-transparent'}
                `}>
                    <FaFlag className="desktop:w-[45px] desktop:h-[45px] text-white tablet:mr-1 laptop:mr-2 hidden sm:block
                      mobile:w-[30px] mobile:h-[30px] h-[20px] w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] text-[14px] mobile:text-[16px] ">{t("Language")}</h1>
                </button>
                <button onClick={() => setActiveComponent('security')}
                className={`tablet:bg-[#D9D9D9] bg-opacity-10 
                flex items-center justify-center sm:border-r-[0.5px] border-white border-opacity-40 h-full w-[349px]
                  mobile:w-[200px] tablet:w-full border-0 border-r-0
                  text-sm p-2
                   text-white text-opacity-50 tablet:text-opacity-100
                    ${
                        activeComponent === 'security' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 text-white text-opacity-100 underline underline-offset-4' : 'tablet:bg-transparent'}
                `}>
                    <PiLockKeyFill className="desktop:w-[45px] desktop:h-[45px] text-white tablet:mr-1 laptop:mr-2 hidden sm:block
                      mobile:w-[30px] mobile:h-[30px] h-[20px] w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] text-[14px] mobile:text-[16px] flex justify-center">{t("Security")}</h1>
                </button>
                <button onClick={() => setActiveComponent('others')}
                className={`tablet:bg-[#D9D9D9] bg-opacity-10 
                flex items-center justify-center  border-white border-opacity-40 h-full w-[349px]
                  mobile:w-[200px] tablet:w-full border-0 border-r-0
                  text-sm p-2 pr-5 rounded-r-[50px]
                   text-white text-opacity-50 tablet:text-opacity-100
                ${
                    activeComponent === 'others' ? 'tablet:bg-[#D9D9D9] tablet:bg-opacity-10 text-white text-opacity-100 underline underline-offset-4' : 'tablet:bg-transparent'}
            `}>
                    <TfiLayoutGrid3Alt className="desktop:w-[30px] desktop:h-[30px] text-white tablet:mr-1 laptop:mr-2 hidden sm:block
                      mobile:w-[25px] mobile:h-[25px] h-[20px] w-[20px]" />
                    <h1 className="laptop:text-[22px] text-center tablet:text-[16px] text-[14px] mobile:text-[16px] flex justify-center">{t("Others")}</h1>
                </button>
            </div>
            {renderComponent()}
        </div>
    </div>
  );
}