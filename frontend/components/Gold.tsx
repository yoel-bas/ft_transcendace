'use client'
import React from "react";
import { useState, useEffect } from "react";

/* Rectangle 91 */


function Gold(playerdata){
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => {
        setScreenSize(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return(
        <div className="flex justify-between w-[90%] h-[65px] border box-border bg-gradient-to-b from-[rgba(0,0,0,0.1)] to-[rgba(247,180,46,0.88)] border-[rgba(255,255,255,0.2)] rounded-[50px]">
            <div className="flex  gap-3">
                <img   className="box-border w-[62px] h-[62px] border-2 border-[#FFC54D] rounded-full"  src={playerdata.minipic} alt="" />
                <div className="flex flex-col  gap-2">
                {((screenSize > 425 && screenSize < 1027) || screenSize > 1280)  ?
                    <h1 className="text-[20px] lg:text-[15px] xl:text-[20px] relative top-1 text-white" >{playerdata.name}</h1>:
                    playerdata.name.length > 10  ?
                    <h1 className="text-[20px] lg:text-[15px] xl:text-[20px] relative top-1 text-white" >{playerdata.name.slice(0 , 10)}...</h1>:
                    <h1 className="text-[20px] lg:text-[15px] xl:text-[20px] relative top-1 text-white" >{playerdata.name.slice(0 , 10)}</h1>
                }
                </div>
            </div>
            <img className="w-[64px] h-[64px]"    src="/images/Gold.png" alt="" />
        </div>
    )
}
export default Gold
