'use client'
import {useRouter} from "next/navigation";
// import { Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
export default function Home(){
    const router = useRouter();
    const {t} = useTranslation();
    return(
        <div className="w-full h-[100vh]  mobile:-top-6  bg-[url('/images/landing1.png')] bg-cover bg-no-repeat bg-center fixed   flex flex-col ">
            <div className="w-full h-full ">
                <h1 className=" md:text-[12vw] mobile:text-[45px] xs:text-[60px] lg:text-left mobile:text-center relative lg:left-16 lg:top-10 mobile:top-20 lg:text-[100px] 2xl:text-[8vw]  font-Earth font-bold text-[#bff1fafb] typewriter-animation cursor" >AliensPong</h1>
                <p className="md:text-[2vw] p-4 lg:text-left mobile:text-center relative  font-Earth font-thin lg:w-[60%] lg:top-5 mobile:top-14 lg:left-20 2xl:left-40 text-[#bff1fafb] lg:text-[15px]" >  
                    {t("Unleash your inner champion in a galactic duel—AlienSpong, where every match is out of this world!")}
                </p>
            </div>
                <div className="w-full h-full  flex justify-center items-center ">
                        <button className="  p-1  lg:w-[10%] lg:h-[10%]  rounded-lg bg-gradient-to-r from-[#00A88C] to-[#004237] text-white font-Pilot" onClick={()=>{
                            router.push('/login')
                        }}>{t("Start")}</button>
                </div>
        </div>
    );
}
