'use client'
import React from "react";
import { useState, useEffect } from "react";

function Basic(playerdata){
    const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
    return(
        <div className="flex  gap-4 w-[90%] h-[65px] border border-[rgba(255, 255, 255, 0.002)] rounded-[50px] bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(14,14,14,0.5)] basic_b">
            <img   className="box-border w-[60px] h-[60px]  border-[#7b7b7a] rounded-full"  src={playerdata.minipic} alt="" />
            <div className="flex flex-col  gap-2">

            {((screenSize > 425 && screenSize < 1027) || screenSize > 1280)  ?
                    <h1 className="text-[20px] lg:text-[15px] xl:text-[20px] relative top-1 text-white" >{playerdata.name}</h1>:
                    playerdata.name.length > 15  ?
                    <h1 className="text-[20px] lg:text-[15px] xl:text-[20px] relative top-1 text-white" >{playerdata.name.slice(0 , 15)}...</h1>:
                    <h1 className="text-[20px] lg:text-[15px] xl:text-[20px] relative top-1 text-white" >{playerdata.name.slice(0 , 10)}</h1>
                }
            </div>
        </div>
    )
}
export default Basic